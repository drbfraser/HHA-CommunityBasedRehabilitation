# RELEASE PROCEDURE

# MOBILE RELEASE APK

### 1. Select the branch

Select the branch you wish to create an release APK for mobile CBR

### 2. Setup release Keystore

Following this guide to setup a release keystore: https://reactnative.dev/docs/signed-apk-android

Follow the instruction to generate a release keystore and place into `mobile/android/app` directory level (should be in the same level as the debug.keystore)
_Option tip: The keystore password and key alias password should be different_

After creating the keystore, add/edit the ~gradle/gradle.properties files to include the following: (Replace what was written in the keystore in here)

CBR*UPLOAD_STORE_FILE=\*\*\_my-upload-key***.keystore
CBR_UPLOAD_KEY_ALIAS=**_my-key-alias_**
CBR_UPLOAD_STORE_PASSWORD=**\***
CBR_UPLOAD_KEY_PASSWORD=**\*\*\*

\*Note, you may have to create the gradle.properties file if not present by using the following command in powershell if in windows C:\myFolder>type nul >gradle.properties

### 3. Adding the release Signing Config

within the `build.gradle` in `mobile/android/app/`, add the following within `signingConfigs`

release {
if (project.hasProperty('CBR_UPLOAD_STORE_FILE')) {
storeFile file(CBR_UPLOAD_STORE_FILE)
storePassword CBR_UPLOAD_STORE_PASSWORD
keyAlias CBR_UPLOAD_KEY_ALIAS
keyPassword CBR_UPLOAD_KEY_PASSWORD
}
}

### 4. Create the Release APK

cd back the mobile directory

run command **_npm run build [target environment]_**, choose from one of the following environment: "local", "dev", "staging", and "prod" depending on the server you would like to connect to

The generated release APK should be located in `mobile/android/app/build/outputs/apk`

### 5. Running the Release APK

The APK can be installed directly to a physical device or emulator
Alternatively, you can use the command **_react-native run-android --variant=release_** in the mobile directory and launch an emualtor

You are done!
