#!/bin/bash

# Set the source directory and S3 bucket name
source "$(dirname "$(realpath "$0")")/../.env"
BACKUP_FILENAME="cbr_backup_zip_$(date +%Y%m%d_%H%M%S).tar.gz"

tar -czvf "$BACKUP_FILENAME" -C "$SOURCE_DIR" .

aws s3 cp "$BACKUP_FILENAME" "s3://$S3_BUCKET_NAME/monthly/"

rm "$BACKUP_FILENAME"