# Pixel HellRun 1.1

Original 100-level HTML/Canvas platformer, updated for offline Android and Windows play.

## Changes
- Original pixel character, enemies, traps and level progression retained.
- Offline start, footstep, jump, landing, coin, death, level and victory sounds; persistent mute switch.
- Pointer capture and multitouch for walking and jumping together; controls clear when interrupted.
- Fixed-step 60 Hz physics on high-refresh screens.
- Fixed world-space laser collision, timeout/respawn loop, last-life race and level-101 victory bug.
- Reachable platforms, bounded coins, adequate coin-travel time, reusable falling blocks.
- Pause and app-background handling; no external fonts, network permissions or account login.

## Play
Windows: run HellRun-Windows-x64.exe on Windows 10/11 x64. Arrow keys or A/D move; Space/W/Up jumps; P/Esc pauses; F11 toggles fullscreen.
Android: install HellRun-Android.apk on Android 6+ with an up-to-date System WebView. Landscape controls support simultaneous movement and jumping. Back pauses first, then offers exit.

## Build
Node.js 22+.
- `npm install`
- `npm test`
- `npm run build:web`
- `npx playwright install chromium && npm run test:browser`
- Windows: `npm run build:windows`
- Android: JDK 17, Android SDK platform 35 / build-tools 35.0.0; set ANDROID_HOME, then `bash scripts/build-android.sh`.

The workflow produces separate APK, portable EXE and verification artifacts. It does not publish a release or merge to main.
The APK is a sideload/test build signed with an ephemeral test key; subsequent independent builds may require uninstalling the previous build. Keep a private persistent signing key for production distribution. The Windows executable is unsigned.

Android bundles the game into a local WebView with network and file access disabled. Windows embeds Chromium through Electron with Node access disabled, context isolation and sandboxing enabled.

Reference: [Android local content](https://developer.android.com/develop/ui/views/layout/webapps/load-local-content), [Electron portable target](https://www.electron.build/docs/nsis/).
