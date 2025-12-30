# backend/app.py
import os
import datetime
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

import pymysql
from flask import Flask, jsonify
from flask_cors import CORS

# ---------------------------------------------------
# App setup
# ---------------------------------------------------
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ---------------------------------------------------
# Database config (FORCE TCP)
# ---------------------------------------------------
DB_USER = os.environ.get("DB_USER", "root")
DB_PASS = os.environ.get("DB_PASS", "")
DB_HOST = os.environ.get("DB_HOST", "127.0.0.1")
DB_PORT = os.environ.get("DB_PORT", "3306")
DB_NAME = os.environ.get("DB_NAME", "blood_locator")

DB_PASS_QUOTED = quote_plus(DB_PASS)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://{DB_USER}:{DB_PASS_QUOTED}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)
app.config["SQLALCHEMY_BINDS"] = {
    'blood_bank': f"mysql+pymysql://{DB_USER}:{DB_PASS_QUOTED}@{DB_HOST}:{DB_PORT}/blood_bank"
}
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
from routes.auth_routes import auth_bp
from routes.donor_routes import donor_bp
from routes.recipient_routes import recipient_bp
from routes.blood_bank_routes import blood_bank_bp
from routes.blood_stock_routes import blood_stock_bp

# Note: auth_routes.py might need update or we can keep Register/Login in app.py for now to avoid breaking too much?
# The task didn't ask to refactor Auth, so I'll keep Register/Login in app.py OR move them if I want to be very clean.
# I'll keep Register/Login in app.py as per my implementation plan (I didn't plan to refactor auth).
# Wait, I didn't import auth_routes earlier, but it was in the file list.
# Let's check if I should use auth_routes or keep them here.
# Existing app.py had Register/Login inline.
# I will NOT register auth_bp unless I verified it works. I haven't touched it.
# I will keep Register/Login inline to ensure stability.

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
        
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE DATABASE IF NOT EXISTS `blood_bank`
                CHARACTER SET utf8mb4
                COLLATE utf8mb4_unicode_ci;
                """
            )
        conn.commit()
        
        conn.close()
        print(f"✅ Database '{DB_NAME}' and 'blood_bank' are ready")
    except Exception as e:
        print(f"❌ Database creation error: {e}")
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

# KEEPING AUTH ROUTES HERE FOR STABILITY (NOT REFACORING AUTH IN THIS TASK)
from flask import request
from flask_jwt_extended import create_access_token

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data: return jsonify({"msg": "No data provided"}), 400

    username = (data.get("username") or "").strip().lower()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip()
    blood_group = (data.get("bloodGroup") or "").strip().upper()
    city = (data.get("city") or "").strip()
    role = (data.get("userType") or "donor").strip().lower()
    password = data.get("password") or ""

    if not username or not email or not password:
        return jsonify({"msg": "Username, email, and password required"}), 400

    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user: return jsonify({"msg": "User already exists"}), 409

    user = User(username=username, email=email, phone=phone, role=role)
    user.set_password(password)

    try:
        db.session.add(user)
        db.session.commit()

        # Immediately create profile record based on role
        if role == 'donor':
            donor = Donor(
                user_id=user.id,
                name=username,
                blood_group=blood_group,
                phone=phone,
                city=city,
                availability_status=True
            )
            db.session.add(donor)
        elif role == 'recipient':
            recipient = Recipient(
                user_id=user.id,
                name=username,
                required_blood_group=blood_group,
                phone=phone,
                city=city,
                urgency_level='Medium'
            )
            db.session.add(recipient)
        elif role == 'bank':
            # Create a default blood bank record if needed, or wait for dashboard entry
            # The prompt says "Verify Donor and Blood Bank tables are working correctly"
            # I'll create a basic entry if name is provided (username is used as bank name)
            bank = BloodBank(
                name=username,
                city=city,
                contact_number=phone,
                created_by=user.id
            )
            db.session.add(bank)
        
        db.session.commit()
        return jsonify({"msg": "Registration successful", "user": user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Registration failed", "error": str(e)}), 500

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data: return jsonify({"msg": "No data provided"}), 400

    identifier = (data.get("username") or data.get("identifier") or data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id), additional_claims={"username": user.username, "email": user.email})
    return jsonify({"msg": "Login successful", "access_token": access_token, "user": user.to_dict()}), 200

# ---------------------------------------------------
# Run
# ---------------------------------------------------
if __name__ == "__main__":
    ensure_database_exists()
    with app.app_context():
        db.create_all()
        print("✅ Database tables created")
    app.run(debug=True, host="0.0.0.0", port=5000)
