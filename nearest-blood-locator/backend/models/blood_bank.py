import datetime
from extensions import db

class BloodBank(db.Model):
    # Removed __bind_key__ to use default database and allow FK to Users table

    # User request was "separate database tables", usually implies same DB but different tables.
    # However, existing app.py has:
    # app.config["SQLALCHEMY_BINDS"] = {'blood_bank': ...}
    # And previously BloodBank model in app.py didn't have __bind_key__ set explicitly in the inline class, 
    # BUT the inline class in app.py (lines 470-482) didn't show __bind_key__.
    # WAIT. Line 465 imports blood_stock_bp.
    # blood_stock.py has __bind_key__ = 'blood_bank'.
    # The inline BloodBank class in app.py (line 470) did NOT have __bind_key__ set. 
    # So it was likely created in the default database `blood_locator`.
    # BUT, `ensure_database_exists` creates both `blood_locator` and `blood_bank` DBs.
    # Let's check the user requirement: "Design and implement three separate database tables... using MySQL with SQLAlchemy".
    # It doesn't explicitly say separate DATABASES.
    # I will stick to the default database for continuity unless there's a strong reason not to.
    # The inline BloodBank in app.py was mapping to 'blood_banks' table.
    
    __tablename__ = 'blood_banks'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=False, index=True)
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

    # Relationship to user is defined in User model as backref 'owner'
    # Relationship to stock?
    # blood_stock.py seems to be independent or linked? 
    # Let's check blood_stock.py again. It has no FK to blood_bank. It just stores blood_group and quantity.
    # That looks like a single global stock or per bank? 
    # It seems the previous implementation of blood_stock was very simple/incomplete.
    # I won't touch blood_stock for now as it's not in the scope of "three separate database tables" request (Donor, Recipient, BloodBank).

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "city": self.city,
            "contactNumber": self.contact_number,
            "availableBloodGroups": self.available_blood_groups.split(",") if self.available_blood_groups else [],
            "stockStatus": self.stock_status,
            "createdBy": self.created_by,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<BloodBank {self.name}>"
