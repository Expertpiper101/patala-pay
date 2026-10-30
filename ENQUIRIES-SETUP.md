# Enquiry email setup

The enquiry form sends through the Vercel function `/api/enquiry` using Resend.
The Primon `/patala-pay` proxy forwards this automatically. Enquiries always go
to `info@primon.co.za`, with the visitor's email as Reply-To.

To enable delivery later:

1. Verify `primon.co.za` as a sending domain in Resend using its required DNS records.
2. Open the **patala-pay** project in Vercel, then **Settings → Environment Variables**.
3. Add `RESEND_API_KEY` for Production (and Preview if testing preview deployments).
4. Optionally set `ENQUIRY_FROM_EMAIL` to a verified sender. Default: `Patala Pay <info@primon.co.za>`.
5. Redeploy the Patala Pay production deployment so it receives the new variables.
6. Send a test enquiry and check the Resend delivery log and destination inbox.

Until the key is configured, submissions return an unavailable message with the
direct email and phone contact options. Messages are not stored or queued.
Provider failures never display a success message.

Run backend checks with `node --test tests/enquiry.test.mjs`.
