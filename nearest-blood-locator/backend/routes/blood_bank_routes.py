from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import BloodBank

blood_bank_bp = Blueprint('blood_bank_bp', __name__)

@blood_bank_bp.route('/', methods=["POST"])
@jwt_required()
def create_blood_bank():
    try:
        user_id = int(get_jwt_identity())
    except (ValueError, TypeError):
        return jsonify({"msg": "Invalid user identity"}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No data provided"}), 400

    name = data.get("name") or ""
    city = data.get("city") or ""
    contact_number = data.get("contactNumber") or ""

    if not name or not city or not contact_number:
        return jsonify({"msg": "Name, city, and contact number are required"}), 400

    groups = data.get("availableBloodGroups") or []
    groups_str = ",".join(groups) if isinstance(groups, list) else str(groups)

    # Check if a bank already exists for this user
    existing_bank = BloodBank.query.filter_by(created_by=user_id).first()
    
    if existing_bank:
        # Update existing
        existing_bank.name = name
        existing_bank.city = city
        existing_bank.address = data.get("address")
        existing_bank.contact_number = contact_number
        existing_bank.available_blood_groups = groups_str
        
        try:
            db.session.commit()
            return jsonify({"msg": "Blood Bank profile updated", "bloodBank": existing_bank.to_dict()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"msg": "Update failed", "error": str(e)}), 500
    else:
        # Create new
        new_bank = BloodBank(
            name=name,
            city=city,
            address=data.get("address"),
            contact_number=contact_number,
            available_blood_groups=groups_str,
            created_by=user_id
        )

        try:
            db.session.add(new_bank)
            db.session.commit()
            return jsonify({"msg": "Blood Bank created", "bloodBank": new_bank.to_dict()}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"msg": "Creation failed", "error": str(e)}), 500

@blood_bank_bp.route('/', methods=["GET"])
def get_blood_banks():
    city = (request.args.get("city") or request.args.get("location") or "").strip().lower()
    blood_group = request.args.get("bloodGroup", "").strip().upper()

    query = BloodBank.query

    if city:
        query = query.filter(BloodBank.city.ilike(f"%{city}%"))
    
    if blood_group:
        query = query.filter(BloodBank.available_blood_groups.ilike(f"%{blood_group}%"))

    banks = query.all()
    return jsonify([b.to_dict() for b in banks]), 200

@blood_bank_bp.route('/my', methods=["GET"])
@jwt_required()
def get_my_blood_banks():
    user_id = int(get_jwt_identity())
    banks = BloodBank.query.filter_by(created_by=user_id).all()
    return jsonify([b.to_dict() for b in banks]), 200

@blood_bank_bp.route('/<int:id>', methods=["DELETE"])
@jwt_required()
def delete_blood_bank(id):
    user_id = int(get_jwt_identity())
    bank = BloodBank.query.get(id)

    if not bank:
        return jsonify({"msg": "Blood bank not found"}), 404
    
    if bank.created_by != user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    try:
        db.session.delete(bank)
        db.session.commit()
        return jsonify({"msg": "Blood bank deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Delete failed", "error": str(e)}), 500
