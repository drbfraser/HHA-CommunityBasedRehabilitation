# Running Locally

Please first follow the [setup guide](SETUP.md) if you have not already.

### 1. Start Docker Containers

1. Open the project directory in a terminal window.

2. If dependencies have been added since you last ran the project, you may need to run `docker compose build` first.

3. Run `docker compose up`

4. If database models have changed since you last ran the project, you may need to run `docker exec cbr_django python manage.py migrate` with the Docker containers running.

### 2. Start NPM Development Server

#### Web Application

1. Open the `web` directory in a terminal window.

2. If dependencies have been added since you last ran the project, you may need to run `npm install` first.

3. Run `npm start`

#### Mobile Application

1. Open the `mobile` directory in a terminal window

2. If anything in `common` has changed since last running the project, `npm run refresh-common` must be run so that the changes will be reflected in the mobile app.

3. Run `npm run android`

**Note:** if `versionName` changes, go to `mobile/android/app/build.gradle` and change the value of `versionName` under `defaultConfig` AND change `VERSION_NAME` variable in `mobile/src/screens/Sync/Sync.tsx`

### 3. Seed Some Data

You'll likely want to seed some data for development purposes. This can be done with a single command, or done individually by data type. Use `docker exec cbr_django python manage.py _______` by replacing the `_______` with one of the keywords below.

- Complete Database: `seeddatabase`

- Zones: `seedzones`
- Disabilities: `seeddisabilities`
- Users: `seedusers` (or use `seedadminuser` to create one admin with a random password; useful for production install)
- Clients: `seedclients`
- Visits: `seedvisits`
- Alerts : `seedalerts`

If at some point during development you want to re-seed the database with the example data again, you'll need to delete everything first. Use `docker exec -it cbr_django python manage.py flush` to clear the database, then run the seeding commands again.

If the seed commands fail with an error related "relation 'cbr_api_zone' does not exist", it is likely you need to run the `docker exec cbr_django python manage.py migrate` command to create the DB structure.

### 4. Start Developing!

That's it! The frontend is now running on http://localhost:3000 and the backend is running on http://localhost:8000. Both the frontend and the backend should support hot reloading.

For using a local server when developing the mobile app, ensure that you have followed the mobile environment variables instructions from [SETUP.md](SETUP.md).

If you seeded users in the previous step, you already have an account in the system. Use the username `venus` and password `hhaLogin` to log in, and from there you can create another user if you wish to change the username and password you use.

You can also access auto-generating Swagger API documentation at http://localhost:8000/docs

# How to Contribute

Overall, it is best to create small issues and merge often.

### 0. Create Issue in SFU's GitHub (if necessary)

If an issue has not yet been filed in GitHub, make sure to create one and assign it to yourself first.

### 1. Create New Branch

1. Ensure you're on the `master` branch. If not, check it out using `git checkout master`
2. Pull the latest changes using `git pull`
3. Create a new branch with a short, descriptive name starting with the issue number. For example, `6-frontend-login-page`. You can create a branch using the command `git checkout -b [BRANCH_NAME]`

### 2. Write Code

Make sure to commit frequently (at least every few hours).

**Database Changes:**

If you make changes to any of the database models, you'll need to create a migration by running `docker exec -it cbr_django python manage.py makemigrations`. Then run `docker exec cbr_django python manage.py migrate` to actually apply the migrations.

### 3. Clean Up + Test

Once you are finished, take some time to clean up your code and make sure to test your changes thoroughly. This will help keep our code base clean and avoid any unexpected bugs.

### 4. Format Code

Prior to submitting a merge request make sure to format your code - it won't pass the CI/CD pipeline without it. Note that both of these commands end in a `.` - that's important!

**Common:**

From within the `common` directory, run `npx prettier --write .`

**Mobile:**

From within the `mobile` directory, run `npx prettier --write .`

**Frontend:**

From within the `web` directory, run `npx prettier --write .`

**Backend:**

With the Django Docker container running, run `docker exec cbr_django python -m black .`

### 5. Submit a Merge Request

First, make sure you've committed all changes and pushed your branch and then submit a merge request from within SFU's GitHub. If you've recently pushed your branch, on the merge requests page you'll see a blue "Create merge request" button.

Your merge request will automatically run our CI/CD pipelines to test your branch. If any pipelines fail, you can click on the red `X` icon and then click on the job that failed to see more details and fix the problem.

### 6. Code Review

In-depth code reviews are good! They help everyone write better code, keep our code base clean and help to ensure we create great software.

During the code review process, you'll likely receive a few suggestions for things to improve or fix. Once all necessary changes have been made, other developers will approve the merge request.

### 7. Merge

Once at least one other developer has approved your merge request, all discussions are resolved and the CI/CD pipelines pass, you can merge when ready.

**Note:** it is best practice for the person who made the merge request to merge it. If you are reviewing a merge request, don't merge it after approving it - the original author may still want to make a few changes or other team members might be in the process of reviewing it.
