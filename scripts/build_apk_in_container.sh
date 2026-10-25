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
#   /build, /gradle, /root/.npm   Docker volumes: work dir (incl. ccache), Gradle cache, npm cache
#   /opt/android/ndk              Docker volume: Android NDKs. The image lacks the NDK version the
#                                 build needs, so Gradle installs it; keeping it in a volume avoids
#                                 re-downloading it and keeps its timestamp stable, which ccache
#                                 needs to reuse compiled C++.
#   /secrets/gradle.properties    signing config (read-only)
#   /secrets/upload.keystore      upload keystore (read-only)
#   /out                          APK output folder

set -euo pipefail

TARGET="$1"
NPM_VERSION=10.7.0

# Print a heading for each stage and record how long the previous one took;
# the timings are summarized at the end. `stage ""` ends the last stage.
STAGE_NAME=""
STAGE_START=$SECONDS
TIMINGS=""
stage() {
    if [ -n "$STAGE_NAME" ]; then
        TIMINGS+=$(printf "%5ds  %s" $((SECONDS - STAGE_START)) "$STAGE_NAME")$'\n'
    fi
    STAGE_NAME="$1"
    STAGE_START=$SECONDS
    if [ -n "$1" ]; then
        echo "== $1"
    fi
}

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
# Reuse task outputs (Kotlin/Java compiles, lint, ...) from earlier builds when inputs are
# unchanged. The cache lives in the /gradle volume.
echo "org.gradle.caching=true" >> /gradle/gradle.properties

# Reset the compiler cache's counters so the end-of-build stats cover only this build.
ccache --zero-stats > /dev/null

stage "Export committed HEAD"
rm -rf /build/repo
mkdir -p /build/repo
git -c safe.directory='*' -C /repo archive HEAD | tar -xf - -C /build/repo
SHA=$(git -c safe.directory='*' -C /repo rev-parse --short=8 HEAD)

stage "npm $NPM_VERSION"
npm install -g "npm@$NPM_VERSION" --no-audit --no-fund >/dev/null

stage "Build common"
cd /build/repo/common
npm ci --no-audit --no-fund
npx tsc

stage "Install common into mobile; npm ci (applies patches)"
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

stage "Prebuild"
npx expo prebuild --clean --platform android

stage "Build APK (APP_ENV=$TARGET)"
# Same Gradle command that `npm run build-apk` (build.js) runs, which CI uses, plus
# --profile for a per-task timing report. Calling Gradle directly also gives us its
# exit code, which build.js does not pass on.
if ! (cd android && APP_ENV="$TARGET" ./gradlew assembleRelease --profile); then
    echo "ERROR: Gradle build failed; no APK produced."
    exit 1
fi
stage ""

VERSION=$(node -p "require('./app.json').expo.version")
BASE_NAME="CBR-$TARGET-$VERSION-$SHA"
cp android/app/build/outputs/apk/release/app-release.apk "/out/$BASE_NAME.apk"

# Gradle's profile report is an HTML page plus its CSS/JS files.
PROFILE_DIR="/out/$BASE_NAME-gradle-profile"
rm -rf "$PROFILE_DIR"
cp -r android/build/reports/profile "$PROFILE_DIR"

echo "== Stage timings:"
printf "%s" "$TIMINGS"
echo "== Compiler cache (ccache):"
ccache --show-stats | sed '/^Primary storage/q' | { grep -E "^ *(Hits|Misses|Uncacheable):" || true; }
echo "== Gradle profile: $(basename "$PROFILE_DIR")/$(basename "$(ls "$PROFILE_DIR"/profile-*.html)")"
echo "== Done in $((SECONDS / 60)) min: $BASE_NAME.apk"
