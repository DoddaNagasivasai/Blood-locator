from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Donor
import datetime

donor_bp = Blueprint('donor_bp', __name__)

@donor_bp.route('/', methods=['POST'])
@jwt_required()
def create_or_update_donor():
    try:
        user_id = int(get_jwt_identity())
    except (ValueError, TypeError):
        return jsonify({"msg": "Invalid user identity"}), 401
        
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No data provided"}), 400

    # Check if donor profile exists
    donor = Donor.query.filter_by(user_id=user_id).first()
    
    if donor:
        # Update existing
        if 'age' in data:
            donor.age = int(data['age'])
        if 'city' in data:
            donor.city = data['city']
        if 'phone' in data:
            donor.phone = data['phone']
        if 'availabilityStatus' in data:
            donor.availability_status = bool(data['availabilityStatus'])
            
        msg = "Donor profile updated"
    else:
        # Create new
        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "User not found"}), 404
            
        # Required fields for creation - no longer falling back to User model for these
        phone = data.get('phone') or user.phone
        city = data.get('city')
        blood_group = data.get('bloodGroup')
        
        if not phone or not city or not blood_group:
            return jsonify({"msg": "Phone, City and Blood Group are required"}), 400
            
        donor = Donor(
            user_id=user_id,
            name=user.username, # Default to username, or add 'name' to User model if needed (User has username, but maybe we want full name?)
            # Wait, User model doesn't have 'name' field, it has 'username'. 
            # Looking at previous user.py, there was 'full_name' in the raw SQL version but 'username' in SQLAlchemy version.
            # I'll use 'username' as name for now.
            blood_group=blood_group,
            age=int(data.get('age', 0)) if data.get('age') else None,
            phone=phone,
            city=city,
            availability_status=data.get('availabilityStatus', True)
        )
        db.session.add(donor)
        msg = "Donor profile created"

    try:
        db.session.commit()
        return jsonify({"msg": msg, "donor": donor.to_dict()}), 200 # 200 for both update/create for simplicity, or 201 for create
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Operation failed", "error": str(e)}), 500

@donor_bp.route('/', methods=['GET'])
def get_donors():
    blood_group = request.args.get('bloodGroup', '').strip().upper()
    city = request.args.get('location', '').strip().lower()

    query = Donor.query
    if blood_group:
        query = query.filter_by(blood_group=blood_group)
    if city:
        query = query.filter(Donor.city.ilike(f"%{city}%"))
    
    donors = query.all()
    return jsonify([d.to_dict() for d in donors]), 200

@donor_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_donor_profile():
    user_id = int(get_jwt_identity())
    donor = Donor.query.filter_by(user_id=user_id).first()
    
    if not donor:
        return jsonify({"msg": "Donor profile not found", "found": False}), 200 # Return 200 with flag
    
    return jsonify({"donor": donor.to_dict(), "found": True}), 200
