import datetime
from extensions import db

class Donor(db.Model):
    __tablename__ = "donors"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    name = db.Column(db.String(100), nullable=False)
    blood_group = db.Column(db.String(5), nullable=False)
    age = db.Column(db.Integer, nullable=True)
    phone = db.Column(db.String(20), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    availability_status = db.Column(db.Boolean, default=True)
    last_donation_date = db.Column(db.Date, nullable=True)
    
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
            "fullName": self.name, # For ResultsSection compatibility
            "bloodGroup": self.blood_group,
            "age": self.age,
            "phoneNumber": self.phone, # Renamed for ResultsSection
            "location": self.city, # Renamed for ResultsSection
            "availabilityStatus": "Available" if self.availability_status else "Unavailable", # String for ResultsSection check
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<Donor {self.name} ({self.blood_group})>"
