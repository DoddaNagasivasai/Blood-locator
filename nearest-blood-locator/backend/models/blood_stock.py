from extensions import db
import datetime

class BloodStock(db.Model):
    # __bind_key__ = 'blood_bank'
    __tablename__ = 'blood_stock'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    blood_group = db.Column(db.String(5), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=0)
    blood_bank_id = db.Column(db.Integer, nullable=True) # ID from blood_banks table in primary DB
    last_updated = db.Column(
        db.DateTime, 
        default=datetime.datetime.utcnow, 
        onupdate=datetime.datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "bloodBankId": self.blood_bank_id,
            "bloodGroup": self.blood_group,
            "quantity": self.quantity,
            "lastUpdated": self.last_updated.isoformat() if self.last_updated else None
        }
