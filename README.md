# HellRun MOD 2.5 — personal testing build

Based on HellRun 2.5 commit `31816d7811b9075538f7f2a6ef0589c31189388f`, on the separate `codex/hellrun-test-mod` branch.

- Unlimited test coins: the wallet displays **∞**. Buying skins or extra lives never deducts coins; collecting coins never consumes the balance. A finite internal sentinel keeps JSON saves valid.
- All **100 levels** are unlocked from the first launch and remain unlocked after restarting. Choose any level from the map; levels are not falsely marked as completed.
- The existing 3-life rules, checkpoints, traps, required exit coins and original SS+ effects remain. Skins can be bought freely with the unlimited test wallet; equipping a skin remains a deliberate choice.
- No real-money checkout or payment is involved. This standalone test build is not a Steam submission.

## Install separately

Android: `HellRun-MOD-Android.apk`, labelled **HellRun MOD**, package `uz.otabekruziev.pixelhellrun.testmod`. The WebView origin and app storage are separate from Hardcore.

Windows: `HellRun-MOD-Windows-x64.exe`. The application uses `HellRun-Test-MOD` beneath the Windows application-data folder, plus a separate web save key `hellrun-test-mod-v1`. It does not load or overwrite the normal game's saves.

## Build

`npm install`, `npm test`, `npm run build:web`.

Browser verification: install Playwright Chromium, then `npm run test:browser`.

Android: the same JDK 17 / Android SDK 35 toolchain as the normal release; run `bash scripts/build-android.sh`. CI APKs are test-signed; downloadable releases are re-signed with the privately retained key.

Windows: `npm run build:windows`. The Windows job launches the actual MOD EXE and checks an SS+ purchase without a debit, all 100 map buttons, level 100 movement, dash, sound, respawn and its separate save key.

Unit tests retain the normal-game regression checks and add MOD-level selection, all-skin purchases, repeated revives and persistence. Browser tests also verify that a normal save stored at its old key is untouched. Android device checks verify the separate package, infinite wallet, SS+ purchase, process restart and mobile layout.

The retained commercial-readiness documents describe the normal release's context. Use the normal release branch for any Steam work; `--steam` is explicitly rejected in this MOD branch.
