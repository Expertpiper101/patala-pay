# Patala Pay

This is the React/Vite purchasing site for Patala Pay POS licenses, subscriptions, and hardware.

## Open locally

Install and run the Vite app:

```powershell
cd "C:\Users\Mr C\Desktop\Projects\simple-python-pos\license-website"
npm install
npm run dev
```

Then visit the local Vite URL shown in the terminal, usually `http://127.0.0.1:8085`.

## Build

```powershell
npm run build
```

Vercel should use:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

## Demo sign-in

The current static site uses browser session authentication for demos and local testing.
Visitors can browse the license and hardware pages without signing in. Login is required when creating a purchase/order, and the admin dashboard requires an admin account.
Visitors can create a user account without email verification at this stage.

- Admin: `admin@simplepos.local` / `admin123`
- User: `sales@simplepos.local` / `sales123`

Admin users can open the admin dashboard. Sales users can create storefront orders.
Replace this demo authentication with a backend login service before taking real payments.

## PayFast setup

PayFast form-post integration is wired into the React checkout through `payfast-config.js` and `payfast.js`.

For testing, `payfast-config.js` defaults to PayFast sandbox credentials:

- `merchantId`: `10000100`
- `merchantKey`: `46f0cd694581a`
- `sandbox`: `true`
- `useSignature`: `false`

Before real payment testing, update `siteBaseUrl` in `payfast-config.js` to the public hosted website URL. PayFast return, cancel, and notify URLs must be reachable on the internet; `localhost` and local files are not suitable for full payment confirmation.

Before live payments, set your real PayFast merchant ID, merchant key, passphrase if configured, set `useSignature` to `true` when using a passphrase, and change `sandbox` to `false`.

License keys remain hidden until payment is confirmed. In this static demo, admin can manually mark an order as paid from the admin page. In production, release keys only after validating the PayFast ITN/notify callback on a backend server.

## Desktop POS referral

When the desktop POS trial expires, it opens the license purchase URL from `SIMPLE_POS_LICENSE_URL`.
If that environment variable is not set, source runs use this local `license-website/index.html` file when available.
Before shipping to clients, set `SIMPLE_POS_LICENSE_URL` to the public website URL where this license checkout is hosted.

## Current scope

- Plan selection for Starter, Growth, and Multi-Store subscriptions
- Monthly and annual pricing
- POS machine quantity handling
- VAT estimate
- Customer details capture
- Purchase order summary
- Draft recent-orders table in browser memory
- Separate hardware store page for receipt printers, touchscreens, cash drawers, desktop PCs, and POS bundles
- Admin dashboard page for viewing license orders, hardware orders, and sales totals
- Demo authentication with separate sales-user and admin roles

## Next integration points

- Payment checkout: PayFast, Stripe, PayPal, or manual EFT invoice flow
- Backend storage: customers, orders, payments, licenses, renewals
- License activation API for the desktop POS
- Hardware inventory, delivery fees, installation quotes, and supplier cost tracking
- Admin dashboard for renewals, cancellations, and support
