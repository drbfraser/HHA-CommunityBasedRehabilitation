# Build a signed release APK of the mobile app in the same Docker image CI uses, so local
# builds match CI. Builds the committed HEAD (uncommitted changes are NOT included).
# PowerShell version of build_apk_docker.sh; both run build_apk_in_container.sh.
#
# Usage (from any directory):
#   .\build_apk_docker.ps1 <target> [-GradleProperties <path>]
#     target: local, dev, staging or prod (selects which server the app talks to)
#     -GradleProperties: signing config; defaults to ~\.gradle\gradle.properties
#
# Output: mobile\build\apk\CBR-<target>-<version>-<commit>.apk, plus a Gradle timing report in
#   mobile\build\apk\CBR-<target>-<version>-<commit>-gradle-profile\ (open the profile-*.html).
#
# Caches are kept in Docker volumes (cbr_build, cbr_gradle, cbr_npm, cbr_ndk) so later builds
# are faster. To reset them: docker volume rm cbr_build cbr_gradle cbr_npm cbr_ndk

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateSet("local", "dev", "staging", "prod")]
    [string]$Target,

    [string]$GradleProperties = (Join-Path $HOME ".gradle\gradle.properties")
)

$ErrorActionPreference = "Stop"

$Image = "reactnativecommunity/react-native-android:13.2.1"
$RepoDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$OutDir = Join-Path $RepoDir "mobile\build\apk"

if (-not (Test-Path $GradleProperties -PathType Leaf)) {
    throw "Missing signing config: $GradleProperties"
}

# Find the keystore the same way Gradle does: CBR_UPLOAD_STORE_FILE is relative to
# mobile\android\app unless it's an absolute path. Undo .properties escaping (\\ and \:).
$StoreLine = Get-Content $GradleProperties | Where-Object { $_ -match '^CBR_UPLOAD_STORE_FILE=' } | Select-Object -Last 1
if (-not $StoreLine) {
    throw "CBR_UPLOAD_STORE_FILE is not set in $GradleProperties"
}
$StoreFile = ($StoreLine -replace '^CBR_UPLOAD_STORE_FILE=', '').Trim() -replace '\\\\', '\' -replace '\\:', ':'
if ([System.IO.Path]::IsPathRooted($StoreFile)) {
    $Keystore = $StoreFile
} else {
    $Keystore = Join-Path $RepoDir "mobile\android\app\$StoreFile"
}
if (-not (Test-Path $Keystore -PathType Leaf)) {
    throw "Missing upload keystore: $Keystore`n(Note: 'npm run prebuild' deletes mobile\android\, including any keystore stored there.)"
}

if (git -C $RepoDir status --porcelain) {
    $Sha = git -C $RepoDir rev-parse --short=8 HEAD
    Write-Warning "Uncommitted changes are NOT included; building HEAD $Sha."
}

New-Item -ItemType Directory -Force $OutDir | Out-Null

docker run --rm `
    -v "${RepoDir}:/repo:ro" `
    -v cbr_build:/build `
    -v cbr_gradle:/gradle `
    -v cbr_npm:/root/.npm `
    -v cbr_ndk:/opt/android/ndk `
    -v "${GradleProperties}:/secrets/gradle.properties:ro" `
    -v "${Keystore}:/secrets/upload.keystore:ro" `
    -v "${OutDir}:/out" `
    $Image `
    bash /repo/scripts/build_apk_in_container.sh $Target
if ($LASTEXITCODE -ne 0) {
    throw "Build failed (exit code $LASTEXITCODE)."
}

Write-Host "APK folder: $OutDir"
