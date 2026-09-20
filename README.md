# HellRun Hardcore 2.3

An offline 100-level precision platformer for Android and Windows, rebuilt from Pixel HellRun.

## This version
- A coin-funded skin shop in the main and pause menus, with previews, rank filters, an owned collection, explicit purchase confirmation and free equipment changes. There are 40 paid skins plus the original free HellRun look. Every skin uses the same movement, collision box and lives; only the appearance changes.
- SS+ legendary skins cost 100,000 coins each: Naruto, Madara, Sasuke, Minato, Gojo, Sukuna, Luffy, Zoro, Ichigo, Aizen, Kakashi and Jiraya. Names remain unchanged in every language. Each has a distinct pixel silhouette, outfit, hair, accessories and a decorative aura.
- Four additional skins per rank: SS 80,000–95,000; S 60,000–75,000; A 40,000–55,000; B 20,000–35,000; C 10,000–15,000; D 3,000–8,000; E 500–2,000 coins. These are long-term collection prices; coin earnings and the 5-coin extra life remain unchanged.
- Skin ownership and equipment are saved atomically with wallet spending. Duplicate purchases and unowned equipment are rejected. The shop, including purchase confirmation and insufficient-balance messages, supports all 18 languages offline.
- Full viewport canvas with a camera that adapts to portrait, landscape and window resizing. Controls sit over the game instead of shrinking it into a small central rectangle.
- 100 deterministic ascending stair courses and a scrollable 100-step level selection map. Completed levels remain unlocked.
- Distinct course geometry: steep towers, long jumps, broad terraces, paired steps, narrow ledges, saw galleries, laser gates and crumbling routes. Each chapter rearranges the jump rhythms and trap sequences. Levels 1 and 2 now have visibly different openings, rather than small offsets of the same staircase.
- Narrow ledges, elevated mandatory coins, moving saws, telegraphed laser gates, collapsing stairs and rising lava from the first level. Later chapters narrow platforms and shorten safe laser windows.
- Each course has a visible entrance and an exit. Collect every coin and physically reach the exit to advance.
- Three lives. Each death consumes one; remaining lives respawn at the last green checkpoint. At zero lives, spend 5 wallet coins for one life and resume at the checkpoint, or explicitly restart the current level with three lives. A free restart resets that level's checkpoint and pickups while preserving the wallet and unlocked campaign levels. Completing a level refills three lives.
- Each coin adds one to the persistent wallet. Spending it does not remove the level's collected-coin progress or relock the exit. Replaying a restarted level can earn its coins again; simply reloading cannot award the same pickup again.
- Eighteen complete offline language packs: Uzbek, Russian, English, Arabic, Korean, Italian, German, French, Spanish, Portuguese, Chinese, Japanese, Turkish, Hindi, Indonesian, Dutch, Polish and Swedish. Use the language button in the toolbar, main menu or pause menu. Arabic menus use RTL while movement controls retain their physical directions. The language choice and translated Android exit dialog persist across launches.
- A checkpoint activates only after all earlier coins are collected, so rising lava cannot strand a required coin.
- Level, checkpoint, coins and deaths are saved locally. Pause, background, process restart and closing the window preserve saved progress.
- Offline start, walking, jumping, landing, coin, death, checkpoint, door and victory sounds, with a persistent mute button.

## Play
Android: install `HellRun-Android.apk`. The app is named **HellRun Hardcore**, supports Android 6+ with a current System WebView, and fits portrait or landscape. Press movement and jump together. Follow the device's rotation setting.

Windows 10/11 x64: run `HellRun-Windows-x64.exe`. A/D or arrows move, Space/W/Up jumps, P/Esc pauses, M opens the map, F11 toggles fullscreen.

The Hardcore Android package (`uz.otabekruziev.pixelhellrun.hardcore`) installs separately from version 1, whose original temporary signing key was not retained. Progress from version 1 was not saved by that version. Version 2 saves its own campaign.

## Build and verification
Node.js 22+: `npm install`, `npm test`, `npm run build:web`.

Browser checks: `npx playwright install chromium` then `npm run test:browser`.
Windows: `npm run build:windows`.
Android: JDK 17, Android SDK platform 35 and build-tools 35.0.0; set `ANDROID_HOME`, then `bash scripts/build-android.sh`.

The 29 unit tests cover reachability across 100 levels, distinct layouts, save migration, three-life exhaustion, purchase debits, insufficient funds, retry scope, wallet persistence, translation completeness and RTL selection, skin prices, exact legendary names, inventory, purchase idempotence and cosmetic-only physics, as well as the original physics and checkpoint checks. Browser tests cover all 18 languages at portrait and landscape phone sizes, language reload, Arabic controls, real purchase/retry buttons, level transitions, saved progress, touch and audio. Shop browser checks also verify every distinct sprite, real purchase/cancel/equip actions, shared life-wallet spending, inventory reload and all 18 shop layouts on phones. The Android emulator tests the shop and native Back, rotation, pause/resume, process restart, language selection and its translated native exit dialog. The Windows runner launches the actual portable EXE and purchases a skin through its UI.

Version 2.3 keeps the app identity and save location. Saves migrate to format 4 without losing levels, checkpoints, coins or lives. The original skin is always owned; new purchases are persistent. Earlier 2.0/2.1 saves receive the existing one-time wallet migration, while 2.2 wallets and lives retain their exact balance. Install the privately signed release over the previous Hardcore app to retain progress. Reopening a zero-life save does not grant free lives or refund spent coins.

CI APKs use an ephemeral test key. For a consistently signed personal release, re-sign the APK with a private persistent keystore using `apksigner` and retain that keystore privately for future updates. Do not commit signing keys. The Windows executable is unsigned. These are downloadable personal builds, not store publications.

Both apps bundle all content and run without network access. The Android WebView has network/file access disabled; Electron uses a sandbox and context isolation with Node integration disabled. Source changes remain on the `codex/hellrun-android-windows-audio` branch until merged.
