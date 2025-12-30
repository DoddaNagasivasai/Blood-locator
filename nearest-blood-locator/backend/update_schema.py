from app import app, db
from models.blood_bank import BloodBank # Import to register with SQLAlchemy
from sqlalchemy import text

with app.app_context():
    print("Attempting to update database schema...")
    try:
        db.create_all() # This creates missing tables like 'blood_banks'
        print("✅ Database tables updated (created missing ones).")
        with db.engine.connect() as conn:
            # Check if column exists first to avoid error? 
            # Or just try to add it.
            conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'donor'"))
            conn.commit()
        print("✅ Successfully added 'role' column to users table.")
    except Exception as e:
        print(f"❌ Error (column might already exist): {e}")
