# Tife Eat and more

A restaurant ordering app with a chatbot-style order flow, a menu experience, and local cash-based checkout.

## Features
- Chatbot order experience with numbered commands
- Menu browsing and order placement
- Current order and order history views
- Cash order confirmation without third-party payment integration
- OTP fallback for local development when email credentials are not configured

## Run locally

### 1) Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3) Environment variables
Create a backend `.env` file with:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
CLIENT_URL=http://localhost:5174
NODE_ENV=development
RETURN_OTP_FOR_TESTING=true

# Optional email delivery
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

```

## Deployment
The project is prepared for Render with the included [render.yaml](render.yaml) configuration.

## Notes
- The chatbot stores its session in memory using a device identifier from local storage.
- If email delivery is not configured, the backend returns the OTP in the API response during local development.
