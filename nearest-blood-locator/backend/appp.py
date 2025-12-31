# backend/app.py
import os
import datetime
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

import pymysql
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import create_access_token

# ---------------------------------------------------
# App setup
# ---------------------------------------------------
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ---------------------------------------------------
# Database config (FORCE TCP)
# ---------------------------------------------------
DB_USER = os.environ.get("DB_USER", "root")
DB_PASS = os.environ.get("DB_PASS", "Suryasql@426")
DB_HOST = os.environ.get("DB_HOST", "127.0.0.1")
DB_PORT = os.environ.get("DB_PORT", "3306")
DB_NAME = os.environ.get("DB_NAME", "nearblood")

DB_PASS_QUOTED = quote_plus(DB_PASS)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://{DB_USER}:{DB_PASS_QUOTED}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)
# app.config["SQLALCHEMY_BINDS"] = {
#     'blood_bank': f"mysql+pymysql://{DB_USER}:{DB_PASS_QUOTED}@{DB_HOST}:{DB_PORT}/blood_bank"
# }
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

print("=" * 50)
print("DATABASE URI:", app.config["SQLALCHEMY_DATABASE_URI"])
print("=" * 50)

# ---------------------------------------------------
# JWT config
# ---------------------------------------------------
app.config["JWT_SECRET_KEY"] = os.environ.get(
    "JWT_SECRET_KEY", "super-secret-key-change-in-production"
)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=24)

# ---------------------------------------------------
# Extensions
# ---------------------------------------------------
from extensions import db, bcrypt, jwt
db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# ---------------------------------------------------
# Models (Imported to ensure registration)
# ---------------------------------------------------
from models import User, Donor, Recipient, BloodBank, BloodStock

# ---------------------------------------------------
# Blueprints
# ---------------------------------------------------
from routes.donor_routes import donor_bp
from routes.recipient_routes import recipient_bp
from routes.blood_bank_routes import blood_bank_bp
from routes.blood_stock_routes import blood_stock_bp

app.register_blueprint(donor_bp, url_prefix='/api/donors')
app.register_blueprint(recipient_bp, url_prefix='/api/recipients')
app.register_blueprint(blood_bank_bp, url_prefix='/api/bloodbanks')
app.register_blueprint(blood_stock_bp, url_prefix='/api/blood-stock')

# ---------------------------------------------------
# Ensure database exists
# ---------------------------------------------------
def ensure_database_exists():
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            port=int(DB_PORT)
        )
        with conn.cursor() as cur:
            cur.execute(
                f"""
                CREATE DATABASE IF NOT EXISTS `{DB_NAME}`
                CHARACTER SET utf8mb4
                COLLATE utf8mb4_unicode_ci;
                """
            )
        conn.commit()
        conn.close()
        print(f"✓ Database '{DB_NAME}' is ready")
    except Exception as e:
        print(f"✗ Database creation error: {e}")
        raise

# ---------------------------------------------------
# Error handlers
# ---------------------------------------------------
@app.errorhandler(400)
def bad_request(error):
    return jsonify({"msg": "Bad request", "error": str(error)}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({"msg": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({"msg": "Internal server error"}), 500

# ---------------------------------------------------
# Routes
# ---------------------------------------------------

@app.route("/api/ping", methods=["GET"])
def ping():
    return jsonify({
        "msg": "pong",
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }), 200

# ---------------------------------------------------
# AUTH ROUTES (Register & Login)
# ---------------------------------------------------

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    print("=" * 60)
    print("RECEIVED REGISTRATION DATA:")
    print(data)
    print("=" * 60)
    
    if not data: 
        return jsonify({"msg": "No data provided"}), 400

    username = (data.get("username") or "").strip().lower()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip()
    blood_group = (data.get("bloodGroup") or "").strip().upper()
    city = (data.get("city") or "").strip()
    role = (data.get("userType") or "donor").strip().lower()
    password = data.get("password") or ""
    
    # Get latitude and longitude from request
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    
    print(f"Extracted values:")
    print(f"  username: {username}")
    print(f"  email: {email}")
    print(f"  phone: {phone}")
    print(f"  blood_group: {blood_group}")
    print(f"  city: {city}")
    print(f"  role: {role}")
    print(f"  latitude: {latitude}")
    print(f"  longitude: {longitude}")

    if not username or not email or not password:
        return jsonify({"msg": "Username, email, and password required"}), 400

    # Check for existing username
    existing_username = User.query.filter_by(username=username).first()
    if existing_username:
        return jsonify({"msg": f"Username '{username}' is already taken"}), 409
    
    # Check for existing email
    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        return jsonify({"msg": f"Email '{email}' is already registered"}), 409

    print("Creating User object...")
    user = User(username=username, email=email, phone=phone, role=role)
    user.set_password(password)

    try:
        db.session.add(user)
        db.session.flush()  # Get the user.id without committing
        print(f"User created with ID: {user.id}")

        # Create profile record based on role WITH latitude/longitude
        if role == 'donor':
            print("Creating Donor profile...")
            
            # Validate required fields for donor
            if not blood_group:
                db.session.rollback()
                return jsonify({"msg": "Blood group is required for donors"}), 400
            
            donor_data = {
                'user_id': user.id,
                'name': username,
                'blood_group': blood_group,
                'phone': phone,
                'city': city,
                'availability_status': True,
                'latitude': latitude,
                'longitude': longitude
            }
            print(f"Donor data to insert: {donor_data}")
            
            donor = Donor(**donor_data)
            db.session.add(donor)
            print("Donor added to session")
            
        elif role == 'recipient':
            print("Creating Recipient profile...")
            
            # Validate required fields for recipient
            if not blood_group:
                db.session.rollback()
                return jsonify({"msg": "Blood group is required for recipients"}), 400
            
            recipient_data = {
                'user_id': user.id,
                'name': username,
                'required_blood_group': blood_group,
                'phone': phone,
                'city': city,
                'urgency_level': 'Medium'
            }
            
            # Only add lat/long if Recipient model has these fields
            if hasattr(Recipient, 'latitude'):
                recipient_data['latitude'] = latitude
            if hasattr(Recipient, 'longitude'):
                recipient_data['longitude'] = longitude
            
            print(f"Recipient data to insert: {recipient_data}")
            recipient = Recipient(**recipient_data)
            db.session.add(recipient)
            print("Recipient added to session")
            
        elif role == 'bank':
            print("Creating BloodBank profile...")
            
            bank_data = {
                'name': username,
                'city': city,
                'contact_number': phone,
                'created_by': user.id,
                'latitude': latitude,
                'longitude': longitude
            }
            print(f"BloodBank data to insert: {bank_data}")
            
            bank = BloodBank(**bank_data)
            db.session.add(bank)
            print("BloodBank added to session")
        
        print("Committing to database...")
        db.session.commit()
        print("✓ Registration successful!")
        
        return jsonify({"msg": "Registration successful", "user": user.to_dict()}), 201
        
    except Exception as e:
        db.session.rollback()
        print("=" * 60)
        print("❌ REGISTRATION ERROR:")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print("=" * 60)
        
        import traceback
        traceback.print_exc()
        
        return jsonify({
            "msg": "Registration failed", 
            "error": str(e),
            "error_type": type(e).__name__
        }), 500

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data: 
        return jsonify({"msg": "No data provided"}), 400

    identifier = (data.get("username") or data.get("identifier") or data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(
        identity=str(user.id), 
        additional_claims={
            "username": user.username, 
            "email": user.email,
            "role": user.role
        }
    )
    return jsonify({
        "msg": "Login successful", 
        "access_token": access_token, 
        "user": user.to_dict()
    }), 200

# ---------------------------------------------------
# Run
# ---------------------------------------------------
if __name__ == "__main__":
    ensure_database_exists()
    with app.app_context():
        db.create_all()
        print("âœ… Database tables created")
    app.run(debug=True, host="0.0.0.0", port=5000)