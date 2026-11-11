# Security review and Vercel deployment

The project has been hardened as a **public, static informational website**. No website can be guaranteed secure. This review covers the source, generated assets, and proposed Vercel headers; it does not certify medical-data handling or a live deployment.

## Current exposure

The site has no login, database, server-side submission endpoint, analytics SDK, or package dependencies. The only executable browser script is the locally served `app.js`. Forms do not send requests to an application server or persist patient data. Vercel serves the generated files; `serve.cjs` is a loopback-only development preview.

## Protections added

- `vercel.json` selects the static build output, rather than publishing the repository root.
- Enforced Content Security Policy restricts scripts, CSS, images, and fonts to this origin. Inline executable scripts, event handlers, inline style attributes, `eval`, arbitrary network connections, plugins, base-tag changes, form submissions, and framing of the site are blocked. Google Maps is the only permitted external frame source. JavaScript CSSOM property changes used by animations remain functional.
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, Permissions Policy, same-origin opener/resource policies, and HSTS are configured. HSTS uses one year without `includeSubDomains` or preload, to avoid changing unrelated subdomain behavior.
- Source URL configuration must be an HTTPS origin without credentials, path, query, fragment, or custom port. Metadata is HTML encoded, and structured JSON cannot terminate its script data block.
- `.vercelignore` and `.gitignore` exclude browser profiles, environment files, credentials, and local tools. The build audits output for unexpected/private files, symlinks, active SVG content, and some recognizable credential patterns. This check is not a comprehensive secret scanner.
- Contact and appointment forms declare POST, have no JavaScript-free GET fallback, and ship with disabled submit buttons. JavaScript installs the prevent-default handler before enabling them. CSP blocks native submissions as a second layer. No entered information is added to the website URL or logged by the application.
- Maps require a visitor click before Google receives an embed request. The clinic’s original `https://www.google.com/maps/embed` address is explicitly allowed by CSP, avoiding the old `maps.google.com` host redirect. The frame uses no referrer and a sandbox without permission to navigate the top-level page. A separate directions link remains available if the map fails. Its own internal activity is controlled by Google; the site’s CSP does not govern the contents of a cross-origin frame.
- Preview deployments remain `noindex` even when `SITE_URL` is configured. Robots directives limit indexing; they are **not access controls**.

## Email and health information

The forms only prepare a `mailto:` draft in the visitor’s email application. The visitor must review and send it there. Names, email, phone, date, and message are passed to the email app; no server delivery or secure clinical messaging is implemented. Keep the displayed instruction not to include sensitive medical information. Do not use these forms for medical records, health-history forms, or patient portal access.

If direct email delivery is added later, review that change separately: server-side validation, request-size limits, origin checks, abuse controls, rate limiting, safe email construction, provider credentials, logging, retention, and an appropriate process for patient information will be required. The current honeypot is only a client-side convenience.

## Tests run

```powershell
npm run build
npm run check
npm run check:security
npm run test:security
```

The build verifies 28 pages and local links. Security tests exercise malicious deployment URLs, output encoding, credential/private-file rejection, active SVG rejection, headers, method restrictions, and traversal boundaries. Headless Chrome checked all pages at mobile/tablet/desktop widths under the configured headers, plus all interactions, reduced motion, and no-JavaScript behavior. Browser security checks verify that normal interactions do not trigger CSP violations, injected inline scripts are blocked, maps are opt-in and sandboxed, and forms fail closed without JavaScript.

These are local checks using the same header values as Vercel. Headers and routing still need verification on the actual deployment; none has been created in this task.

Map regression check: the clinic’s original embed URL now matches the exact CSP frame allowlist, with the consent gate, sandbox, and persistent directions fallback tested in Chrome. This execution environment denies external browser network access (`ERR_NETWORK_ACCESS_DENIED`), so live Google map tiles could not be visually verified here.

## Publish on Vercel

1. Import the repository with **Root Directory set to the repository root**. Framework preset: **Other**. The committed configuration uses `npm run build && npm run check && npm run check:security` and output directory `west-gray-dental/dist`. Do not select `public`, `.`, or the source root as the output directory.
2. Add `SITE_URL` in the Vercel project's **Production** environment with the confirmed public HTTPS origin, such as your assigned Vercel domain or your connected custom domain. No trailing path, secrets, or quotes. Without it, the site works but stays excluded from indexing.
3. Keep preview deployments protected using Vercel Deployment Protection where supported by your account. Protect the Vercel/Git accounts with MFA and use least-privilege project access. Do not place API keys or patient information in this static repository.
4. Deploy a preview and check the homepage, appointment page, services, images, fonts, and opt-in map. Keep Vercel Toolbar injection disabled if it conflicts with the strict CSP; do not broadly weaken the policy for a preview convenience.
5. Inspect the real response headers for the homepage, an inner page, and a missing route. Confirm the CSP and other configured headers are present and browser developer tools show no unexpected policy errors. Verify that `.env`, `build.cjs`, `security.cjs`, and browser profiles are unavailable as public files. This is the remaining live verification step before release.

The platform configuration follows [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json), [Vercel security headers](https://vercel.com/docs/cdn-security/security-headers), and [deployment exclusions](https://vercel.com/docs/deployments/vercel-ignore).
