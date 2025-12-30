# Donor Controller
# Handles donor-related HTTP requests

from flask import Blueprint, request, jsonify
from models.donor import Donor

donor_bp = Blueprint('donors', __name__)

@donor_bp.route('/', methods=['GET'])
def get_all_donors():
    """Get all donors"""
    try:
        donors = Donor.get_all()
        if donors is None:
            return jsonify({
                'success': False,
                'message': 'Error fetching donors'
            }), 500
        
        return jsonify({
            'success': True,
            'count': len(donors),
            'data': donors
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error fetching donors',
            'error': str(e)
        }), 500

@donor_bp.route('/<int:donor_id>', methods=['GET'])
def get_donor_by_id(donor_id):
    """Get donor by ID"""
    try:
        donor = Donor.get_by_id(donor_id)
        if donor is None:
            return jsonify({
                'success': False,
                'message': 'Donor not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': donor
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error fetching donor',
            'error': str(e)
        }), 500

@donor_bp.route('/search', methods=['GET'])
def search_donors():
    """Search donors by blood group and location"""
    try:
        blood_group = request.args.get('bloodGroup')
        location = request.args.get('location')
        
        donors = Donor.search(blood_group=blood_group, location=location)
        if donors is None:
            return jsonify({
                'success': False,
                'message': 'Error searching donors'
            }), 500
        
        return jsonify({
            'success': True,
            'count': len(donors),
            'data': donors
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error searching donors',
            'error': str(e)
        }), 500

@donor_bp.route('/available', methods=['GET'])
def get_available_donors():
    """Get only available donors"""
    try:
        donors = Donor.get_available()
        if donors is None:
            return jsonify({
                'success': False,
                'message': 'Error fetching available donors'
            }), 500
        
        return jsonify({
            'success': True,
            'count': len(donors),
            'data': donors
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error fetching available donors',
            'error': str(e)
        }), 500

@donor_bp.route('/', methods=['POST'])
def create_donor():
    """Create a new donor"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'blood_group', 'location', 'phone', 'email']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400
        
        donor_id = Donor.create(data)
        if donor_id:
            donor = Donor.get_by_id(donor_id)
            return jsonify({
                'success': True,
                'message': 'Donor created successfully',
                'data': donor
            }), 201
        else:
            return jsonify({
                'success': False,
                'message': 'Error creating donor'
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error creating donor',
            'error': str(e)
        }), 500
