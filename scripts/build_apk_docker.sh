#!/bin/bash
# Build a signed release APK of the mobile app in the same Docker image CI uses, so local
# builds match CI. Builds the committed HEAD (uncommitted changes are NOT included).
#
# Usage (from any directory, on Linux, macOS or Git Bash):
#   ./build_apk_docker.sh <target> [gradle.properties path]
#     target: local, dev, staging or prod (selects which server the app talks to)
#     gradle.properties: signing config; defaults to ~/.gradle/gradle.properties
#
# Output: mobile/build/apk/CBR-<target>-<version>-<commit>.apk, plus a Gradle timing report in
#   mobile/build/apk/CBR-<target>-<version>-<commit>-gradle-profile/ (open the profile-*.html).
#
# Caches are kept in Docker volumes (cbr_build, cbr_gradle, cbr_npm) so later builds are
# faster. To reset them: docker volume rm cbr_build cbr_gradle cbr_npm
# Windows PowerShell users can run build_apk_docker.ps1 instead.

set -euo pipefail

IMAGE=reactnativecommunity/react-native-android:13.2.1
TARGET="${1:-}"
GRADLE_PROPS="${2:-$HOME/.gradle/gradle.properties}"

case "$TARGET" in
    local | dev | staging | prod) ;;
    *)
        echo "Usage: $0 <local|dev|staging|prod> [gradle.properties path]"
        exit 1
        ;;
esac

REPO_DIR="$(cd "$(dirname "$(realpath "$0")")/.." && pwd)"
OUT_DIR="$REPO_DIR/mobile/build/apk"

if [ ! -f "$GRADLE_PROPS" ]; then
    echo "Error: Missing signing config: $GRADLE_PROPS"
    exit 1
fi

# Find the keystore the same way Gradle does: CBR_UPLOAD_STORE_FILE is relative to
# mobile/android/app unless it's an absolute path. Undo .properties escaping (\\ and \:).
STORE_FILE=$({ grep '^CBR_UPLOAD_STORE_FILE=' "$GRADLE_PROPS" || true; } | tail -n 1 | cut -d= -f2- \
    | tr -d '\r' | sed -e 's/\\\\/\\/g' -e 's/\\:/:/g')
if [ -z "$STORE_FILE" ]; then
    echo "Error: CBR_UPLOAD_STORE_FILE is not set in $GRADLE_PROPS"
    exit 1
fi
case "$STORE_FILE" in
    /* | [A-Za-z]:*) KEYSTORE="$STORE_FILE" ;;
    *) KEYSTORE="$REPO_DIR/mobile/android/app/$STORE_FILE" ;;
esac
if [ ! -f "$KEYSTORE" ]; then
    echo "Error: Missing upload keystore: $KEYSTORE"
    echo "(Note: 'npm run prebuild' deletes mobile/android/, including any keystore stored there.)"
    exit 1
fi

if [ -n "$(git -C "$REPO_DIR" status --porcelain)" ]; then
    echo "Warning: uncommitted changes are NOT included; building HEAD $(git -C "$REPO_DIR" rev-parse --short=8 HEAD)."
fi

mkdir -p "$OUT_DIR"

# On Git Bash, Docker needs Windows paths and MSYS must not rewrite the container paths.
to_docker_path() {
    if command -v cygpath > /dev/null; then cygpath -w "$1"; else echo "$1"; fi
}
export MSYS_NO_PATHCONV=1

docker run --rm \
    -v "$(to_docker_path "$REPO_DIR"):/repo:ro" \
    -v cbr_build:/build \
    -v cbr_gradle:/gradle \
    -v cbr_npm:/root/.npm \
    -v "$(to_docker_path "$GRADLE_PROPS"):/secrets/gradle.properties:ro" \
    -v "$(to_docker_path "$KEYSTORE"):/secrets/upload.keystore:ro" \
    -v "$(to_docker_path "$OUT_DIR"):/out" \
    "$IMAGE" \
    bash /repo/scripts/build_apk_in_container.sh "$TARGET"

echo "APK folder: $OUT_DIR"
