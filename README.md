# Learning Management System (LMS)

A full-stack Learning Management System built with Django REST Framework (backend) and React.js (frontend) with Stripe payment integration.

## Features

- **User Roles**:
  - Students: Enroll in courses, track progress
  - Teachers: Create/update/delete courses, modules, and lessons

- **Course Management**:
  - Dynamic module progression
  - Course enrollment via Stripe payment
  - Lesson content management

- **Technology Stack**:
  - Backend: Django REST Framework
  - Frontend: React.js with Vite
  - UI: shadcn + TailwindCSS
  - State Management: Redux Toolkit
  - Payment: Stripe integration

## Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory with the following variables:

```env
PUBLISHABLE_KEY=pk_test_51RbwOQDCq52O5K5oOP8pYDX4KLNbsvlu3kYXlL8O8TiJP18uXBF5mvxP2eJXiSnYvFL5Uc55sJpkq0mgyLmUQPiU00r4hGQmGs
STRIPE_SECRET_KEY=sk_test_51RbwOQDCq52O5K5ofUDnOjx8vC8z0m0Pt56p0su2qU9eXbrQxr3WoF1LeiAY7TuAtyS9Wjfwx73OMYTdZPFks4bj00MHaO2oIs
SECRET_KEY=django-insecure-%8w9=v^+e5y5u$%1s@kcd6y!zf8%@54^_5omevb
DEBUG=False
ALLOWED_HOSTS=lms-projects-backend-icon.onrender.com
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=dextervilgax@gmail.com
EMAIL_HOST_PASSWORD=rsjtilonubmqjkpm
DEFAULT_FROM_EMAIL=dextervilgax@gmail.com
SITE_NAME=The Learning Hall

### Frontend (.env)
Create a `.env` file in the `backend` directory with the following variables:

```env
VITE_NODE_ENV=production
VITE_API_URL=http://127.0.0.1:8000
