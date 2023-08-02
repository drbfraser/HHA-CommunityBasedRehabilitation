#!/bin/bash
# This script can be run on a fresh VM to install and run the project on a production server

RED='\033[1;31m'
BLUE='\033[1;36m'
COLOR_OFF='\033[0m'

# exit if there is a failed command
set -e

echo -e "${BLUE}"
echo -e "Hope Health Action - Community Based Rehabilitation: Deployment Script"
echo -e "This script must be run as root or with sudo. It is only supported on Ubuntu Server 22.04."
echo -e "It installs the config and deployment files in /root/cbr/"
echo -e "${COLOR_OFF}${RED}"
echo -e "WARNING: If run on an existing server instance, this will likely delete data."
read -p "Continue (y/n)? " CONT
echo -e "${COLOR_OFF}"

if [ "$CONT" != "y" ]; then
    exit 0
fi


echo -e "\n${BLUE}Updating and upgrading currently installed packages...${COLOR_OFF}\n"

apt update -y
apt upgrade -y

if [ -f /var/run/reboot-required ] 
then
    echo -e "\n${BLUE}Linux requires a reboot to complete install/upgrade tasts..${COLOR_OFF}"
    echo -e "${BLUE}Please reboot ('sudo reboot') and then re-run this script to continue installation.${COLOR_OFF}"
    exit 1
fi

echo -e "\n${BLUE}Installing needed utils...${COLOR_OFF}\n"

# Docker Engine: https://docs.docker.com/engine/install/ubuntu/
sudo apt-get -y install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git

echo -e ${BLUE}
read -p "Please enter the absolute path to the block storage: (/path/to/block/storage) " BLOCK_STORAGE_DIR
echo -e ${COLOR_OFF}

echo -e "\n${BLUE}The block storge path is: ${BLOCK_STORAGE_DIR}${COLOR_OFF}\n"


echo -e "\n${BLUE}Installing docker and docker compose...${COLOR_OFF}\n"

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get -y install docker-ce docker-ce-cli containerd.io docker-compose-plugin
 

echo -e "\n${BLUE}Configuring docker security with user namespaces...${COLOR_OFF}\n"

# User namespaces (security): https://docs.docker.com/engine/security/userns-remap/
echo '{
  "userns-remap": "default",
  "data-root": "'"${BLOCK_STORAGE_DIR}"'"
}' | sudo tee /etc/docker/daemon.json > /dev/null
sudo chmod 0644 /etc/docker/daemon.json
sudo systemctl restart docker



echo -e "\n${BLUE}Starting the Docker service and setting Docker to automatically start at boot${COLOR_OFF}\n"

systemctl start docker
systemctl enable docker

if [ ! -f ~/.ssh/id_ed25519.pub ]; then
    echo -e "\n${BLUE}Generating SSH key...${COLOR_OFF}\n"
    ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -q -N ""
fi


echo -e "\n${BLUE}Clone project code from GitHub...${COLOR_OFF}\n"

cd ~
if [ ! -d cbr ]; then
    git clone https://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@github.sfu.ca/bfraser/415-HHA-CBR.git cbr
    # git clone https://github.com/drbfraser/HHA-CommunityBasedRehabilitation.git cbr


fi    
cd ~/cbr/
git pull
#git checkout production
git checkout backup-s3-scripts


echo -e "\n${BLUE}Linking update script into /root/update.sh...${COLOR_OFF}\n"

chmod +X ~/cbr/scripts/update.sh
ln -s -f ~/cbr/scripts/update.sh ~/update.sh


# .env file creation
if [ ! -f .env ]; then
    RAND_PASSWORD=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32)
    RAND_SECRET=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32)

    echo -e "\n${BLUE}Please enter the domain for this server installation (blank to use IP over HTTP only):${COLOR_OFF}"
    read;

    echo "# Configuration generated by install script (`date`)" > .env
    echo "DOMAIN=${REPLY:-:80}" >> .env
    echo "SECRET_KEY=${RAND_SECRET}" >> .env
    echo "POSTGRES_USER=dbuser" >> .env
    echo "POSTGRES_PASSWORD=${RAND_PASSWORD}" >> .env

    # this is necessary because the Postgres DB password has now been changed
    echo -e "\n${BLUE}Removing previous Docker containers and volumes...${COLOR_OFF}\n"
    docker compose -f docker-compose.yml -f docker-compose.deploy.yml down
    docker volume prune -f

    echo -e "\n${BLUE}Enter the name of the S3 bucket you want to sync with:${COLOR_OFF}"
    read;
    echo "S3_BUCKET_NAME=${REPLY}" >> .env

    echo "SOURCE_DIR=${BLOCK_STORAGE_DIR}/165536.165536/volumes/cbr_cbr_postgres_data" >> .env
fi

echo -e "\n${BLUE}Installing AWS CLI...${COLOR_OFF}\n"

sudo apt-get install awscli
aws configure

echo -e "\n${BLUE}Creating backup log files & setting up cron jobs...${COLOR_OFF}\n"

# Create the text files before setting up the cron jobs
touch ~/hourly_backup_log.txt
touch ~/daily_backup_log.txt
touch ~/monthly_backup_log.txt

chmod +x ~/cbr/scripts/hourly_backup_script.sh
chmod +x ~/cbr/scripts/daily_backup_script.sh
chmod +x ~/cbr/scripts/monthly_backup_script.sh
chmod +x ~/cbr/scripts/restore_backup.sh
ln -s -f ~/cbr/scripts/restore_backup.sh ~/restore_backup.sh

# Add cron job for hourly_backup.sh and redirect output to hourly_backup_log.txt
# Add cron job for daily_backup.sh and redirect output to daily_backup_log.txt
crontab - <<EOF
0 * * * * /bin/bash ~/cbr/scripts/hourly_backup_script.sh >> ~/hourly_backup_log.txt 2>&1
0 2 * * * /bin/bash ~/cbr/scripts/daily_backup_script.sh >> ~/daily_backup_log.txt 2>&1
0 0 1 * * /bin/bash ~/cbr/scripts/monthly_backup_script.sh >> ~/monthly_backup_log.txt 2>&1
EOF


echo -e "\n${BLUE}Downloading Docker images and spinning up Docker containers...${COLOR_OFF}\n"

# Version of the form v2022-12-31.abcd5678, based on date and short SHA1 of last commit on branch
export COMMIT_SHA=`git show -s --format=%H`
export IMAGE_TAG=v`git show -s --format=%cs $COMMIT_SHA`.`git rev-parse --short=8 $COMMIT_SHA`
echo "Most recent Git commit SHA:  $COMMIT_SHA"
echo "               Release tag:  $IMAGE_TAG"
docker compose -f docker-compose.yml -f docker-compose.deploy.yml pull
docker compose -f docker-compose.yml -f docker-compose.deploy.yml up -d


echo -e "\n${BLUE}Waiting for database container to start...${COLOR_OFF}"
sleep 10;


echo -e "${BLUE}Upgrading database schema...${COLOR_OFF}\n"
docker exec cbr_django python manage.py migrate

echo -e "\n${BLUE}"
echo -e "Data seeding options:"
echo -e "   0: No data seeding"
echo -e "   1: Seed one admin user"
echo -e "   2: Seed one admin user, defalut zones, and default disabilities (recommended)"
read -p "Enter an option: " OPTION
echo -e "${COLOR_OFF}"

case $OPTION in
    1)

        docker exec cbr_django python ./manage.py seedadminuser
        
        echo -e "\n${RED}** WRITE DOWN AND SAVE THE USERNAME AND PASSWORD ABOVE! **${COLOR_OFF}"
        ;;

    2)

        docker exec cbr_django python ./manage.py seedzones
        docker exec cbr_django python ./manage.py seeddisabilities
        docker exec cbr_django python ./manage.py seedadminuser
        
        echo -e "\n${RED}** WRITE DOWN AND SAVE THE USERNAME AND PASSWORD ABOVE! **${COLOR_OFF}"
        ;;
esac

echo -e "\n${BLUE}Finished${COLOR_OFF}\n"