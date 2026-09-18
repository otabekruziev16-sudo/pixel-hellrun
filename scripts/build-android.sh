#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/bundle.cjs
sdk_root="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
test -n "$sdk_root"
tools_dir="$sdk_root/build-tools/35.0.0"
android_jar="$sdk_root/platforms/android-35/android.jar"
mkdir -p build/android/classes build/android/dex release
"$tools_dir/aapt2" compile --dir android/res -o build/android/resources.zip
"$tools_dir/aapt2" link -o build/android/base.apk -I "$android_jar" --manifest android/AndroidManifest.xml -A build/android-assets build/android/resources.zip
javac -encoding UTF-8 --release 8 -classpath "$android_jar" -d build/android/classes android/MainActivity.java
mapfile -d '' classes < <(find build/android/classes -name '*.class' -print0)
"$tools_dir/d8" --lib "$android_jar" --min-api 23 --output build/android/dex "${classes[@]}"
cp build/android/base.apk build/android/unsigned.apk
(cd build/android/dex && zip -q -j ../unsigned.apk classes.dex)
"$tools_dir/zipalign" -f 4 build/android/unsigned.apk build/android/aligned.apk
# Sideload/test build: the ephemeral signing key is never committed or uploaded.
keytool -genkeypair -keystore build/android/test-signing.keystore -storepass android -keypass android -alias hellrun-test -keyalg RSA -keysize 2048 -validity 3650 -dname "CN=HellRun Test, O=HellRun, C=UZ"
"$tools_dir/apksigner" sign --ks build/android/test-signing.keystore --ks-key-alias hellrun-test --ks-pass pass:android --key-pass pass:android --out release/HellRun-Android.apk build/android/aligned.apk
"$tools_dir/apksigner" verify --verbose release/HellRun-Android.apk
"$tools_dir/aapt2" dump badging release/HellRun-Android.apk
