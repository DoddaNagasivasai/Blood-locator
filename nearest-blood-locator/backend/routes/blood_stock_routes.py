from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.blood_stock_controller import get_stock, add_stock_entry, update_stock

blood_stock_bp = Blueprint('blood_stock_bp', __name__)

blood_stock_bp.route('/', methods=['GET'])(jwt_required()(get_stock))
blood_stock_bp.route('/', methods=['POST'])(jwt_required()(add_stock_entry))
blood_stock_bp.route('/', methods=['PUT'])(jwt_required()(update_stock))
