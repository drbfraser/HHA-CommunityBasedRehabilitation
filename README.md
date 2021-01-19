# CMPT 373

## Development Setup

### 1. Install Required Programs

You'll need to install Docker and NodeJS + NPM.

Follow this guide to install Docker: https://docs.docker.com/get-docker/
  - If on Windows 10 Home, follow this guide: https://docs.docker.com/docker-for-windows/install-windows-home/

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

---

## Running Locally

### 1. Start Docker Containers

In the project directory, run `docker-compose up`.

If dependencies have been added since you last ran the project, you may need to run `docker-compose build` first.

If database models have changed since you last ran the project, you may need to run `docker exec cbr_django python manage.py migrate` once Django is running.

### 2. Start NPM Development Server

In the `client` directory, run `npm start`.

If dependencies have been added since you last ran the project, you may need to run `npm install` first.

### 3. Start Developing!

That's it! The frontend is now running on http://localhost:3000 and the backend is running on http://localhost:8000. Both the frontend and the backend should support hot reloading.