# HellRun 2.5 — Steam review preparation

Status: **local Windows review candidate, not submitted, not Valve-approved**. No Steamworks App ID, depot IDs, partner account, live purchase service or storefront has been connected in this project.

## Concrete release changes

- The twelve anime-derived designs are removed from the shipped renderer and catalog. The SS+ collection now has original geometric armour with individual idle/walk/dash forms. Purchased ownership and equipment migrate without payment or lost saves.
- The Steam build uses `channel: steam-offline`. It does not present the personal build's unfinished real-money coin calculator. Earned coins buy cosmetics and extra lives normally. No external payment links, fake checkout, or local purchase success exists.
- `npm run build:steam` produces `release-steam/win-unpacked/`, including the executable, runtime, license notices, content and an integrity manifest. Keep every file together; the portable personal EXE is not the Steam depot.
- CI checks actual launch, movement, dash, sound, a death/respawn, settings, cosmetics and saved progress in both Windows outputs. Browser checks cover 18 interface languages, Arabic RTL, small screens, migration and the Steam-specific menu. This is automated validation, not a physical controller/Steam Deck certification or completion of Valve's review.

## Upload preparation

1. In the owner's Steamworks app, obtain the real Windows App ID and depot ID. Configure a Windows x64 depot and the launch executable `HellRun Hardcore.exe`, with no command-line arguments. Do not include `--smoke-test` in a shipping launch option.
2. Download/extract the complete `HellRun-Steam-Windows` artifact, or build it locally. Keep the Electron runtime and its license notices with the executable.
3. Run `npm run steam:prepare -- --appid YOUR_APP_ID --depot YOUR_DEPOT_ID --content release-steam/win-unpacked`. The generator validates the profile manifest, content hash and numeric IDs and writes `steam-upload/app_build.vdf`. It deliberately has `Preview "1"`, no `SetLive`, and performs no network operation.
4. Run the SteamPipe preview with the partner's authorized Steamworks SDK/SteamCMD setup. Inspect its file list. The owner can then change Preview to 0 for an intentional upload to the app's review/beta branch. Authentication stays with the owner; no passwords or API keys belong in this repository.
5. Test installation and launch **through Steam** on each claimed supported Windows OS; verify pause/resume, save persistence, F11, languages and physical input devices. This cannot be verified using an unrelated fake App ID.
6. Complete the Steamworks store checklist and content survey, upload near-final store assets and the reviewed build, then submit using the partner dashboard. No submission has been made automatically.

## Store description draft — offline launch scope

**Short description**

Climb 100 trap-filled stair courses in a precision platformer. Dodge saws, cross laser gates, collect every coin and reach the exit. Three lives, persistent checkpoints and an original cosmetic collection reward practice.

**About this game**

HellRun Hardcore is a single-player platformer built around narrow ledges, mandatory elevated coins and deliberate movement. Its 100 courses change their opening geometry and hazard rhythms across ten visual chapters.

Jump, dash and time your route through saws, lasers, crumbling steps, slippery ice, conveyors and moving ledges. Dash has a cooldown and does not make you invulnerable. Each exit opens only after you collect all of that course's coins.

You have three lives. A remaining life returns you to your last checkpoint. At zero lives, spend earned coins for one extra life or restart the current course for free. Campaign progress and locally earned coins persist between sessions.

Collect 40 cosmetic skins across eight ranks. The twelve original SS+ designs unfold their armour and change their visual effects while walking and dashing. Cosmetics do not alter movement, collision size or lives. High-rank cosmetics require substantial repeated play to earn. All coins in this Steam build are earned through gameplay.

Play offline with keyboard controls, remappable keys, configurable sound volume and optional motion effects. Eighteen interface languages include Uzbek, Russian, English, Arabic, Korean, Italian, German, French, Spanish, Portuguese, Chinese, Japanese, Turkish, Hindi, Indonesian, Dutch, Polish and Swedish. Saves are local to the device.

## Store settings and remaining assets

- Declare single-player and the languages actually present. There is no spoken dialogue; do not label all languages as full audio. Use ordinary Windows x64 support only after testing the versions stated on the page.
- Do not select In-App Purchases, Steam Cloud, Achievements, multiplayer, trading, Remote Play, full controller support or Steam Deck Verified without implementing/testing those specific promises. Standard Gamepad API controls are present; hardware certification was not performed.
- Use actual gameplay screenshots from this release. CI screenshots can help review the build, but menu shots/contact sheets are not substitutes for gameplay store screenshots. Upload correctly sized capsules with a readable HellRun title. Store capsules, trailer, final screenshots and measured hardware requirements still need publisher preparation and selection.
- Complete the Content Survey honestly: stylized trap deaths and non-realistic particle effects; no sexual content, gambling or live AI systems are implemented. Review the complete submitted content before selecting official survey answers.
- AI disclosure draft for owner review: “AI-assisted tools were used in development, including original procedural cosmetic/environment artwork and interface localization. Content is bundled in the game; no live AI generation is used during play.” Do not describe player-facing AI-assisted artwork/localization as absent merely because the images are generated through code.
- The publisher must confirm rights to the inherited base game and branding, supply legal/business and support details and finish the partner onboarding/checklist. This file cannot certify those facts or bind Valve.

## Reviewer walkthrough

Launch → choose language → start level 1 → move/jump/dash → pause → settings → return → skin shop → SS+ → compare Idle/Walk/Dash previews → return and resume. Collect the course's coins, activate a checkpoint and die to verify persistence. The free default look and all courses are playable without any payment. Cosmetic previews work without buying a skin.

## Official references checked 2026-09-21

- [Valve's review process](https://partner.steamgames.com/doc/store/review_process): launchable builds, implemented advertised features, gameplay screenshots, Steam Wallet for real in-game transactions.
- [SteamPipe uploads](https://partner.steamgames.com/doc/sdk/uploading): depot mapping, preview mode and separate upload/publication steps.
- [Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey): complete content and player-facing AI disclosures.
- [Steam microtransactions](https://partner.steamgames.com/doc/features/microtransactions/implementation): the required future purchase integration. See BILLING.md for outstanding backend work.
