import os
import sys

# Add the current directory to path
sys.path.append(os.getcwd())

from app import app
from extensions import db
from models import User, Donor, Recipient, BloodBank

def verify():
    with app.app_context():
        # 1. Check User model fields
        print("Checking User table columns...")
        user_columns = [c.name for c in User.__table__.columns]
        print(f"User columns: {user_columns}")
        
        if 'blood_group' in user_columns or 'city' in user_columns:
            print("❌ Error: blood_group or city still in User table!")
        else:
            print("✅ Success: blood_group and city removed from User table.")

        # 2. Simulate Registration
        print("\nSimulating Recipient Registration...")
        test_email = "test_recipient@example.com"
        old_user = User.query.filter_by(email=test_email).first()
        if old_user:
            Recipient.query.filter_by(user_id=old_user.id).delete()
            db.session.delete(old_user)
            db.session.commit()

        user = User(username="test_recipient", email=test_email, phone="1234567890", role="recipient")
        user.set_password("password123")
        db.session.add(user)
        db.session.commit()

        recipient = Recipient(
            user_id=user.id,
            name=user.username,
            required_blood_group="B+",
            phone="1234567890",
            city="TestCity",
            urgency_level='Medium'
        )
        db.session.add(recipient)
        db.session.commit()

        check_recipient = Recipient.query.filter_by(user_id=user.id).first()
        if check_recipient and check_recipient.required_blood_group == "B+":
            print(f"✅ Success: Recipient data inserted into Recipient table.")
        else:
            print("❌ Error: Recipient data registration failed!")

        # 4. Simulate Blood Bank Registration
        print("\nSimulating Blood Bank Registration...")
        test_bank_email = "test_bank@example.com"
        old_bank_user = User.query.filter_by(email=test_bank_email).first()
        if old_bank_user:
            BloodBank.query.filter_by(created_by=old_bank_user.id).delete()
            db.session.delete(old_bank_user)
            db.session.commit()

        user_b = User(username="test_bank", email=test_bank_email, phone="5556667777", role="bank")
        user_b.set_password("password123")
        db.session.add(user_b)
        db.session.commit()

        bank = BloodBank(
            name="test_bank",
            city="BankCity",
            contact_number="5556667777",
            created_by=user_b.id
        )
        db.session.add(bank)
        db.session.commit()

        check_bank = BloodBank.query.filter_by(created_by=user_b.id).first()
        if check_bank and check_bank.city == "BankCity":
            print(f"✅ Success: Blood Bank data inserted into BloodBank table.")
        else:
            print("❌ Error: Blood Bank data registration failed!")

if __name__ == "__main__":
    verify()
