# HellRun Hardcore 2.0

An offline 100-level precision platformer for Android and Windows, rebuilt from Pixel HellRun.

## This version
- Full viewport canvas with a camera that adapts to portrait, landscape and window resizing. Controls sit over the game instead of shrinking it into a small central rectangle.
- 100 deterministic ascending stair courses and a scrollable 100-step level selection map. Completed levels remain unlocked.
- Narrow ledges, elevated mandatory coins, moving saws, telegraphed laser gates, collapsing stairs and rising lava from the first level. Later chapters narrow platforms and shorten safe laser windows.
- Each course has a visible entrance and an exit. Collect every coin and physically reach the exit to advance.
- Unlimited attempts. Death returns to the last green checkpoint and keeps the current level and collected coins. A checkpoint activates only after all earlier coins are collected, so rising lava cannot strand a required coin.
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

The 12 engine tests cover physical stair and coin reachability in all 100 levels, deterministic generation, repeated death and save reload, checkpoint safety, exit gating, level-100 completion, pause/timeouts, collapsing stairs, laser hitboxes, invalid saves and refresh-rate consistency. Browser tests cover full viewport layouts, touch cancellation and multitouch, saved progress, audio and the 100-node map. The Android emulator tests portrait/landscape, pause/resume and restarting the process. The Windows runner launches the actual portable EXE.

CI APKs use an ephemeral test key. For a consistently signed personal release, re-sign the APK with a private persistent keystore using `apksigner` and retain that keystore privately for future updates. Do not commit signing keys. The Windows executable is unsigned. These are downloadable personal builds, not store publications.

Both apps bundle all content and run without network access. The Android WebView has network/file access disabled; Electron uses a sandbox and context isolation with Node integration disabled. Source changes remain on the `codex/hellrun-android-windows-audio` branch until merged.
