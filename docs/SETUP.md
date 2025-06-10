# Development Setup

### 1. Install Required Programs

You'll need to install Docker and NodeJS + NPM.

Follow this guide to install Docker: https://docs.docker.com/get-docker/

- If on Windows 10 Home, you'll need to first [enable WSL 2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and then follow this guide: https://docs.docker.com/docker-for-windows/install-windows-home/

Install NodeJS v.18.20.5

- Download Node v.18.20.5 here: https://nodejs.org/download/release/v18.20.5/
- Or if you have [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#about) installed already, use command: `nvm install v18.20.5` or `nvm install 18 --lts` to install the correct Node version, then `nvm use v18.20.5` to use it as the current Node version
- Use `nvm current` to verify installation and setup was correctly set
  - More information for [Windows](https://medium.com/@jamylam3/easily-switch-between-node-versions-using-node-version-manager-nvm-14619007ebef) and [Linux & Mac](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) machines here

Follow this guide to set up a proper environment for React Native v0.71.3: https://reactnative.dev/docs/environment-setup

- For Apple Sillicon machines, when following the guide for the Android SDK Setup, ensure you are using `Android 11.0 ("R")` with `Android SDK Platform 30` and `Google APIs ARM 64 v8a System Image`

Follow this guide to install an Android emulator which can be used to run the mobile app: https://developer.android.com/studio/run/emulator/

Note that we are currently targeting API 30 (Android 11.0).  Pixel 6 is confirmed to work well.

Install JDK 17 from here: https://jdk.java.net/java-se-ri/17

#### For Mac Users:
- To run powershell scripts (.ps1 files), you can can follow the steps here: https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-macos?view=powershell-7.4 
    - This link goes through how to download powershell for Mac. Once that is done you can start a powershell instance and run .ps1 files.

### 2. Clone the Repo

Clone the repo using `git`. Ensure you have registered your SSH key with `github.sfu.ca` (out of scope of this guide).

### 3. Set up Environment Variables

#### Django backend

Create a file named `.env` in the root project directory. It should contain the following:

```
SECRET_KEY=secretkey
POSTGRES_USER=user
POSTGRES_PASSWORD=password
```

The values `secretkey`, `user`, and `password` are for your local development environment only - feel free to change them. Ensure you don't commit the `.env` file!

#### Mobile app

To specify a custom server for development builds of the mobile app, create a file called `.env` in
the `mobile` directory, containing the following:

```
APP_ENV="local"
LOCAL_URL="http://<some hostname or IP>" (Optional)
```

`APP_ENV` specified to `"local"` will allow the use of the `LOCAL_URL`, if `APP_ENV` is not specified, the development server will be used by default. Along with setting
`APP_ENV` to `"local"`, you can also set it to `"dev"`, `"staging"`, or `"prod"`, in case you would like the mobile app to point to the development, staging, or production
environments, respectively.

This is optional. If you do not specify `LOCAL_URL`, the development server is used by default on development builds. Note
that `LOCAL_URL` is ignored when running a production or staging build. Running the app by running `npm run android` in the mobile directory
will be considered a development build.

Note that changes to the `.env` file may not be applied if the environment variables are cached. To clear the cache and apply changes to `.env`, run the following:

```
expo r -c // this is outdated now as we no longer use Expo... // todosd
```

If you are going to be using an IP address, you will need to specify the port (8000) in the URL.

- If you are going to be developing the app with a physical phone:
  - Ensure that the phone is connected to the same network as the computer that will be running the
    backend.
  * Use the computer's local IP address for `<some hostname or IP>` above.
    - On Windows, you can find the local IP by running `ipconfig` in PowerShell or the command line.
    - On macOS and Linux, you can find the IP by running `ifconfig`.
- If you are going to be developing the app with AVD / Android Emulator, then use `10.0.2.2` as the
  IP address, since
  [the emulator's virtual router uses that as an alias for localhost / `127.0.0.1` on your computer](https://developer.android.com/studio/run/emulator-networking#networkaddresses):

  ```
  LOCAL_URL="http://10.0.2.2:8000"
  ```

### 4. Install Required NPM Packages

- Navigate to `common/` and run:  
  `npm install`
- Navigate to `web/` and run:  
  `npm install`
- Navigate to `mobile/` and run:  
  `npm run refresh-common`
  `npm install`

 The `npm run refresh-common` command will rebuild the `common` package and reinstall it in `mobile/`. If we did not force a reinstall of common it would generate an `EINTEGRITY` error due to a mismatch between the `common` package and cached SHA in `mobile/package-lock.json`.

### 5. Run Django Database Migrations

In the project directory, run `docker compose up`.

Once both Django and Postgres are running, run `docker exec cbr_django python manage.py migrate` to apply database migrations.
Once migrations have been applied, run `docker exec cbr_django python manage.py seeddatabase` to seed some data for development purposes if desired.

### 6. You're done!

For instructions to run locally and contribute, see the [contribution guide](CONTRIBUTION.md).
