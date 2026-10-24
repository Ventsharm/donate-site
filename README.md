# GiftMe public donation pages

The Android app manages accounts and campaigns. This repository contains public donation pages, the campaign directory, update landing page and Stripe return pages.

Public campaign content is read from curated, saved JSON snapshots in GiftMe’s public Cloud Storage bucket. No Firestore SDK, sign-in or private campaign fields are exposed here. Snapshots update after creator saves and Stripe readiness changes.

Checkout calls the protected GiftMe backend. During maintenance, campaigns remain readable and new checkouts stop. Public Storage requests and bandwidth can still incur costs; this is not a universal hard spending cap.

Native app, backend and private controller source: `Ventsharm/private-android-builder`, branch `apps/giftme-native`, folder `apps/giftme`. Signing details remain in the private repository’s secrets.
