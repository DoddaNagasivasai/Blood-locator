import datetime
from extensions import db, bcrypt

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(20), nullable=True)
    role = db.Column(db.String(20), default="donor")  # donor, bank, recipient
    password_hash = db.Column(db.String(255), nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, 
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
    )

    # Relationships
    donor_profile = db.relationship('Donor', backref='user', uselist=False, lazy=True)
    recipient_profile = db.relationship('Recipient', backref='user', uselist=False, lazy=True)
    blood_banks = db.relationship('BloodBank', backref='owner', lazy=True)

    def set_password(self, password):
        """Hash and set the password"""
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        """Verify the password"""
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "isAvailable": self.is_available,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<User {self.username}>"
