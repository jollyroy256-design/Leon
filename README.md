# LEON Travels and Recruitment Consultancy

A responsive website for LEON's overseas manpower recruitment, candidate support, documentation, and travel services in India.

## Services covered

- Overseas manpower sourcing and Israel recruitment enquiries
- Caregiver, supermarket, general worker, CNC operator, plumber, welder, and packing roles
- Passport services and appointment assistance
- PCC, background verification, document upload, and visa documentation support
- Ticket booking and itinerary coordination

## Run locally

Node.js is required. The site has no external package dependencies.

```powershell
npm start
```

Open <http://localhost:4173>.

## Enquiry form

The preview validates enquiries and saves them locally in `data/enquiries.jsonl`. That directory is excluded from Git and is never publicly served. Email and WhatsApp delivery are not connected yet.

Before a production launch, add confirmed company contact details, approved service terms, privacy and retention information, and a production enquiry delivery system.

## Brand and imagery

The LEON logo is based on the supplied brand artwork. Workforce imagery was created with OpenAI's image generation tool for this website.
