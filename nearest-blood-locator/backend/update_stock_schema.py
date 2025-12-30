from app import app, db
from sqlalchemy import text

with app.app_context():
    print("Attempting to add 'blood_bank_id' column to 'blood_stock' table...")
    try:
        # Note: BloodStock uses the 'blood_bank' bind
        engine = db.get_engine(app, bind='blood_bank')
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE blood_stock ADD COLUMN blood_bank_id INT NULL"))
            conn.commit()
        print("✅ Successfully added 'blood_bank_id' column.")
    except Exception as e:
        print(f"❌ Error (column might already exist): {e}")
