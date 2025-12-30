import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.app import app
from backend.extensions import db
from backend.models import User, Donor, Recipient, BloodBank

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
        # Clean up if exists
        old_user = User.query.filter_by(email=test_email).first()
        if old_user:
            # Delete recipient profile first
            Recipient.query.filter_by(user_id=old_user.id).delete()
            db.session.delete(old_user)
            db.session.commit()

        # Registration data
        reg_data = {
            "username": "test_recipient",
            "email": test_email,
            "phone": "1234567890",
            "city": "TestCity",
            "bloodGroup": "B+",
            "userType": "recipient"
        }

        # Simulate the register logic
        user = User(
            username=reg_data["username"],
            email=reg_data["email"],
            phone=reg_data["phone"],
            role=reg_data["userType"]
        )
        user.set_password("password123")
        db.session.add(user)
        db.session.commit()

        # profile creation
        recipient = Recipient(
            user_id=user.id,
            name=user.username,
            required_blood_group=reg_data["bloodGroup"],
            phone=reg_data["phone"],
            city=reg_data["city"],
            urgency_level='Medium'
        )
        db.session.add(recipient)
        db.session.commit()

        # Verify insertion
        check_user = User.query.get(user.id)
        check_recipient = Recipient.query.filter_by(user_id=user.id).first()

        if check_recipient and check_recipient.required_blood_group == "B+" and check_recipient.city == "TestCity":
            print(f"✅ Success: Recipient data inserted into Recipient table.")
            print(f"Recipient Record: {check_recipient.to_dict()}")
        else:
            print("❌ Error: Recipient data NOT found in Recipient table or incorrect!")

        # 3. Simulate Donor Registration
        print("\nSimulating Donor Registration...")
        test_donor_email = "test_donor@example.com"
        old_donor = User.query.filter_by(email=test_donor_email).first()
        if old_donor:
            Donor.query.filter_by(user_id=old_donor.id).delete()
            db.session.delete(old_donor)
            db.session.commit()

        user_d = User(username="test_donor", email=test_donor_email, phone="0987654321", role="donor")
        user_d.set_password("password123")
        db.session.add(user_d)
        db.session.commit()

        donor = Donor(
            user_id=user_d.id,
            name=user_d.username,
            blood_group="A+",
            phone="0987654321",
            city="DonorCity",
            availability_status=True
        )
        db.session.add(donor)
        db.session.commit()

        check_donor = Donor.query.filter_by(user_id=user_d.id).first()
        if check_donor and check_donor.blood_group == "A+":
            print(f"✅ Success: Donor data inserted into Donor table.")
            print(f"Donor Record: {check_donor.to_dict()}")
        else:
            print("❌ Error: Donor data NOT found in Donor table!")

if __name__ == "__main__":
    verify()
