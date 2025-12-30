# Blood Bank Controller
# Handles blood bank-related HTTP requests

from flask import Blueprint, request, jsonify
from models.blood_bank import BloodBank

blood_bank_bp = Blueprint('blood_banks', __name__)

@blood_bank_bp.route('/', methods=['GET'])
def get_all_blood_banks():
    """Get all blood banks"""
    try:
        blood_banks = BloodBank.get_all()
        if blood_banks is None:
            return jsonify({
                'success': False,
                'message': 'Error fetching blood banks'
            }), 500
        
        return jsonify({
            'success': True,
            'count': len(blood_banks),
            'data': blood_banks
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error fetching blood banks',
            'error': str(e)
        }), 500

@blood_bank_bp.route('/<int:bank_id>', methods=['GET'])
def get_blood_bank_by_id(bank_id):
    """Get blood bank by ID"""
    try:
        blood_bank = BloodBank.get_by_id(bank_id)
        if blood_bank is None:
            return jsonify({
                'success': False,
                'message': 'Blood bank not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': blood_bank
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error fetching blood bank',
            'error': str(e)
        }), 500

@blood_bank_bp.route('/search', methods=['GET'])
def search_blood_banks():
    """Search blood banks by blood group and location"""
    try:
        blood_group = request.args.get('bloodGroup')
        location = request.args.get('location')
        
        blood_banks = BloodBank.search(blood_group=blood_group, location=location)
        if blood_banks is None:
            return jsonify({
                'success': False,
                'message': 'Error searching blood banks'
            }), 500
        
        return jsonify({
            'success': True,
            'count': len(blood_banks),
            'data': blood_banks
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error searching blood banks',
            'error': str(e)
        }), 500

@blood_bank_bp.route('/24x7', methods=['GET'])
def get_24x7_blood_banks():
    """Get 24x7 emergency blood banks"""
    try:
        blood_banks = BloodBank.get_24x7()
        if blood_banks is None:
            return jsonify({
                'success': False,
                'message': 'Error fetching 24x7 blood banks'
            }), 500
        
        return jsonify({
            'success': True,
            'count': len(blood_banks),
            'data': blood_banks
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error fetching 24x7 blood banks',
            'error': str(e)
        }), 500

@blood_bank_bp.route('/blood-group/<blood_group>', methods=['GET'])
def get_blood_banks_by_group(blood_group):
    """Get blood banks by specific blood group"""
    try:
        blood_banks = BloodBank.search(blood_group=blood_group)
        if blood_banks is None:
            return jsonify({
                'success': False,
                'message': 'Error fetching blood banks'
            }), 500
        
        return jsonify({
            'success': True,
            'count': len(blood_banks),
            'data': blood_banks
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error fetching blood banks',
            'error': str(e)
        }), 500

@blood_bank_bp.route('/', methods=['POST'])
def create_blood_bank():
    """Create a new blood bank"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'location', 'phone', 'email']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Extract inventory data if provided
        inventory_data = data.pop('inventory', None)
        
        bank_id = BloodBank.create(data, inventory_data)
        if bank_id:
            blood_bank = BloodBank.get_by_id(bank_id)
            return jsonify({
                'success': True,
                'message': 'Blood bank created successfully',
                'data': blood_bank
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': 'Error creating blood bank'
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error creating blood bank',
            'error': str(e)
        }), 500
