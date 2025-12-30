from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from extensions import db
from models.blood_stock import BloodStock
from models.blood_bank import BloodBank

def get_stock():
    user_id = int(get_jwt_identity())
    bank = BloodBank.query.filter_by(created_by=user_id).first()
    if not bank:
        return jsonify([]), 200 # No bank, empty stock

    stock = BloodStock.query.filter_by(blood_bank_id=bank.id).all()
    return jsonify([item.to_dict() for item in stock]), 200

def add_stock_entry():
    user_id = int(get_jwt_identity())
    bank = BloodBank.query.filter_by(created_by=user_id).first()
    if not bank:
        return jsonify({"msg": "Please register your blood bank profile first"}), 403

    data = request.get_json()
    blood_group = data.get("bloodGroup", "").strip().upper()
    quantity = data.get("quantity", 0)

    if not blood_group:
        return jsonify({"msg": "Blood group is required"}), 400
    
    try:
        quantity = int(quantity)
    except (ValueError, TypeError):
        return jsonify({"msg": "Quantity must be a valid number"}), 400

    # Check if already exists for THIS bank
    existing = BloodStock.query.filter_by(blood_group=blood_group, blood_bank_id=bank.id).first()
    if existing:
        return jsonify({"msg": f"Stock entry for {blood_group} already exists. Please use 'Update Existing Stock' instead."}), 409

    if quantity < 0:
        return jsonify({"msg": "Quantity cannot be negative"}), 400

    new_entry = BloodStock(blood_group=blood_group, quantity=quantity, blood_bank_id=bank.id)
    
    try:
        db.session.add(new_entry)
        db.session.commit()
        return jsonify({"msg": f"Added new blood group entry: {blood_group}", "entry": new_entry.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to add entry", "error": str(e)}), 500

def update_stock():
    user_id = int(get_jwt_identity())
    bank = BloodBank.query.filter_by(created_by=user_id).first()
    if not bank:
        return jsonify({"msg": "Blood bank not found"}), 403

    data = request.get_json()
    blood_group = data.get("bloodGroup", "").strip().upper()
    quantity = data.get("quantity")
    
    if quantity is None:
        return jsonify({"msg": "Quantity is required"}), 400
    
    try:
        quantity = int(quantity)
    except (ValueError, TypeError):
        return jsonify({"msg": "Quantity must be a valid number"}), 400

    if quantity < 0:
        return jsonify({"msg": "Quantity cannot be negative"}), 400

    item = BloodStock.query.filter_by(blood_group=blood_group, blood_bank_id=bank.id).first()
    
    if not item:
        return jsonify({"msg": "Blood group not found in stock. Use Add Entry first."}), 404

    item.quantity = quantity

    try:
        db.session.commit()
        return jsonify({"msg": "Stock updated", "entry": item.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Update failed", "error": str(e)}), 500
