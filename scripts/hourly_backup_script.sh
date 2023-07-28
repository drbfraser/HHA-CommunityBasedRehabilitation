#!/bin/bash

# Set the source directory and S3 bucket name
source .env
BACKUP_FILENAME="cbr_backup_zip_$(date +%Y%m%d_%H%M%S).tar.gz"

tar -czvf "$BACKUP_FILENAME" -C "$SOURCE_DIR" .

# Set the S3 destination path to a folder named "daily" in the bucket
S3_DESTINATION_PATH="s3://$S3_BUCKET_NAME/hourly/"

aws s3 cp "$BACKUP_FILENAME" "$S3_DESTINATION_PATH"

rm "$BACKUP_FILENAME"