# QR Code-Based Automatic Fare Collection System 
Sri Lanka's bus transportation system primarily relies on cash payments and paper tickets issued manually by conductors. This traditional fare collection approach leads to multiple operational, financial, and user-experience challenges including revenue leakage, tax evasion, fare evasion, cash handling risks, manual ticketing errors, and paper ticket production.

## Features
### For Commuters
- **Digital Wallet** - Top-up via Stripe payment gateway and pay fares digitally
- **QR Boarding** - Scan QR code inside the bus to initiate fare collection process
- **Digital Tickets** - Secure tickets with HMAC-SHA256 cryptographic verification
- **Trip History** - View all past tickets and transactions
- **GPS-Based Boarding** - Automatic boarding halt detection

### For Bus Operators
- **Request Account** - Request operator account to be verified by admins
- **Trip Management** - Activate trips and set directions
- **QR Code Generation** - Unique QR codes for each bus
- **Revenue Dashboard** - Revenue tracking for each bus
- **Ticket Verification** - Scan and validate commuter tickets

### For Transport Authority (Admins)
- **Operator Management** - Review and approve bus operator account requests
- **Route Management** - Create and update route tables
- **Fare Control** - System-wide fare rate adjustments
- **Revenue Dashboard** - Revenue tracking for each bus operator
- **Trip Logs** - Access to all tickets in the system
- **Ticket Verification** - Scan and validate commuter tickets

## Installation
