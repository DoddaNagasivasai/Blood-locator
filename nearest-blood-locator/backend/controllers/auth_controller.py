# Auth Controller
# Handles authentication-related HTTP requests

from flask import Blueprint, request, jsonify
from models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['full_name', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Create user
        result = User.create(data)
        
        if result is None:
            return jsonify({
                'success': False,
                'message': 'Error creating user'
            }), 500
        
        if isinstance(result, dict) and 'error' in result:
            return jsonify({
                'success': False,
                'message': result['error']
            }), 400
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'data': result
        }), 201
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error registering user',
            'error': str(e)
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'email' not in data or 'password' not in data:
            return jsonify({
                'success': False,
                'message': 'Please provide email and password'
            }), 400
        
        # Authenticate user
        user = User.authenticate(data['email'], data['password'])
        
        if user is None:
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'data': user
            # In production, also return JWT token here
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error logging in',
            'error': str(e)
        }), 500

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get user profile"""
    # NOTE: In production, get user ID from JWT token
    # For now, return first user as example
    try:
        # In production, extract user_id from JWT token
        user_id = 1  # Placeholder
        
        user = User.get_by_id(user_id)
        if user is None:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': user
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error fetching profile',
            'error': str(e)
        }), 500

@auth_bp.route('/profile/<int:user_id>', methods=['PUT'])
def update_profile(user_id):
    """Update user profile"""
    try:
        data = request.get_json()
        
        user = User.update(user_id, data)
        if user is None:
            return jsonify({
                'success': False,
                'message': 'Error updating profile'
            }), 500
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'data': user
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error updating profile',
            'error': str(e)
        }), 500
