# QR Code-Based Automatic Fare Collection System 
Sri Lanka's bus transportation system primarily relies on cash payments and paper tickets issued manually by conductors. This traditional fare collection approach leads to multiple operational, financial, and user-experience challenges including revenue leakage, tax evasion, fare evasion, cash handling risks, manual ticketing errors, and paper ticket production.

## Demo
### Commuter Portal
![Commuter Flow](docs/demo/commuter-portal.gif)

### Bus Operator Portal
![Bus Operator Flow](docs/demo/bus-operator-portal.gif)

### Transport Authority Portal
![Transport Authority Flow](docs/demo/transport-authority-portal.gif)

## Installation
### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v14 or higher)
- Stripe Account (for payment integration)
- Stripe CLI (for webhook testing)

### Setup Instructions
1. Clone the repository
```bash
git clone https://github.com/VithurshanV2/qr-afc-bus-system.git
cd qr-afc-bus-system
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables

Server environment (.env in server/ folder)

Create a .env file in the server folder with the following variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/smartfare"

# JWT Secret
JWT_SECRET="your_jwt_secret_here"

# Environment
NODE_ENV="development"

# SMTP Configuration (Gmail example)
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SENDER_EMAIL="your_email@gmail.com"

# Email Logo
EMAIL_LOGO_URL="https://your-logo-url.com/logo.svg"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# URLs
BASE_URL="http://localhost:4000"
CLIENT_URL="http://localhost:5173"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Ticket Security
TICKET_SECRET="your_ticket_secret_key"
```

Client environment (.env in client/ folder)

Create a .env file in the client folder:
```env
VITE_BACKEND_URL="http://localhost:4000"
```

4. Database setup
```bash
cd server
npx prisma migrate dev
npx prisma generate
cd ..
```

## Usage
### Running the application

Terminal 1 - Application:
```bash
npm run dev
```

Terminal 2 - Stripe webhook forwarding:
```bash
stripe listen --forward-to localhost:4000/webhook
```

Note: Copy the webhook signing secret from Terminal 2 and update STRIPE_WEBHOOK_SECRET in server/.env

### Accessing the system
- Commuter Portal: http://localhost:5173
- Bus Operator Portal: http://localhost:5173/operator
- Admin Portal: http://localhost:5173/admin
- API Server: http://localhost:4000

### Testing payment features
1. Ensure Stripe webhook forwarding is running
2. Use Stripe test card: 4242 4242 4242 4242
3. Any future expiry date and any 3-digit CVC
