# CMPT 373: CBR Manager

- [Development Setup](#development-setup)
- [Running Locally](#running-locally)
- [Contribution Guide](#contribution-guide)
- [Style Guide](#style-guide)

# Development Setup

### 1. Install Required Programs

You'll need to install Docker and NodeJS + NPM.

Follow this guide to install Docker: https://docs.docker.com/get-docker/
  - If on Windows 10 Home, you'll need to first [enable WSL 2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and then follow this guide: https://docs.docker.com/docker-for-windows/install-windows-home/

Install NodeJS 14 LTS from here: https://nodejs.org/en/

### 2. Clone the Repo

Clone the repo using `git`. Ensure you have registered your SSH key with GitLab (out of scope of this guide).

### 3. Set up Environment Variables

Create a file named `.env` in the project directory. It should contain the following:

```
SECRET_KEY=secretkey
POSTGRES_USER=user
POSTGRES_PASSWORD=password
```

The secret key, username and password are for your local development environment only - feel free to change them. Ensure you don't commit the `.env` file!

### 4. Install Required NPM Packages

Navigate to the `client` folder and run `npm install`.

### 5. Run Django Database Migrations

In the project directory, run `docker-compose up`.

Once both Django and Postgres are running, run `docker exec cbr_django python manage.py migrate` to apply database migrations.

### 6. You're done!



# Running Locally

### 1. Start Docker Containers

In the project directory, run `docker-compose up`.

If dependencies have been added since you last ran the project, you may need to run `docker-compose build` first.

If database models have changed since you last ran the project, you may need to run `docker exec cbr_django python manage.py migrate` once Django is running.

### 2. Start NPM Development Server

In the `client` directory, run `npm start`.

If dependencies have been added since you last ran the project, you may need to run `npm install` first (from within the `client` directory as well).

### 3. Start Developing!

That's it! The frontend is now running on http://localhost:3000 and the backend is running on http://localhost:8000. Both the frontend and the backend should support hot reloading.



# Contribution Guide

Overall, it is best to create small issues and merge often.

### 0. Create Issue in GitLab (if necessary)

If an issue has not yet been filed in GitLab, make sure to create one and assign it to yourself first.

### 1. Create New Branch

1. Ensure you're on the `master` branch. If not, check it out using `git checkout master`
2. Pull the latest changes using `git pull`
3. Create a new branch with a short, descriptive name starting with the issue number. For example, `6-frontend-login-page`. You can create a branch using the command `git checkout -b [BRANCH_NAME]`

### 2. Write Code

Make sure to commit frequently (at least every few hours).

### 3. Clean Up + Test

Once you are finished, take some time to clean up your code and make sure to test your changes thoroughly. This will help us keep our code base clean and avoid any unexpected bugs.

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



# Style Guide

Code style is enforced as part of our CI/CD pipelines and all code must adhere to the proper style prior to it being able to merge.

### Frontend

Our frontend code is *automatically* formatted using [Prettier](https://prettier.io/). Some (not all) of Prettier's styling decisions are explained [here](https://prettier.io/docs/en/rationale.html).

### Backend

Our backend code is *automatically* formatted using [Black](https://github.com/psf/black). For style-specific information, please see [Black's style guide](https://github.com/psf/black/blob/master/docs/the_black_code_style.md).