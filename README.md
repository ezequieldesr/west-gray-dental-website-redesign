# West Gray Dental redesign

A local, 28-page redesign built from the clinic’s downloaded website and authentic assets. The second design pass takes inspiration from [Texas Dental Center](https://texasdentalcenter.com/) for its rotating hero, interactive treatment discovery, review browsing, and prominent appointment access. West Gray’s identity, photography, and business information remain its own. No deployment was performed; the original download is untouched.

Vercel hosting and security hardening are configured in `vercel.json`. See [SECURITY.md](SECURITY.md) for the review, tests, remaining limits, and exact deployment settings. This remains a public informational site; forms prepare email drafts and must not be used for medical records.

## Run

Requires Node.js 18 or newer. No dependency installation is needed.

```powershell
npm run build
npm run check
npm run check:security
npm run test:security
npm start
```

Open http://127.0.0.1:4173. Generated files are in `west-gray-dental/dist`.

Edit `build.cjs` for shared templates and original page content; `experience.cjs` for the interactive homepage and new local pages; `brand.css`, `style.css`, and `motion.css` for styling; and `app.js` for behavior. Original photographs and fonts are in `public/assets`. Rebuild after edits; direct changes in `dist` are overwritten.

## Interactive experience

- Three-photo hero with crossfades, gentle image motion, manual selection, and pause. Playback stops on hover, keyboard focus, hidden tabs, and reduced-motion preferences.
- Headline entrances and staggered scroll reveals. Content stays visible without JavaScript; reduced-motion settings disable animated entrances.
- Care-by-goal tabs with keyboard navigation and contextual links.
- Service filters with accessible result counts.
- Clinic photo mosaic and lightbox with Escape closing and restored focus.
- Patient review browsing, first-visit journey, scroll progress, back-to-top control, and mobile appointment bar.
- Decorative floating and scroll-cue animations finish within five seconds.

## Pages and navigation

The original 18 pages remain: Home, About, Our Dentists, Dental Services, Dent’Art, Insurance & FAQ, Patient Forms, Blog Archive, Contact & Location, Appointments, and eight service detail pages.

Ten local pages were added:

| Page | File |
| --- | --- |
| First visit guide | `first-visit.html` |
| Health history preparation | `health-history.html` |
| Privacy and consent document guidance | `privacy-documents.html` |
| Screening guidance | `screening.html` |
| Dental pain relief archive summary | `responsible-dental-pain-relief.html` |
| Halloween archive summary | `halloween-smile-care.html` |
| Healthy lifestyle archive summary | `healthy-lifestyle.html` |
| Light & Memory historical exhibition | `light-and-memory.html` |
| Ramillete de Flores historical exhibition | `ramillete-de-flores.html` |
| Destinations Texas & Beyond historical exhibition | `destinations.html` |

All visitor links to the legacy West Gray Dental and Kim Ho DDS sites have been removed from generated pages. Appointments, services, articles, resource guidance, and exhibitions stay local. External maps, email, and phone links are intentional. Source links remain in this document; the original clinic homepage remains in structured-data provenance rather than navigation.

## Brand and original assets

The downloaded theme CSS contains violet `#5A5AF2`, green `#4C8748`, pale green `#CDDE9E`, gray `#505050`, and white `#FFFFFF`. These are retained, with neutral charcoal `#292B31` and off-white `#FAFAF7`. Local Open Sans files are paired with Georgia headings.

Original assets include the metallic WG logo, exterior `DSC_1068.jpg`, reception `DSC_1052.jpg`, hallway `DSC_1040.jpg`, preparation area `DSC_1039.jpg`, treatment room `DSC_1043.jpg`, Dr. Ho portrait `DSC_1094.jpg`, published Dr. Aramwattananont portrait `Arambio.jpg`, Dent’Art collage, and exhibition artwork. No staff portraits, reviews, or treatment-result images were invented. Image data is preserved; display containers may crop images. Gallery previews are lazy-loaded.

## Verification

- `npm run check`: 28 distinct pages, valid structured data, image descriptions, and 1,259 local links/assets, including fragment targets. The check rejects visitor links to legacy clinic domains.
- Chrome checked every page at 390, 768, and 1440 pixels: no horizontal overflow or broken images.
- Interaction checks passed for slideshow selection and pause over a seven-second interval; goal tabs and keyboard navigation; service filtering/reset; lightbox Escape/focus; review navigation; progress; reduced motion; appointment validation/honeypot; mobile booking; and readable content without JavaScript.
- Desktop and mobile screenshots inspected. No runtime exceptions observed. No emails or appointment requests sent during tests.

## Before launch

**Email delivery:** The local appointment and contact forms validate inputs and prepare email drafts. The visitor must send the draft from their email app. The site does not send, store, or confirm requests. Configure and test a delivery backend, server-side validation, rate limiting, and spam protection before offering direct submission. The client-side honeypot is not production spam protection.

**Patient PDFs:** All five PDF URLs listed by the original clinic site were attempted over HTTPS and could not be retrieved. Local resource pages provide explicitly labeled guidance and office contact information. They do not replace official questionnaires, consent documents, or privacy policies. Obtain current official PDFs from the office before adding downloads. Sensitive health information should not be sent through the general email-draft form.

**Clinic confirmation:** Confirm current dentist availability, insurance participation, payment policies, affiliations, and hours. The original dentist page mixes West Bellfort contact information with both biographies; availability notices remain. Sunday is unspecified. No financing, emergency-hours, pricing, or treatment-result claims were imported from the inspiration site.

**Archives:** Article pages summarize historical posts, preserve their original dates, and are not updated medical advice or verbatim reprints. Exhibitions are marked historical. Reviews remain labeled summaries. The published 25-year experience statement is attributed to the practice’s story, not every dentist.

**Deployment:** Local builds have `noindex,nofollow`, disallow crawlers, and omit canonical URLs. Set the confirmed production origin to generate canonicals, absolute Open Graph image URLs, and sitemap entries:

```powershell
$env:SITE_URL = 'https://your-confirmed-domain.example'
npm run build
npm run check
```

Confirm image reuse authorization with the clinic before public release.

## Sources

Downloaded source: `D:\www\west-gray-dental-redesign\westgraydental.com`.

- [Clinic homepage](https://westgraydental.com/), [services](https://westgraydental.com/invisalign-and-implants/), and [dentist biographies](https://westgraydental.com/dentist/).
- [Dent’Art archive](https://westgraydental.com/dentart/), [insurance and FAQ](https://westgraydental.com/insurance/), and [patient forms](https://westgraydental.com/forms/).
- [Location and hours](https://westgraydental.com/location/) and [contact details](https://westgraydental.com/contact/).
- [Blog index](https://westgraydental.com/our-blog/).
- [Pain-relief article, February 9, 2016](https://westgraydental.com/2016/02/its-essential-for-a-healthy-lifestyle-2/).
- [Halloween article, October 30, 2015](https://westgraydental.com/2015/10/how-to-avoid-cavities-this-halloween/).
- [Healthy-lifestyle article, October 9, 2015](https://westgraydental.com/2015/10/its-essential-for-a-healthy-lifestyle/).
