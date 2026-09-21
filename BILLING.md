# Coin purchasing: connection required

The product decision is **US$1.00 for 10,000 coins**. `store.js` provides an immutable integer-cent quote calculator. A requested whole quantity from 1 to 1,000,000,000 is rounded **up** to the next 100 coins so each cent always delivers 100 coins. Example: 12,345 requested → 12,400 delivered for 124 cents. The UI displays input, delivered quantity, price, and a localized rounding explanation. It rejects fractions, exponents, signs, separators and out-of-range input. Arabic/Persian/Devanagari/fullwidth numerals normalize to the same integer. Existing skin prices and earned-coin payouts have not changed.

The personal APK/EXE displays this as a **price preview**, not an actionable offer. The Steam offline profile has no visible real-money store entry points and refuses `showCoinStore()`. Never advertise in-app purchases for that profile. The local wallet now stores up to 2,000,000,000 earned coins without truncating old balances; that is not a paid-currency backend.

This build is an offline personal APK/portable EXE. It has **no working real-money checkout, native billing SDK, payment verification service, authenticated account, or server wallet**. The store shows the proposed price, explains that payments are disconnected and disables checkout. It never fabricates a purchase or adds currency. No publisher credentials are embedded in the game. Changing the catalog's availability flag would not implement billing.

## Required before enabling sales

1. **Steam:** a Steamworks partner app/App ID and configured in-game purchases; a server-held publisher Web API key; the Steamworks/native client integration and a deployed purchase service. Account authentication must bind each order to its Steam user. Let the platform display the actual currency/price and obtain explicit purchase authorization.
2. **Android:** a Play Console app and consumable one-time product matching the configured products, a tested Play Billing integration, and a verification service authorized for that app. Configure an eligible US$1.00 base price in the console; provider-supported price points, regional conversion and taxes may affect the actual store price. The current personal APK does not include Play Billing or network permission.
3. **Wallet/account migration:** the present earned wallet and skin ownership are local saves. Before selling currency, introduce an authenticated server-authoritative balance and inventory, with an explicit policy for migrating existing earned coins. Local saves and `Engine.buySkin` cannot be authoritative for paid spending. Local progress must remain playable offline, while purchases/paid spending synchronize with the account. Do not overwrite already-owned skins or checkpoints during migration.

## Fulfillment behavior to implement

- The server chooses item ID, quantity, price and recipient; the client cannot set grant amounts. Create an order idempotently and persist its lifecycle.
- Steam: initialize the transaction on the server, receive player authorization through Steam, query/finalize using the server API and grant only after successful finalization. Authorization alone is not payment. Never trust a browser return URL or a client success event as proof.
- Google Play: verify the purchase token on the server against the correct app, product and authenticated recipient; grant only a verified `PURCHASED` purchase, not a pending or cancelled one. Store a unique purchase identity and grant in the same database transaction. Consume the consumable through the backend with retries after granting; duplicates must not grant again.
- Apply skin spending and revive spending atomically against the authoritative wallet. Never let the offline client inflate the paid balance. Process refunds/chargebacks, reconnect/retry, restore/reconciliation and interrupted checkouts with a durable ledger.
- Validate sandbox/test purchases, cancelled and pending purchases, duplicate callbacks, network loss before/after payment, app reinstall, insufficient funds, currency formatting, refunds, account switching and server outages before enabling the buy action.

Official references:
- [Steam in-game purchase implementation](https://partner.steamgames.com/doc/features/microtransactions/implementation)
- [Google Play Billing security and purchase verification](https://developer.android.com/google/play/billing/security)

## Original collection in 2.5

The user authorized removing the old anime-derived appearances. Their rendering branches and catalog entries have been removed. Twelve original geometric armour designs now live in `legendary.js`. Old identifiers exist only in the ownership-migration map and its test fixtures. See [ASSET_PROVENANCE.md](ASSET_PROVENANCE.md).

## Connecting custom amounts later

- Recalculate the quote on the server from the requested integer. Never accept a client-supplied amount, unit price, currency or recipient as authoritative. Persist requested amount, rounded delivered amount and provider currency amounts in the order.
- Steam: configure a coin item and use a server-owned quantity/total calculation with the current microtransaction API. The requested USD quote is a base-rate preview, not proof of supported regional price points or transaction limits. Apply Steam's current currency increments, supported amounts, user country/currency and limits before showing the final authorized offer. Fail explicitly if a requested amount cannot be sold.
- Google Play: arbitrary USD totals cannot be invented by this client calculator. Match only configured products and a supported quantity flow, display the provider's actual localized price, and make every adjustment explicit before purchase.
- Do not enable paid coins by flipping `available`, adding network permission, or revealing the preview in Steam. The native platform integration, deployed authenticated backend and payment reconciliation described above are still required.
