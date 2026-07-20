# MOBILE RELEASE APK / AAB PROCEDURE

The CI/CD server on automatically builds a `.aab` file suitable for upload to the Google Play store. To deploy you must:

-   Configure the version info (Section 1.2).
-   Create a PR on GitHub to trigger the build.
-   If build succeeds, upload the generated `.aab` file to the Play Store.
-   Merge your branch into `main`.

## 1. Select the branch

Select the branch you wish to create an release APK for mobile CBR.

### 1.2: Configure Version Info

Before releasing a new version of the app, you must ensure that you have updated the version information

**Update the Version Name:**
In `mobile/app.json`, update `expo.version` to a semantically appropriate new versionName (visible to users on the Google Play store)

**Update the `versionCode`:**
In `mobile/app.json`, update `expo.android.versionCode` by incrementing to the next largest integer. This is used by the Play store to uniquely track each uploaded version, and **must** be new for each uploaded bundle.

**Update the API Version Number:**
The API version number maintained in the mobile app must match that of the server. See next section for details.

### 1.2.1: `API_VERSION` — Forcing Incompatible Versions to Stop

`API_VERSION` (`server/cbr_api/util.py`) and `mobileApiVersion` (`mobile/src/util/syncHandler.ts`) are used to gate compatibility. `api_versions_compatible()` compares only the major version — `5.9.9` ↔ `5.0.0` are compatible; `5.x` - `6.x` are not. The server does not check the minor or patch numbers.

- The app sends `api_version` on every sync. If the major version doesn't match, the `sync` and `versioncheck/` endpoints return a 403, blocking the sync, esentially forcing the user to update their app.

- This is done so that the server ensures data sent from the mobile is compatible with its expected format and constraints.

- To force an update: bump the major version in both files

- A major bump wipes each client's local DB on next sync

- The "HHA CBR is Updating!" modal. Shown when the local DB was last synced under a different api version than the current app build. This happens on a fresh/never-synced install or after updating the app. The modal calls `versioncheck/`: if the server says compatible (200) it shows this "clear local data to sync" prompt; if incompatible (403) it shows the "outdated app, update on Play Store" prompt instead. Confirming wipes local DB, syncs, then records the current version so it won't reappear until the version changes.


**New startup behaviour as of Summer 2026.** On launch the app will run the following 2 checks :

1. **Play Store version check** — if a newer app version is available, show a non-blocking prompt:
   > "A new version of this app is available from the Google Play Store. Please update the app the next time you..."

2. **Version Check For Major Version** - if a major version differs from mobile and server, display a clear warning to the user on the dashboard telling them that none of the work they are doing will be saved and they must update to the newest version.

### 1.3: Ensure `android` Directory is Updated

1. In `mobile/`, run `npm run prebuild` to ensure that the project is up to date.

## 2. Setup release Keystore

The Google Drive folder for the project contains the keystore needed for signing `.aab` files for upload to the Google Play store (the Play store signs the files for release). Copy the file `cbr-upload-key.keystore` into `mobile/android/app/` (should be in the same level as the debug.keystore). Please note that running `npm run prebuild` will **OVERWRITE** the keystore file.

If you want to generate your own keystore instead of using the official project one for upload, following this guide to setup a release keystore: https://reactnative.dev/docs/signed-apk-android

After creating the keystore, add/edit the `~/.gradle/gradle.properties` files to include the following:

```
CBR_UPLOAD_STORE_FILE=cbr-upload-key.keystore
CBR_UPLOAD_KEY_ALIAS=upload
CBR_UPLOAD_STORE_PASSWORD=<store password>
CBR_UPLOAD_KEY_PASSWORD=<key password>
```

Under Windows, this will likely be `C:\Users\<your ID>\.gradle\gradle.properties`
Under macOS, this will likely be `Users/<your ID>/.gradle/gradle.properties`

## 3. Adding the release Signing Config

This process should be automatic as a part of the `prebuild` process, and is managed through the `mobile/plugins/withAndroidSigningConfig.ts` plugin. Please note that this plugin may be brittle, and should be carefully verified upon any updates to React Native or Expo. If this process fails, the following legacy manual procedure is provided as a fallback.

**Manual Signing**
If not done already, then within the project file `mobile/android/app/build.gradle`, add the following within `signingConfigs`

```
release {
    if (project.hasProperty('CBR_UPLOAD_STORE_FILE')) {
        storeFile file(CBR_UPLOAD_STORE_FILE)
        storePassword CBR_UPLOAD_STORE_PASSWORD
        keyAlias CBR_UPLOAD_KEY_ALIAS
        keyPassword CBR_UPLOAD_KEY_PASSWORD
    }
}
```

Note that as we are using a managed workflow for Continuous Native Generation via Expo Prebuild (https://docs.expo.dev/workflow/continuous-native-generation/), any manual edits made to files within the `android` directory such as these will be overwritten when the project is rebuilt.

## 4. Create the Release APK or AAB

### Build an APK

To build an **APK file** suitable for local testing or directly installing onto an emulator/Android device, run _one_ of the following commands from within the `mobile/` directory based on what you want to build:

-   `npm run build-apk local`: Target server your local computer.
-   `npm run build-apk dev`: Target the dev server.
-   `npm run build-apk staging`: Target the staging server.
-   `npm run build-apk prod`: Target the production server.

The generated .apk will be in `mobile/android/app/build/outputs/apk/release/app-release.apk`.

### Bundle an AAB

To build a signed **AAB file** suitable for distribution to the Play store, run the following command from within the `mobile/` directory:

-   `npm run build-aab prod`: Target the production server and build an AAB.

The generated .aab will be in `mobile/android/app/build/outputs/bundle/release/app-release.aab`.

**Troubleshooting**

-   If you get the error in build step "Task :watermelondb:generateReleaseRFile FAILED" of "Execution failed for task ':watermelondb:generateReleaseRFile'." then try running `./gradlew clean` in the mobile/ folder, and re-run command to build AAB.
-   If you get an error "Could not open cp_proj generic class cache for build file...", open Android Studio on the `mobile/android/` folder and run Build > Build Bundle(s) / APK(s) > Build Bundle(s), then rerun `npm run bundle prod`.

## 5. Running the Release APK

The APK can be installed directly to a physical device or emulator; the AAB file must be uploaded to the Play store in ordered to be installed on a phone.

From within Android Studio, an APK may be loaded and profiled under file->`Profile or Debug APK`

<!-- TODOSD: verify, update -->
<!-- Alternatively, you can use the command `react-native run-android --variant=release` in the `mobile/` directory and launch an emulator. You may need to uninstall any debug versions previously installed in the emulator to be able to install the release because the signing key will have changed. -->
