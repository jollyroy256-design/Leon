# LEON Travels and Recruitment Consultancy

A responsive website for LEON's overseas manpower recruitment, candidate support, documentation, and travel services in India.

## Services covered

- Overseas manpower sourcing and Israel recruitment enquiries
- Caregiver, supermarket, general worker, CNC operator, plumber, welder, and packing roles
- Passport services and appointment assistance
- PCC, background verification, document upload, and visa documentation support
- Ticket booking and itinerary coordination

## Run locally

Node.js is required. Run `npm install` first. The account integration uses the official Supabase client, bundled locally with esbuild.

```powershell
npm start
```

Open <http://localhost:4173>.

## Enquiry form

The preview validates enquiries and saves them locally in `data/enquiries.jsonl`. That directory is excluded from Git and is never publicly served. Email and WhatsApp delivery are not connected yet.

Before a production launch, add confirmed company contact details, approved service terms, privacy and retention information, and a production enquiry delivery system.

## Brand and imagery

The LEON logo is based on the supplied brand artwork. Workforce imagery was created with OpenAI's image generation tool for this website.

## Consultation calendar

The “Book an expert” buttons in the hero and mobile quick actions open a modal calendar. It collects a preferred date (tomorrow through the next 90 days) and time in Asia/Kolkata (IST). Continuing attaches the request to the enquiry form, where it can be reviewed, changed or removed. On submission, the preference is saved with the existing enquiry message; it does not reserve a slot or send a calendar invitation. No live availability or scheduling provider is connected.

## Vercel deployment

`vercel.json` explicitly selects a static deployment with `npm run build` and output directory `dist`. The build copies only public HTML, CSS, JavaScript and assets; it never publishes local enquiry data or the development server. The `/api/enquiries` function returns a clear 503 JSON response until a persistent production delivery service is configured. Local `npm start` retains local enquiry storage. The published page accurately explains that online enquiries and bookings are not connected.

## Account access (Supabase)

Sign-in, sign-up, account and password-reset pages are at `/sign-in.html`, `/sign-up.html`, `/account.html` and `/reset-password.html`. The pages are published with account submission disabled until Supabase is configured. No fake accounts are stored locally.

To activate:
1. Create a Supabase project and enable the Email authentication provider. Keep email confirmation enabled and configure password policy (the UI requires at least 12 characters for new passwords).
2. Set the Supabase Site URL to `https://leon-pied-one.vercel.app`.
3. Add exact redirect URLs `https://leon-pied-one.vercel.app/account.html` and `https://leon-pied-one.vercel.app/reset-password.html`. For local testing, add the same paths at `http://localhost:4173` (or `http://127.0.0.1:4173` if used).
4. In Vercel project environment variables, set `SUPABASE_URL` to the project URL and `SUPABASE_PUBLISHABLE_KEY` to the public publishable key (a legacy anon key is also accepted). Never use a secret or service-role key; the build rejects them.
5. Redeploy. The build embeds only public browser configuration. Configure Supabase email delivery for production, then test confirmation and password-reset emails with a real test account.

For local development, set the same environment variables in the terminal before `npm start`; `.env.example` lists the names. The server does not automatically load `.env` files. `npm start` and `npm run dev` build the browser client before starting. Email links use PKCE and should be opened in the browser where the request began.

The official SDK manages sessions and refresh tokens. Passwords are sent directly to Supabase and are never stored by this site. The account page verifies the user with Supabase; the current public pages do not contain protected account records. Connecting authentication does not connect the separate enquiry/calendar delivery workflow.

`node check-auth.cjs` tests disabled configuration, key validation, responsive layout, signup, invalid/valid sign-in, session restoration, sign-out, password-reset requests and PKCE recovery with mocked Supabase responses. Real provider delivery must be verified after configuration.
