import datetime
from extensions import db

class Recipient(db.Model):
    __tablename__ = "recipients"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    name = db.Column(db.String(100), nullable=False)
    required_blood_group = db.Column(db.String(5), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    
    # ✅ Location fields
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    
    urgency_level = db.Column(db.String(20), default="Medium")  # High, Medium, Low
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, 
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "name": self.name,
            "requiredBloodGroup": self.required_blood_group,
            "phone": self.phone,
            "city": self.city,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "urgencyLevel": self.urgency_level,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<Recipient {self.name} ({self.required_blood_group})>"