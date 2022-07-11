# Deployment to Dev and Staging servers

Deployments are done automatically using GitLab Runner and Docker. The following steps were taken to set up each deployment environment (assuming a wiped VM / VPS).

## Install Docker

<!--  TODO: UPDATE Need newer version of docker?-->

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

sudo apt-get -y install docker-ce docker-ce-cli containerd.io

sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
```

## Install GitLab Runner

```
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash

export GITLAB_RUNNER_DISABLE_SKEL=true; sudo -E apt-get -y install gitlab-runner

sudo usermod -aG docker gitlab-runner
```

## Register a Deployment Runner

1. SSH into the target machine
2. Run `sudo gitlab-runner register`
3. Provide the GitLab instance URL and registration token (can be found in GitLab Repo -> Settings -> CI/CD -> Runners)
4. Provide a description (human readable, not used by the deployment process)
5. Provide a tag, e.g. `deployment-production`, corresponding to the tag used in the `.gitlab-ci.yml` file
6. Select `shell` as the executor

## Environment Variables

Set the environment variables for the deployment by creating a `/var/cbr/.env` file with the following contents:

```env
DOMAIN=[the domain that will be used for this deployment]
SECRET_KEY=[a secure, long secret key]
POSTGRES_USER=[a username]
POSTGRES_PASSWORD=[a secure, long password]
```

## Done!

Now just trigger the deployment by merging to the appropriate branch in GitLab.


# Deployment to Production Server

To deploy to a new production server:  
   `scripts/setup_production.sh`

To update an existing production server:  
   `scripts/update.sh`
