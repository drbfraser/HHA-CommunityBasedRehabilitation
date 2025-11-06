# Scripts for Deployment to Production

## Release Process

To release code to the staging server, or mark ready for production, do the following:

1. Delete the protected branch you would like the code to appear on (either `staging` or `production`)
    * In GitHub, goto Branches (`/branches`)
    * Ensure the branch you are going to delete is not ahead of `main`. If it is, it means there are commits to this branch which have not been merged to `main` and should be considered before proceeding.
    * Click the delete button beside the branch and complete the confirmation screen

2. Re-create the protected branch you just deleted
    * In GitHub, goto Branches (`/branches`)
    * Click "New Branch" button
    * Enter name and source branch for recreated branch:
        * If `staging`, set the branch source to `main`
        * If `production`, set the branch source to `staging`
    * When the branch is recreated, GitHub will remember its protected status from before.

3. Tag the current commit on production so that it is easy to return to later.  
   `git tag -a v1.04 -m "some description here...."`

This will put the current version of the code from the source branch into the protected `staging` or `production` branch without creating a new commit. This is important because the deployment process depends on a docker image for a commit being built just once (when merged to `main`). And commits to either the `staging` or `production` branches will break the deployment process.

## Docker Image Tags on Docker Hub

Development, staging, and deployment servers will run docker images pulled from Docker Hub. Images are tagged as follows:

* Each build on `main` is tagged with something like `v2022-05-22.acbd1234`
* The build of the latest code on `main` is additionally tagged with `:dev`
* The build of the latest code on `staging` is additionally tagged with `:staging`
* The build of the latest code on `production` is additionally tagged with `:prod`

### Docker Hub Tag Details

When code is merged to the `main` branch, the CI/CD pipeline automatically builds each part of the application and then generates the frontend (and caddy reverse-proxy) docker image, and the backend docker image. These are tagged with both the commit date/SHA (such as `v2022-12-31.abcd5678`), plus the tag `dev` and pushed to Docker Hub. An image is then deployed to the dev-server for testing.

When code makes it to the `staging` branch, its docker image (previously built when that commit was merged to `main`) is given an additional tag on Docker Hub of `staging`. This tag is applied to the most recent docker image that has been put onto the `staging` branch. Plus, the staging deployment server updates to this new version for testing.

When code makes it to the `production` branch, its docker image (previously built when merged to `main`) is given an additional tag on Docker Hub of `prod`. This tag is applied to the most recent docker image that has been put onto the `production` branch. The administrator of the production server must then run the `/root/update.sh` script to update to the latest version on the `production` branch. Note that this update script actually pulls a specific version of the Docker image from Docker Hub, instead of using the `prod` tag. It knows which specific version to pull based on the latest commit in the `production` branch of the code which has been cloned onto the production server, likely through GitHub.

Note that the code in GitHub.sfu.ca (private repo) is continually mirrored to the publicly accessible GitHub repo.

## Initial Deployment to VPS

1. Create new Virtual Private Server (VPS) on a hosting service such as Vultr. Possible details:
    - Name:     `hha-cbr-prod - Since <date>`
    - Location: London
    - HW:       Shared CPU: 1 vCPU, 1024MB, 25GB NVMe  
                "vhf-1c-1gb" (as of Oct 2025, $6/month)
    - Automatic Backups: Disabled
    - OS:       Ubuntu 22.04 (64-bit)

2. Create new Block Storage
    - Label:    `Block Storage for CBR Prod (<date>)`
    - Location: London
    - Size:     30GB
    - Type:     NVMe
    - Attach to VPS:  /mnt/blockstorage/

    Prepare block storage for use:  
    Create new empty partitions & file system  
    ```bash
    parted -s /dev/vdb mklabel gpt
    parted -s /dev/vdb unit mib mkpart primary 0% 100%
    mkfs.ext4 /dev/vdb1
    ```  
    Mount block storage:  
    ```bash
    mkdir /mnt/blockstorage
    echo >> /etc/fstab
    echo UUID=$(blkid -s UUID -o value /dev/vdb1)               /mnt/blockstorage       ext4    defaults,noatime,nofail 0 0 >> /etc/fstab
    mount /mnt/blockstorage
    ```

3. Install Server
    *  On a fresh Ubuntu 22.04 server, log in as `root` and create the file `/root/setup_production.sh` and copy into it the contents of the `setup_production.sh` file from this repo. Suggested commands:  
        ```bash
        ssh root@<ip-address>
        # Password found on VPS overview page on host provider site.
        nano /root/setup_production.sh
        ```
    * Run the script  
    `cd /root/`  
    `chmod +x ./setup_production.sh`  
    `./setup_production.sh`
        * Enter path for block storage; likely `/mnt/blockstorage`
        * Enter URL for this server (press ENTER if just using locally).
        * Enter name of S3 bucket on AWS and enter IAM user credentials
        * Script will randomly create some passwords.
        * Script will allow you to edit the `.env` file to configure server.
        * Script will link the `update.sh` script into the `/root/` folder for future updates.
        * Seed DB: if restoring from backup then choose option 0 (No data seeding); if not restoring then select 1 to seed with new admin.

4. Restore from S3 Backup
    * Run `~/restore_volume_from_s3.sh`.
        * Likely select folder "hourly" and enter the most recent file name (has no spaces) that is a reasonable size. Small files likely come from non-production server.
    * Follow directions at end of script to restore data.
    * AWS configuration:
        * Change user configuration: `aws configure`
        * View current user: `aws sts get-caller-identity`
    * Stop all backups: `crontab` and then press CTRL+D

5. Enable logging to AWS

6. Configure DNS redirect
    * Setup custom record for DNS host (such as `squarespace.com`) to create a type A redirect to IP address of VPS.
    * If desired, can setup a type CNAME redirect on the subdomain of choice to another subdomain if delegating server initial configuration. Should later be changed to direct type A redirect to the IP address of VPS.
    * Recommend using shortest TTL for initial setup so can quickly update.
    * View DNS info (in Linux):   
      ```
      sudo apt install dnsutils
      dig cbr.somedomain.com
      ```

## Update Server to New Version

Before updating, you should take a snapshot of the VPS so you can quickly roll-back to the previous running state if the upgrade fails.

To update a running server, log in via SSH as `root` and execute the `/root/update.sh` script. This script will:

* Update/upgrade OS packages
* Git-Pull the latest code, and checkout the `production` branch.
* Pull the docker images from DockerHub related to the current git-commit on the `production` branch.
* Run all necessary database migrations.
