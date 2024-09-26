# CBR Mobile Build / Run Directions

The CBR Mobile app uses the React Native framework along with [WatermelonDB](https://nozbe.github.io/WatermelonDB/). It has been ejected from the normal Expo build process in order to support WatermelonDB.

# Setup

1. Install Android Studio, configure a virtual device

2. Add Android SDK to path (to run `adb`, Android Debug Bridge)
    - Find the location of the Android SDK: in Android Studios go to Tools > SDK Manager, at top under "Android SDK Location"
    - Under Windows, goto Start > "Environment Variables" > Environment Variables > User variables for ... > Path.
    - Add to the end the `platform-tools/` sub-folder of the Android SDK, such as: `D:\Users\Brian\AndroidSDK\platform-tools`
    - Close and re-open any terminals
    - Test by running:  
      `$ adb`

3. Set the JAVA_HOME environment variable
    - Find the location of your installed version of the Java JDK. Likely something like `C:\Program Files\Java\jdk-11.0.5`
    - JDK 11.0.5 is known to work; JRE 8 is known not to.
    - Under Windows, goto Start > "Environment Variables" > Environment Variables > User variables for ... > add new entry for `JAVA_HOME`, and set to `C:\Program Files\Java\jdk-11.0.5` (or the like).
    - Close and re-open any active terminals

4. Install `react-native` command line tools  
   `$ npm install -g react-native-cli`

5. Configure the project with the location of the SDK
    - Find SDK path: in Android Studios > Tools > SDK Manager, at top under "Android SDK Location"
    - Create file `mobile/android/local.properties`, and setup the path such as shown below. You must escape any `\` in the path with an extra `\` (Windows).
        ```
        sdk.dir = /D:\\Users\\Brian\\AndroidSDK
        ```

If you need to change the version of node/npm, then try:

1. Install nvm:  
   `$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
2. Close and reopen shell
3. Install needed node versions:  
   `$ nvm install 14`
4. For each new shell you open, set the node (and hence also npm) version to use:  
   `$ nvm use 14`

# Configure Node packages

1. Select the version of node/npm to use if needed (may need to be done in each new prompt you open up)  
   `$ nvm use 14`
2. Change to mobile folder:  
   `$ cd mobile/`
3. Package up `common/` and force a re-install, overriding whatever SHA was in the `package-lock.json` file:  
   `$ npm run refresh-common`
4. Install necessary node modules:  
   `$ npm install`

# Build Run mobile

1. Run back-end, front-end, and DB docker containers:  
   `$ docker compose up`
2. Launch an Android virtual device via Android Studio, or connect an Android phone to your computer.
    - **NOTE:** due to a run-time exception when targeting API 34 (Android 14.0) on ARM64 ("Keeps Stopping" error message), we are currently targeting API 30 (Android 11.0).  Confirmed to work on `Pixel 6 API 30` virtual device on both ARM64 and X86.
    - If using a physical phone, you must enable developer mode via the settings menu, then enable USB debugging, then disconnect and reconnect the phone from the computer.
    - When the phone is first connected to the computer, after USB debugging has been enabled, then on the phone you'll need to authorize your computer to use USB debugging with your phone.
3. Build and launch from mobile/ folder  
   `$ react-native run-android`
    - This command may take 10+ minutes. If it seems to hang, wait 5 minutes before concluding it's hung.
    - For more info on React Native on Android, see this [Tutorials Point guide](https://www.tutorialspoint.com/react_native/react_native_environment_setup.htm)

# Rebuilding app

After the app is up and running the first time, after you make a change to the code you can quickly rebuild the app by....

**TO BE FILLED IN!**

-   How is it best to do hot-reloading?

# Troubleshooting
-   If running the app in a virtual device via Android Studio, note that `Logcat` (in the bottom left corner) can offer some very useful error messages than metro.  This can greatly help with troubleshooting.

-   After running `npm install` in the mobile/ folder, if you get an error for `EINTERGRITY` complaining about a SHA-512 mismatch, then it is likely that you need to re-run the `npm install cbr-common-1.0.0.tgz` command inside the mobile/ folder to trigger it updating the SHA-512 of our custom package building built on your machine.

-   After running `npm install` in the mobile/ folder, if you get an error for `EBADPLATFORM` related to the package `fservants`, then delete `mobile/package-lock.json` and re-run `npm install` to update to a newer `fservants`

-   After running `docker compose up` in the project folder, if it complains that POSTGRES_USER, POSTGRES_PASSWORD, SECRET_KEY and such are not set, then:
    -   Ensure you have created the .env file in the project's root directory with those contents
    -   If in windows, ensure you are running the command via PowerShell (not Git Bash)

-   After running `react-native run-android` if you see "Could not determine the dependencies of task ':app:installDebug'.", it likely means you have not correctly created the `local.properties` file.

-   When running the mobile app, if you see "cachedAPIGet(..): API fetch failed" it likely means that you have not started the backed Docker containers, or are not targeting the correct URL for the back-end.  It is possible that your environment variables are improperly set, or a wondow reloadmay be necessary to make them apply.

-   If you see the error "NativeModules.DatabaseBridge is not defined!", it likely means that you are trying to use Expo to run the project. However, the project has been ejected from Expo in order to work with Watermelon DB, so we cannot use the `expo start` command.

-   If your username and password are rejected when logging in, ensure that you can log in via the web interface first. You may need to seed the database by running the populate database script to setup the default user(s).

- Upon doing react-native run-android, if a message below is returned,
    ```
    ERROR cachedAPIGet(cache_user): API fetch failed (unable to get an access token) and no backup; using error value"
    ```
then enter this command in your terminal while running docker backend:
    ```
    docker exec cbr_django python manage.py migrate
    ```

- If Android app fails to load with message "Unable to load Script. Make sure you're either running Metro (...) or that your bundle `index.android.bundle` is packaged correctly for release", then try re-running the `npm run android` command. (Seems to happen when the React Native terminal does not stay open.)

- If when building the Android app you get an error stating something like:
    ```
    Execution failed for task ':app:mapDebugSourceSetPaths'.  
    Could not resolve all files for configuration ':app:debugRuntimeClasspath'.
    ```
  and it seems like files or directories cannot be found in
  `~/.gradle/caches/*`, then try deleting the entire `~/.gradle` directory and building the app again 
   - ref: https://stackoverflow.com/questions/70010356/android-gradle-build-fails-from-cached-files. 
   - There are also other solutions in the SO post, but they have not been tested with CBR.

-  If `common` package does not update correctly (such as translations being stale after they have been updated), here is a large set of things to try to clean up the project:

    DID NOT WORK:
    - Close the emulator and the React Native command line
    - [X] Android clean: (from mobile/android) `.\gradlew cleanbuildCache` >> Error: not a build target.
    - Android clean: (from mobile/android) `.\gradlew clean`, then npm install
    - Remove `mobile\android\.gradle` folder
    - Expo cleanup (in mobile/) `expo r -c`
    - Remove all files git ignores (interactively: don't delete your `.env` file!)  
      `git clean -d -f -x -i`
      (delete .expo, android/.expo, android/.gradle, android/app/build, android/build, android/local.properties, node_modules)
        - npm run refresh-common
        - npm run android
        (build failed once due to concurrent access, then failed to run "Unable to load script"(re-ran android command))
    - Reboot
    - Open Android Studio and let it build there automatically (Gradle build tasks)
    - Open Android project in Android Studio and do a Build > Clean Project; then Build > Rebuild Project
    - Android studio: Increase maximum heap size
    - Run from inside Android Studio (debug) (1st: build failed, 2nd: runtime error "Unable to load script"; 3rd same, 4th same)
    - Run from inside Android Studio (run) (1st: "unable to load script"; 2nd same (tried reload but "could not connect to development server."))
    - Delete all cache folders:
        - Android Studio: Build > Clean
        - Android Studio: File > Invalidate Caches (clear both), restart and then quickly exit
        - `git clean -d -f -x -i`
        - Reboot
        - `~/.android/` and `~/.gradle` folders
        - `npm cache clean --force`
        - NPM installs  
            /common: npm install
            /mobile: npm run refresh-common
            /mobile: npm install
        - Rebuild from command line
            /mobile: npm run android (fails)
        - Open project in Android Studio (gradle downloads packages)
        - Run project /mobile: npm run android (fails)
        ==> Still old text.

    - [WORKS] Close React server, /mobile: `npm start -- --reset-cache`; then `r`
        - Gives EADDRINUSE port 8081 error if react server is running.
        ==> YAY! Seems to have cleared the cache out! BUT app shows no translations.

    CURRENTLY TRYING:
    - [X] npm run android -- --reset-cache
        (the "--" on its own differentiates NPM options (before it) from program arguments (after))
        (Fails to launch: "react-native run-android --reset-cache" unknown option '--reset-cache')

    TO TRY
    
    - Delete the `~/.android/cache` folder and the `~/.gradle` folder.
    - Reset npm cache: (from mobile/) `npm start -- --reset-cache`
    - Run `npm clean --force`

    - Resources:  
       [Stack Overflow](https://stackoverflow.com/questions/46878638/how-to-clear-react-native-cache)  
       [Medium.com](https://medium.com/@under_the_hook/become-a-react-native-developer-how-to-clean-cache-in-your-project-acfe4983e139)
       [Android on a diet](https://engineering.backmarket.com/put-your-android-studio-on-a-diet-fa4d364acb05)
- When running Android (`npm run android`), if you get any of the following errors, they can sometimes be resolved by re-running the command (a few times?), or pressing 'r' or 'a' in the React-native window to reload the Android app:
    "The development server returned response error code: 500"...
- Error "Error: Unable to resolve module async-mutex from", try re-running `npm install` on mobile folder.