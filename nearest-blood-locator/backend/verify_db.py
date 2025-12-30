from app import app, db
from sqlalchemy import inspect

def verify_tables():
    with app.app_context():
        print("Creating tables...")
        db.create_all()
        
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        
        print("\nTables in database:")
        for table in tables:
            print(f"- {table}")
            columns = [col['name'] for col in inspector.get_columns(table)]
            print(f"  Columns: {columns}")
            
        required_tables = {'users', 'donors', 'recipients', 'blood_banks'}
        if required_tables.issubset(set(tables)):
            print("\n✅ All required tables found!")
        else:
            print(f"\n❌ Missing tables: {required_tables - set(tables)}")

if __name__ == "__main__":
    verify_tables()
