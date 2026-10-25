# GiftMe public donation pages

The Android app manages accounts and campaigns. This repository contains the public pages and assets used alongside the current native app.

## Files retained and why

| Files | Purpose |
| --- | --- |
| `index.html`, `get-app.html` | Route campaign links and direct visitors to the Android app. |
| `donate.html`, `404.html` | Render public campaigns, including named URLs such as `/debtfree`. The custom 404 page is required by GitHub Pages for those routes. |
| `campaigns.html`, `public-directory.js` | Show the saved public campaign directory. |
| `public-campaign.js`, `public-campaign.css`, `Icon-192.png` | Public campaign behaviour, shared styling and the icon used by public pages. |
| `stripe-return.html` | Return from Stripe account setup to the native app. |
| `donation-success.html`, `donation-cancel.html`, `payment-return.js` | Return from donation checkout to the relevant campaign. |
| `success.html`, `cancel.html` | Small compatibility redirects for previously issued payment return URLs. |
| `limit.html` | Show the temporary payment-attempt restriction message. |
| `maintenance.html`, `maintenance-page.js` | Retain the maintenance fallback and retry page. Public campaigns normally stay visible during maintenance. |
| `sw.js` | Compatibility endpoint for previously registered browser service workers; clears old GiftMe caches without touching other apps' caches. The native app does not register a service worker. |

Obsolete PWA manifest, unused 512px web icon and old web editor/login redirect pages have been removed. No current page references them. Git history preserves earlier versions for recovery.

Public campaign content is read from curated, saved JSON snapshots in GiftMe’s public Cloud Storage bucket. No Firestore SDK, sign-in or private campaign fields are exposed here. Snapshots update after creator saves and Stripe readiness changes.

Checkout calls the protected GiftMe backend. During maintenance, campaigns remain readable and new checkouts stop. Public Storage requests and bandwidth can still incur costs; this is not a universal hard spending cap.

Native app, backend and private controller source: `Ventsharm/private-android-builder`, branch `apps/giftme-native`, folder `apps/giftme`. Signing details remain in the private repository’s secrets.
