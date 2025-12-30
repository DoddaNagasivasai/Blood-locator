# 🩸 Nearest Blood Locator - Python Backend

A full-stack web application to help people find blood donors and blood banks in their vicinity during emergencies. Built with **React (Vite)** for the frontend and **Python Flask + MySQL** for the backend.

## 📋 Project Overview

This is a final-year project that connects blood donors with those in need. The application features:

- **Quick Search**: Find blood donors and blood banks by blood group and location
- **Real-time Availability**: View available donors and blood banks near you
- **User Registration**: Register as a blood donor or recipient
- **MySQL Database**: Persistent data storage with relational database
- **RESTful API**: Clean API architecture with Flask
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **CSS3** for styling (no heavy UI libraries)
- **Fetch API** for backend communication

### Backend
- **Python 3.8+** with Flask framework
- **MySQL Database** for data persistence
- **mysql-connector-python** for database operations
- **Flask-CORS** for cross-origin requests
- **RESTful API** architecture

## 📁 Project Structure

```
nearest-blood-locator/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service
│   │   └── ...
│   └── package.json
│
└── backend/                 # Python Flask backend
    ├── app.py              # Main application entry
    ├── config/
    │   ├── db.py           # Database configuration
    │   └── env.py          # Environment settings
    ├── models/
    │   ├── donor.py        # Donor model
    │   ├── blood_bank.py   # Blood bank model
    │   └── user.py         # User model
    ├── controllers/
    │   ├── donor_controller.py
    │   ├── blood_bank_controller.py
    │   └── auth_controller.py
    ├── routes/
    │   ├── donor_routes.py
    │   ├── blood_bank_routes.py
    │   └── auth_routes.py
    ├── middleware/
    │   └── auth_middleware.py
    ├── utils/
    │   └── location_helper.py
    └── requirements.txt    # Python dependencies
```

## 🚀 Getting Started

### Prerequisites
- **Python 3.8 or higher**
- **Node.js** (v14 or higher)
- **MySQL Server** (v5.7 or higher)
- **pip** (Python package manager)
- **npm** or **yarn**

### Database Setup

1. **Install MySQL** if not already installed

2. **Start MySQL Server**

3. **Update Database Credentials**
   - Open `backend/config/db.py`
   - Update the `DB_CONFIG` dictionary:
     ```python
     DB_CONFIG = {
         'host': 'localhost',
         'user': 'your_mysql_username',     # e.g., 'root'
         'password': 'your_mysql_password', # Your MySQL password
         'database': 'blood_locator_db'
     }
     ```

4. **Database will be created automatically** when you first run the backend server

### Installation

#### 1. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Running the Application

#### 1. Start the Backend Server (Terminal 1)
```bash
cd backend
python app.py
```
The server will run on `http://localhost:5000`

- Database tables will be created automatically
- Sample data will be inserted on first run

#### 2. Start the Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
The app will run on `http://localhost:5173` (Vite default)

#### 3. Open Your Browser
Navigate to `http://localhost:5173`

## 📡 API Endpoints

### Donors
- `GET /api/donors` - Get all donors
- `GET /api/donors/:id` - Get donor by ID
- `GET /api/donors/search?bloodGroup=A+&location=Downtown` - Search donors
- `GET /api/donors/available` - Get available donors
- `POST /api/donors` - Create new donor

### Blood Banks
- `GET /api/blood-banks` - Get all blood banks
- `GET /api/blood-banks/:id` - Get blood bank by ID
- `GET /api/blood-banks/search?bloodGroup=O-&location=Uptown` - Search blood banks
- `GET /api/blood-banks/24x7` - Get 24/7 blood banks
- `GET /api/blood-banks/blood-group/:group` - Get banks by blood group
- `POST /api/blood-banks` - Create new blood bank

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile/:id` - Update user profile

## 🗄️ Database Schema

### Tables Created Automatically:

1. **donors**
   - id, name, blood_group, location, phone, email
   - last_donation, available_for_donation, distance, created_at

2. **blood_banks**
   - id, name, location, phone, email
   - operating_hours, is_24x7, distance, created_at

3. **blood_bank_inventory**
   - id, blood_bank_id, blood_group, units_available

4. **users**
   - id, full_name, email, password, phone
   - blood_group, location, role, created_at

## 🎨 Features

### For Users
- **Search Blood**: Find donors and blood banks by blood type and location
- **Filter Results**: Filter by blood group, location, and availability
- **View Details**: See contact information and availability
- **Registration**: Create account to become a donor
- **Persistent Data**: All data stored in MySQL database

### For Developers
- **Clean Code**: Well-commented, beginner-friendly code
- **MVC Pattern**: Separated concerns (models, controllers, routes)
- **RESTful API**: Standard REST architecture
- **Database**: Real MySQL integration
- **Error Handling**: Proper error responses
- **Scalable**: Easy to extend with new features

## 💡 For Viva/Project Presentation

### Key Points to Explain:

1. **Problem Statement**: 
   - Emergency blood shortage
   - Need for quick donor/bank location
   - Centralized database solution

2. **Technology Choice**:
   - **Python Flask**: Simple, beginner-friendly, powerful
   - **MySQL**: Reliable relational database
   - **React**: Modern, component-based UI

3. **Database Design**:
   - Normalized schema
   - Relational integrity with foreign keys
   - Inventory tracking for blood banks

4. **API Architecture**:
   - RESTful design principles
   - Blueprint pattern for modularity
   - JSON responses

5. **Future Enhancements**:
   - JWT authentication
   - Password hashing (bcrypt)
   - SMS/Email notifications
   - Google Maps integration
   - Admin panel

## 🔧 Development

### Running in Debug Mode
Backend automatically runs in debug mode (set in `app.py`):
```python
app.run(debug=True, port=5000)
```

### Database Reset
To reset the database:
```sql
DROP DATABASE blood_locator_db;
```
Then restart the backend - it will recreate tables and sample data.

### Adding More Data
You can add data via:
1. **API endpoints** (POST requests)
2. **Database directly** (MySQL Workbench, phpMyAdmin)
3. **Update sample data** in `config/db.py`

## 📝 Notes

### Important Security Notes:
- ⚠️ **Passwords**: Currently stored as plain text - Use bcrypt in production!
- ⚠️ **Authentication**: No JWT tokens - Implement for production!
- ⚠️ **SQL Injection**: Using parameterized queries (✅ secure)
- ⚠️ **CORS**: Enabled for development - Restrict in production!

### Production Checklist:
- [ ] Implement password hashing (bcrypt)
- [ ] Add JWT authentication
- [ ] Use environment variables (.env)
- [ ] Add input validation
- [ ] Implement rate limiting
- [ ] Use HTTPS
- [ ] Add logging
- [ ] Database backups
- [ ] Error monitoring

## 👨‍💻 Development Commands

### Backend
```bash
python app.py              # Start server
pip freeze > requirements.txt  # Update dependencies
```

### Frontend
```bash
npm run dev               # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
```

### Database
```bash
mysql -u root -p         # Access MySQL CLI
```

## 🐛 Troubleshooting

### Cannot connect to MySQL
- Check if MySQL server is running
- Verify credentials in `config/db.py`
- Check firewall settings

### Module not found errors
```bash
pip install -r requirements.txt
```

### CORS errors
- Verify frontend URL in `app.py` CORS settings
- Check browser console for exact error

### Database permission errors
- Grant permissions: `GRANT ALL PRIVILEGES ON blood_locator_db.* TO 'username'@'localhost';`

## 📄 License

This project is open-source and available for educational purposes.

## 🤝 Contributing

This is a student project, but suggestions and improvements are welcome!

---

**Made with ❤️ for saving lives**

**Tech Stack**: Python + Flask + MySQL + React + Vite
