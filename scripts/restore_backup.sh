#!/bin/bash

# Variables
source .env

# List objects in the S3 bucket and find the most recent backup
LATEST_BACKUP=$(aws s3 ls "s3://$AWS_BUCKET_NAME/" | grep '.tar.gz' | sort -r | head -n>

aws s3 cp "s3://$AWS_BUCKET_NAME/$LATEST_BACKUP" "$BACKUP_DIR/"

tar -xzvf "$BACKUP_DIR/$LATEST_BACKUP" -C "$BACKUP_DIR/"

#rm "$BACKUP_DIR/$LATEST_BACKUP"