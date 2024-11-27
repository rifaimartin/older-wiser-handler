# OLDERWISER Backend Service

Backend service for OLDERWISER platform, built with Express.js and MongoDB.

## Features

- Authentication & Authorization
- User Management 
- Activity Management
- File Upload
- reCAPTCHA Integration

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for File Upload
- Winston for Logging

## Project Structure
older-wiser-handler/
├── src/
│   ├── config/
│   │   ├── config.js          # Configuration settings
│   │   ├── database.js        # Database connection
│   │   └── multerConfig.js    # File upload config
│   │
│   ├── controllers/
│   │   ├── ActivityController.js
│   │   ├── AuthController.js
│   │   └── CaptchaController.js
│   │
│   ├── middlewares/
│   │   ├── auth.js           # JWT authentication
│   │   └── errorHandler.js    # Global error handler
│   │
│   ├── models/
│   │   ├── Activity.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── activity.routes.js
│   │   ├── auth.routes.js
│   │   └── index.js
│   │
│   └── utils/
│       └── logger.js         # Winston logger setup
│
├── uploads/                  # Upload directory
│   ├── activities/          # Activity images
│   └── avatars/            # User avatars
│
├── .env                     # Environment variables
├── .env.example            # Environment template
├── .gitignore
├── package.json
└── server.js               # Entry point
Copy
## API Endpoints

### Authentication
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login user
POST /api/auth/verify-email # Verify email address
Copy
### Activities
GET    /api/activities           # Get all activities
POST   /api/activities/create    # Create new activity
GET    /api/activities/:id       # Get activity by ID
PUT    /api/activities/:id       # Update activity
DELETE /api/activities/:id       # Delete activity
Copy
### Users
GET    /api/users/me        # Get current user
PUT    /api/users/profile   # Update user profile
Copy
### Files
POST   /api/activities/upload    # Upload activity image
POST   /api/users/avatar        # Upload user avatar
Copy
## Environment Variables

Create `.env` file in root directory:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/older_wiser

# JWT
JWT_SECRET=your_jwt_secret_key

# reCAPTCHA
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
Installation & Setup

Install dependencies

bashCopynpm install

Create .env file

bashCopycp .env.example .env

Create upload directories

bashCopymkdir -p uploads/activities uploads/avatars

Run development server

bashCopynpm run dev
Contributing

Fork the repository
Create feature branch (git checkout -b feature/AmazingFeature)
Commit changes (git commit -m 'Add some AmazingFeature')
Push to branch (git push origin feature/AmazingFeature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE.md file for details.

Separation of concerns
Single responsibility principle
DRY (Don't Repeat Yourself)
Error handling terpusat
Configuration management
Security best practices
Consistent response format