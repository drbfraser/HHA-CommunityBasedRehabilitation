# RELEASE PROCEDURE

## MOBILE RELEASE APK / AAB

### 1. Select the branch

Select the branch you wish to create an release APK for mobile CBR.

#### 1.2: Configure Version Info

Before releasing a new version of the app, you must ensure that you have updated the version information.

**Update the `versionName`:**
1. For Android project in `mobile/android/app/build.gradle` under the `defaultConfig` (visible to user on Google Play store)
2. For our UI in `mobile/src/screens/Sync/Sync.tsx`, change `VERSION_NAME` to match (visible to user when using our app)

**Update `versionCode`:**
1. In `mobile/android/app/build.gradle` under the `defaultConfig`: incrementing to the next largest integer. This is used by the Play store to uniquely track each uploaded version, and must be new for each uploaded bundle.

Also, the API version number maintained in the mobile app must match that of the server. Ensure that `mobileApiVersion` in `mobile/src/util/syncHandler.ts` matches the version specified by `API_VERSION` in `server/cbr_api/util.py`. This will likely need to be updated only when a full DB wipe has occurred on the server and therefore requires the mobile client to also do a complete local database wipe before syncing with the server. Changing the major version number of the `API_VERSION` will cause the web client to wipe its database when syncing.

### 2. Setup release Keystore

The Google Drive folder for the project contains the keystore needed for signing `.aab` files for upload to the Google Play store (the Play store signs the files for release). Copy the file `cbr-upload-key.keystore` into `mobile/android/app/` (should be in the same level as the debug.keystore).

If you want to generate your own keystore instead of using the official project one for upload, following this guide to setup a release keystore: https://reactnative.dev/docs/signed-apk-android

After creating the keystore, add/edit the `~/.gradle/gradle.properties` files to include the following:

```
CBR_UPLOAD_STORE_FILE=cbr-upload-key.keystore
CBR_UPLOAD_KEY_ALIAS=upload
CBR_UPLOAD_STORE_PASSWORD=<store password>
CBR_UPLOAD_KEY_PASSWORD=<key password>
```

Under Windows, this will likely be `C:\Users\<your ID>\.gradle\gradle.properties`

### 3. Adding the release Signing Config

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

### 4. Create the Release APK or AAB

#### Build an APK

In `mobile/`, to build an **APK file** suitable for local testing or directly installing onto an emulator/Android device, run _one_ of the following commands based on what you want to build:
- `npm run build local`: Target server your local computer.
- `npm run build dev`: Target the dev server.
- `npm run build staging`: Target the staging server.
- `npm run build prod`: Target the production server.

The generated .apk will be in `mobile/android/app/build/outputs/apk/release/app-release.apk`.

#### Bundle an AAB
In `mobile/`, to build an **AAB file** suitable for distribution to the Play store, change from "build" to "bundle". For example:
- `npm run bundle prod`: Target the production server and build an AAB.

The generated .aab will be in `mobile/android/app/build/outputs/bundle/release/app-release.aab`.

**Troubleshooting**

- If you get the error in build step "Task :watermelondb:generateReleaseRFile FAILED" of "Execution failed for task ':watermelondb:generateReleaseRFile'." then try running `./gradlew clean` in the mobile/ folder, and re-run command to build AAB.
- If you get an error "Could not open cp_proj generic class cache for build file...", open Android Studio on the `mobile/android/` folder and run Build > Build Bundle(s) / APK(s) > Build Bundle(s), then rerun `npm run bundle prod`.

### 5. Running the Release APK

The APK can be installed directly to a physical device or emulator; the AAB file must be uploaded to the Play store in ordered to be installed on a phone.

Alternatively, you can use the command `react-native run-android --variant=release` in the `mobile/` directory and launch an emulator. You may need to uninstall any debug versions previously installed in the emulator to be able to install the release because the signing key will have changed.

You are done!
