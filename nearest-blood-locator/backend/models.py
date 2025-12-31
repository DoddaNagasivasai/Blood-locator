# models.py
from extensions import db, bcrypt
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(15), nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='donor')  # donor, recipient, bank
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    donor = db.relationship('Donor', backref='user', uselist=False, cascade='all, delete-orphan')
    recipient = db.relationship('Recipient', backref='user', uselist=False, cascade='all, delete-orphan')
    blood_bank = db.relationship('BloodBank', backref='creator', foreign_keys='BloodBank.created_by')
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Donor(db.Model):
    __tablename__ = 'donors'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    blood_group = db.Column(db.String(5), nullable=False, index=True)
    phone = db.Column(db.String(15), nullable=True)
    city = db.Column(db.String(100), nullable=True, index=True)
    latitude = db.Column(db.Float, nullable=True)  # ✅ Added
    longitude = db.Column(db.Float, nullable=True)  # ✅ Added
    availability_status = db.Column(db.Boolean, default=True)
    last_donation_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'blood_group': self.blood_group,
            'phone': self.phone,
            'city': self.city,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'availability_status': self.availability_status,
            'last_donation_date': self.last_donation_date.isoformat() if self.last_donation_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Recipient(db.Model):
    __tablename__ = 'recipients'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    required_blood_group = db.Column(db.String(5), nullable=False, index=True)
    phone = db.Column(db.String(15), nullable=True)
    city = db.Column(db.String(100), nullable=True, index=True)
    latitude = db.Column(db.Float, nullable=True)  # ✅ Added
    longitude = db.Column(db.Float, nullable=True)  # ✅ Added
    urgency_level = db.Column(db.String(20), default='Medium')  # Low, Medium, High, Critical
    required_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(20), default='Active')  # Active, Fulfilled, Cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'required_blood_group': self.required_blood_group,
            'phone': self.phone,
            'city': self.city,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'urgency_level': self.urgency_level,
            'required_date': self.required_date.isoformat() if self.required_date else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class BloodBank(db.Model):
    __tablename__ = 'blood_banks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(100), nullable=True, index=True)
    address = db.Column(db.Text, nullable=True)
    latitude = db.Column(db.Float, nullable=True)  # ✅ Added
    longitude = db.Column(db.Float, nullable=True)  # ✅ Added
    contact_number = db.Column(db.String(15), nullable=True)
    email = db.Column(db.String(120), nullable=True)
    operating_hours = db.Column(db.String(100), nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    blood_stock = db.relationship('BloodStock', backref='blood_bank', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'city': self.city,
            'address': self.address,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'contact_number': self.contact_number,
            'email': self.email,
            'operating_hours': self.operating_hours,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class BloodStock(db.Model):
    __tablename__ = 'blood_stock'
    
    id = db.Column(db.Integer, primary_key=True)
    blood_bank_id = db.Column(db.Integer, db.ForeignKey('blood_banks.id'), nullable=False)
    blood_group = db.Column(db.String(5), nullable=False, index=True)
    quantity = db.Column(db.Integer, default=0)
    unit = db.Column(db.String(10), default='units')  # units, ml, liters
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Composite unique constraint
    __table_args__ = (
        db.UniqueConstraint('blood_bank_id', 'blood_group', name='unique_bank_blood_group'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'blood_bank_id': self.blood_bank_id,
            'blood_group': self.blood_group,
            'quantity': self.quantity,
            'unit': self.unit,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }