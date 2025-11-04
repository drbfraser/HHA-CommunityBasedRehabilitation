# Deployment to Dev and Staging servers

Deployments are done automatically using GitHub Actions and Docker. The following steps were taken to set up each deployment environment (assuming a wiped VM / VPS).

## Install Docker

```sh
sudo apt-get update
sudo apt-get -y install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get -y install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

## Install GitHub Runner

Find the directions for installing a runner on a server on the GitHub repo's page, in Settings, under Actions > Runners. SSH into the runner VM and create a new `github-runner` user and grant permission to use docker.

Add a label to the server as needed: `docker` for the CI/CD builds; `deploy-development` for the -dev server, and `deploy-staging` for the -stg server.

If a single VM is running multiple runners, after you run `./configure.sh`, you need to edit `svc.sh` to change the `SVC_NAME="actions.runner._services.cmpt-cicd.<REPONAME>.service"`.

Next log in as `root` user and run `./svc.sh start`.

## Environment Variables

Set the environment variables for the deployment or staging server by creating a `/var/cbr/.env` file with the following contents:

```env
DOMAIN=[the domain that will be used for this deployment]
SECRET_KEY=[a secure, long secret key]
POSTGRES_USER=[a username]
POSTGRES_PASSWORD=[a secure, long password]
```

## Done!

Now just trigger the deployment by merging to the appropriate branch in SFU's GitHub.
