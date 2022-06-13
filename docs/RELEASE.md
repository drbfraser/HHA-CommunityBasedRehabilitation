# RELEASE PROCEDURE

## MOBILE RELEASE APK

### 1. Select the branch

Select the branch you wish to create an release APK for mobile CBR

### 2. Setup release Keystore

The Google Drive folder for the project contains the keystore needed for signing `.aab` files for upload to the Google Play store (the Play store signs the files for release). Copy the file `cbr-upload-key.keystore` into `mobile/android/app/` (should be in the same level as the debug.keystore).

If you want to generate your own keystore instead of using the offical project one for upload, following this guide to setup a release keystore: https://reactnative.dev/docs/signed-apk-android

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

### 4. Create the Release APK

From the `mobile/` folder, run _one_ of the following commands based on what you want to build:
- `npm run build local`  
  Build an APK for testing against your local computer.
- `npm run build dev`  
  Build an APK for testing against the dev server (built off `main` branch).
- `npm run build staging`  
  Build an APK for testing against the staging server (built off `staging` branch).
- `npm run build prod`  
  Build an signed AAB file for uploading to the Play store, targeting the production server.

The generated .apk (for "local", "dev", or "staging") should be located in `mobile/android/app/build/outputs/apk/release/app-release.apk`.

The generated .aab (for "prod") should be located in `mobile/android/app/build/outputs/bundle/release/app-release.aab`.

### 5. Running the Release APK

The APK can be installed directly to a physical device or emulator; the AAB file must be uploaded to the Play store in ordered to be installed on a phone.

Alternatively, you can use the command `react-native run-android --variant=release` in the mobile directory and launch an emualtor.

You are done!
