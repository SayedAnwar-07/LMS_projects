# The Medhakosh - Online Learning Platform

## 🌐 Live Demonstration

🔗 **Live Application URL:** [https://the-medhakosh.netlify.app/](https://the-medhakosh.netlify.app/)

The Medhakosh is a comprehensive online learning platform where students can enroll in courses and track their progress, while teachers can create and manage educational content.

## Features

### Student Features

- User account creation and authentication
- Course enrollment system
- Progress tracking for enrolled courses
- Secure payment processing via Stripe

### Teacher Features

- Create, update, and delete courses
- Manage course modules and lessons
- Comprehensive content management system

## Technologies Used

### Frontend

- React.js with Vite
- shadcn UI components
- TailwindCSS for styling
- Redux with @redux/toolkit for state management
- Zod for schema validation
- Stripe for payment processing

### Backend

- Django with Django REST Framework
- SQLite database (can be configured for other databases)
- Stripe integration for payments
- JWT authentication

## Environment Variables

### Backend (`.env` in backend directory)

```env
PUBLISHABLE_KEY=pk_test_51RbwOQDCq52O5K5oOP8pYDX4KLNbsvlu3kYXlL8O8TiJP18uXBF5mvxP2eJXiSnYvFL5Uc55sJpkq0mgyLmUQPiU00r4hGQmGs
STRIPE_SECRET_KEY=sk_test_51RbwOQDCq52O5K5ofUDnOjx8vC8z0m0Pt56p0su2qU9eXbrQxr3WoF1LeiAY7TuAtyS9Wjfwx73OMYTdZPFks4bj00MHaO2oIs
SECRET_KEY=django-insecure-%8w9=v^+e5y5u$%1s@kcd6y!zf8%@54^_5omevb
DEBUG=False
ALLOWED_HOSTS=lms-backend-hl9p.onrender.com
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=dextervilgax@gmail.com
EMAIL_HOST_PASSWORD=rsjtilonubmqjkpm
DEFAULT_FROM_EMAIL=dextervilgax@gmail.com
SITE_NAME=The Medhakosh

### Frontend (`.env` in frontend directory)
VITE_NODE_ENV=production
VITE_API_URL=https://lms-backend-hl9p.onrender.com
VITE_OTP_EXPIRY_MINUTES=5
```
