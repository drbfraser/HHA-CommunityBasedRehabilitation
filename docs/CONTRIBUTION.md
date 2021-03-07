# Running Locally

Please first follow the [setup guide](SETUP.md) if you have not already.

### 1. Start Docker Containers

1. Open the project directory in a terminal window.

2. If dependencies have been added since you last ran the project, you may need to run `docker-compose build` first.

3. Run `docker-compose up`

4. If database models have changed since you last ran the project, you may need to run `docker exec cbr_django python manage.py migrate` with the Docker containers running.

### 2. Start NPM Development Server

1. Open the `client` directory in a terminal window.

2. If dependencies have been added since you last ran the project, you may need to run `npm install` first.

3. Run `npm start`

### 3. Seed Some Data

You'll likely want to seed some data for development purposes. *Hint:* you will need zones in order to create a user. *Hint2:* you will need disabilities in order to create a client (in the future).

- Zones: `docker exec cbr_django python manage.py seedzones`
- Disabilities: `docker exec cbr_django python manage.py seeddisabilities`

### 4. Create an Account

*Temporary section until a seed script is created.*

You'll need an account to log in to the frontend and access most APIs. Note that this account is created in your local database and thus will not be present on other developer's machines or in our deployment (even after merging your branch). To create an account, run `docker exec -it cbr_django python manage.py createsuperuser` and follow the prompts. Use `1` when prompted for a zone (assuming you have followed the seeding instructions in the previous step).

### 5. Start Developing!

That's it! The frontend is now running on http://localhost:3000 and the backend is running on http://localhost:8000. Both the frontend and the backend should support hot reloading.

You can also access auto-generating Swagger API documentation at http://localhost:8000/docs


# How to Contribute

Overall, it is best to create small issues and merge often.

### 0. Create Issue in GitLab (if necessary)

If an issue has not yet been filed in GitLab, make sure to create one and assign it to yourself first.

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

**Frontend:**

From within the `client` directory, run `npx prettier --write .`

**Backend:**

With the Django Docker container running, run `docker exec cbr_django python -m black .`

### 5. Submit a Merge Request

First, make sure you've committed all changes and pushed your branch and then submit a merge request from within Gitlab. If you've recently pushed your branch, on the merge requests page you'll see a blue "Create merge request" button.

Your merge request will automatically run our CI/CD pipelines to test your branch. If any pipelines fail, you can click on the red `X` icon and then click on the job that failed to see more details and fix the problem.

### 6. Code Review

In-depth code reviews are good! They help everyone write better code, keep our code base clean and help to ensure we create great software.

During the code review process, you'll likely receive a few suggestions for things to improve or fix. Once all necessary changes have been made, other developers will approve the merge request.

### 7. Merge

Once at least one other developer has approved your merge request, all discussions are resolved and the CI/CD pipelines pass, you can merge when ready.

**Note:** it is best practice for the person who made the merge request to merge it. If you are reviewing a merge request, don't merge it after approving it - the original author may still want to make a few changes or other team members might be in the process of reviewing it.
