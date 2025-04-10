# Refferal-system

A backend system for wallet based referrals.

## Features

- Connect wallet to sign up
- Generate referral link linked to wallet
- Track which other wallets sign up using the referral link

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the development server: `npm run dev`

## API Endpoints

### Authentication
- POST `/api/auth/wallet` - Authenticate with wallet address

### Referrals
- GET `/api/users/:walletAddress` - Get user info
- GET `/api/users/:walletAddress/referrals` - Get referral stats
- GET `/api/referral/:code` - Validate a referral code

