#!/bin/bash
# Build a signed release APK of the mobile app. Runs INSIDE the CI image
# (reactnativecommunity/react-native-android:13.2.1), following the same steps as
# .github/workflows/mobile-apk-build.yml. Started by build_apk_docker.sh / build_apk_docker.ps1;
# not meant to be run directly.
#
# Usage: build_apk_in_container.sh <target>     (target: local, dev, staging, prod)
#
# Expected mounts:
#   /repo                         repo root (read-only); the committed HEAD is built
#   /build, /gradle, /root/.npm   Docker volumes: work dir, Gradle cache, npm cache
#   /secrets/gradle.properties    signing config (read-only)
#   /secrets/upload.keystore      upload keystore (read-only)
#   /out                          APK output folder

set -euo pipefail

TARGET="$1"
NPM_VERSION=10.7.0
START=$(date +%s)

export HOME=/build
export GRADLE_USER_HOME=/gradle

# Builds share the /build volume, so allow only one at a time; a second build would
# delete the first one's files.
exec 9> /build/.build.lock
if ! flock -n 9; then
    echo "ERROR: Another APK build is already running (it uses the same Docker volumes)."
    echo "Wait for it to finish, then try again."
    exit 1
fi

# Signing config for this build only: point the store file at the mounted keystore,
# and remove the file afterwards so no secrets stay in the Gradle cache volume.
# (Set after taking the lock, so a refused build can't delete a running build's config.)
trap 'rm -f /gradle/gradle.properties' EXIT
grep -v '^CBR_UPLOAD_STORE_FILE=' /secrets/gradle.properties > /gradle/gradle.properties
echo "CBR_UPLOAD_STORE_FILE=/secrets/upload.keystore" >> /gradle/gradle.properties

echo "== Export committed HEAD"
rm -rf /build/repo
mkdir -p /build/repo
git -c safe.directory='*' -C /repo archive HEAD | tar -xf - -C /build/repo
SHA=$(git -c safe.directory='*' -C /repo rev-parse --short=8 HEAD)

echo "== npm $NPM_VERSION"
npm install -g "npm@$NPM_VERSION" --no-audit --no-fund >/dev/null

echo "== Build common"
cd /build/repo/common
npm ci --no-audit --no-fund
npx tsc

echo "== Install common into mobile; npm ci (applies patches)"
cd /build/repo/mobile
npm uninstall @cbr/common --no-audit --no-fund
COMMON_PACK_NAME=$(npm pack ../common | tail -n 1)
npm install "$COMMON_PACK_NAME" --no-audit --no-fund
npm ci --no-audit --no-fund
if ! grep -q "Patched via patch-package" \
    node_modules/expo-image-picker/android/src/main/java/expo/modules/imagepicker/ImagePickerModule.kt; then
    echo "ERROR: expo-image-picker patch was not applied (see mobile/patches/)."
    exit 1
fi

echo "== Prebuild"
npx expo prebuild --clean --platform android

echo "== Build APK (APP_ENV=$TARGET)"
APK=android/app/build/outputs/apk/release/app-release.apk
npm run build-apk "$TARGET"
# build.js does not pass on Gradle's exit code, so check for the APK instead.
if [ ! -f "$APK" ]; then
    echo "ERROR: Gradle build failed; no APK produced."
    exit 1
fi

VERSION=$(node -p "require('./app.json').expo.version")
OUT="/out/CBR-$TARGET-$VERSION-$SHA.apk"
cp "$APK" "$OUT"
echo "== Done in $(( ($(date +%s) - START) / 60 )) min: $(basename "$OUT")"
