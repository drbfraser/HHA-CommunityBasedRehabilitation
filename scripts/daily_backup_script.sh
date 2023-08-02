#!/bin/bash

# Set the source directory and S3 bucket name
source "$(dirname "$(realpath "$0")")/../.env"
BACKUP_FILENAME="cbr_backup_zip_$(date +%Y%m%d_%H%M%S).tar.gz"

cp "$(dirname "$(realpath "$0")")/../.env" "${S3_BACKUP_SOURCE_DIR}"

tar -czvf "$BACKUP_FILENAME" -C "$S3_BACKUP_SOURCE_DIR" .

aws s3 cp "$BACKUP_FILENAME" "s3://$S3_BUCKET_NAME/daily/"

rm "$BACKUP_FILENAME"


