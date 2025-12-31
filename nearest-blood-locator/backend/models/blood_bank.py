import datetime
from extensions import db

class BloodBank(db.Model):
    __tablename__ = 'blood_banks'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=False, index=True)
    
    # ✅ Added location fields
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    
    contact_number = db.Column(db.String(20), nullable=False)
    available_blood_groups = db.Column(db.String(255), default="")
    stock_status = db.Column(db.String(50), default="Available")
    
    # Foreign Key to User
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, 
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "city": self.city,
            "latitude": self.latitude,  # ✅ Added
            "longitude": self.longitude,  # ✅ Added
            "contactNumber": self.contact_number,
            "availableBloodGroups": self.available_blood_groups.split(",") if self.available_blood_groups else [],
            "stockStatus": self.stock_status,
            "createdBy": self.created_by,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<BloodBank {self.name}>"