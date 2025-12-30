from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Recipient

recipient_bp = Blueprint('recipient_bp', __name__)

@recipient_bp.route('/', methods=['POST'])
@jwt_required()
def create_or_update_request():
    try:
        user_id = int(get_jwt_identity())
    except (ValueError, TypeError):
        return jsonify({"msg": "Invalid user identity"}), 401
        
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No data provided"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Required fields
    required_blood_group = data.get('requiredBloodGroup')
    city = data.get('city')
    phone = data.get('phone') or user.phone
    
    if not required_blood_group or not city or not phone:
        return jsonify({"msg": "Blood Group, City, and Phone are required"}), 400

    # UPSERT logic: Check if a request already exists for this user
    recipient = Recipient.query.filter_by(user_id=user_id).first()
    
    if recipient:
        # Update existing
        recipient.name = data.get('name') or user.username
        recipient.required_blood_group = required_blood_group
        recipient.phone = phone
        recipient.city = city
        recipient.urgency_level = data.get('urgencyLevel', 'Medium')
        msg = "Blood request updated"
    else:
        # Create new
        recipient = Recipient(
            user_id=user_id,
            name=data.get('name') or user.username,
            required_blood_group=required_blood_group,
            phone=phone,
            city=city,
            urgency_level=data.get('urgencyLevel', 'Medium')
        )
        db.session.add(recipient)
        msg = "Blood request posted successfully"
    
    try:
        db.session.commit()
        return jsonify({"msg": msg, "recipient": recipient.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Operation failed", "error": str(e)}), 500

@recipient_bp.route('/', methods=['GET'])
def get_all_requests():
    # Publicly accessible list of requests for dashboards
    requests = Recipient.query.order_by(Recipient.created_at.desc()).all()
    return jsonify([r.to_dict() for r in requests]), 200

@recipient_bp.route('/', methods=['DELETE'])
@jwt_required()
def cancel_request():
    user_id = int(get_jwt_identity())
    recipient = Recipient.query.filter_by(user_id=user_id).first()
    
    if not recipient:
        return jsonify({"msg": "No active request found to cancel"}), 404
        
    try:
        db.session.delete(recipient)
        db.session.commit()
        return jsonify({"msg": "Blood request cancelled successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Cancellation failed", "error": str(e)}), 500

@recipient_bp.route('/<int:request_id>', methods=['GET'])
def get_request_detail(request_id):
    recipient = Recipient.query.get(request_id)
    if not recipient:
        return jsonify({"msg": "Request not found"}), 404
    return jsonify(recipient.to_dict()), 200

@recipient_bp.route('/my-requests', methods=['GET'])
@jwt_required()
def get_my_requests():
    user_id = int(get_jwt_identity())
    # A user might have multiple requests? 
    # The Recipient model has `user_id` as unique=True in my previous creating.
    # Ah, if unique=True, then one user can only have ONE recipient profile/request at a time?
    # Let's check `models/recipient.py`.
    # Yes: user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    # This design limits one request per user. That's a constraint I added.
    # I should probably respect it for now or change it if "Requests" implies multiple.
    # The prompt said "Recipient Table", usually linked to User.
    # For a final year project, one active request per user is simple and acceptable.
    
    recipient = Recipient.query.filter_by(user_id=user_id).first()
    
    if not recipient:
        return jsonify({"requests": []}), 200
        
    return jsonify({"requests": [recipient.to_dict()]}), 200
