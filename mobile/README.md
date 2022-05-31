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
   `$ npm pack ../common/`  
   `$ npm install cbr-common-1.0.0.tgz`
4. Install necessary node modules:  
   `$ npm install`

# Build Run mobile

1. Run back-end, front-end, and DB docker containers:  
   `$ docker-compose up`
2. Launch an Android virtual device via Android Studio, or connect an Android phone to your computer.
    - If using a physical phone, you must enable developer mode via the settings menu, then enable USB debugging, then disconnect and reconnect the phone from the computer.
    - When the phone is first connected to the computer, after USB debugging has been enabled, then on the phone you'll need to authorize your computer to use USB debugging with your phone.
3. Build and launch from mobile/ folder  
   `$ react-native run-android`
    - This command may take 10+ minutes. If it seems to hang, wait 5 minutes before concluding it's hung.
    - For more infor os Neact Native on Android, see this [Tutorials Point guide](https://www.tutorialspoint.com/react_native/react_native_environment_setup.htm)

# Rebuilding app

After the app is up and running the first time, after you make a change to the code you can quickly rebuild the app by....

**TO BE FILLED IN!**

-   How is it best to do hot-reloading?

# Troubleshooting

-   After running `npm install` in the mobile/ folder, if you get an error for `EINTERGRITY` complaining about a SHA-512 mismatch, then it is likely that you need to re-run the `npm install cbr-common-1.0.0.tgz` comamnd inside the mobile/ folder to trigger it updating the SHA-512 of our custom package building built on your machine.
-   After running `npm install` in the mobile/ folder, if you get an error for `EBADPLATFORM` related to the package `fservants`, then delete `mobile/package-lock.json` and re-run `npm install` to update to a newer fservants
-   After running `docker-compose up` in the project folder, if it complains that POSTGRES_USER, POSTGRES_PASSWORD, SECRET_KEY and such are not set, then:
    -   Ensure you have created the .env file in the project's root directory with those contents
    -   If in windows, ensure you are running the command via PowerShell (not Git Bash)
-   After running `react-native run-android` if you see "Could not determine the dependencies of task ':app:installDebug'.", it likely means you have not correctly created the `local.properties` file.
-   When running the mobile app, if you see "cachedAPIGet(..): API fetch failed" it likely means that you have not started the backed Docker containers, or are not targeting the correct URL for the back-end.
-   If you see the error "NativeModules.DatabaseBridge is not defined!", it likely means that you are trying to use Expo to run the project. However, the project has been ejected from Expo in order to work with Watermelon DB, so we cannot use the `expo start` command.
-   If your username and password are rejected when logging in, ensure that you can log in via the web interface first. You may need to seed the database by running the populate database script to setup the default user(s).
-   Upon doing react-native run-android, if a message below is returned, 
   ```
   ERROR cachedAPIGet(cache_user): API fetch failed (unable to get an access token) and no backup; using error value" 
   ```
   then enter this command in your terminal while running docker backend
   ```
   docker exec cbr_django python manage.py migrate
   ```