# Authentication Middleware
# Protects routes that require user authentication

from functools import wraps
from flask import request, jsonify

def auth_required(f):
    """
    Decorator to protect routes that require authentication
    
    In production, this would:
    1. Extract JWT token from Authorization header
    2. Verify the token
    3. Attach user info to request
    4. Call the wrapped function if valid
    
    For this beginner project, it's a placeholder
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # In production, implement JWT verification here
        # For now, just pass through
        
        # Example production code:
        # token = request.headers.get('Authorization', '').replace('Bearer ', '')
        # if not token:
        #     return jsonify({'success': False, 'message': 'No token provided'}), 401
        # 
        # try:
        #     # Verify JWT token
        #     payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        #     request.user_id = payload['user_id']
        # except jwt.ExpiredSignatureError:
        #     return jsonify({'success': False, 'message': 'Token expired'}), 401
        # except jwt.InvalidTokenError:
        #     return jsonify({'success': False, 'message': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """
    Decorator to protect routes that require admin role
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # In production, check if user has admin role
        # For now, just pass through
        return f(*args, **kwargs)
    return decorated_function
