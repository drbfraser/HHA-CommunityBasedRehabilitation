#!/bin/bash
# Backup Postgres DB (from docker volume) to Amazon S3

# What S3 folder should be backup to?
S3_FOLDER=$1
if [ -z "$S3_FOLDER" ]
then
    echo "Error: Missing S3 folder name."
    echo "USAGE:"
    echo "    $0 <S3 folder name>"
    exit 1
fi

# Needed from .env
# POSTGRES_USER
# S3_BUCKET_NAME
source "$(dirname "$(realpath "$0")")/../.env"

# Constants
DB_NAME=cbr
ENV_FILE="$(dirname "$(realpath "$0")")/../.env"
FOLDER="$HOME/db-backup-temp"
BACKUP_FILENAME_BASE="${DB_NAME}_db_backup_$(date +%Y%m%d_%H%M%S)"


echo "Backing-up $DB_NAME database to file $BACKUP_FILENAME_BASE.tar.gz"

mkdir -p $FOLDER

# Create info file
echo "Time: $(date +%Y%m%d_%H%M%S)" >> $FOLDER/info.txt
echo "Host Name: $HOSTNAME"         >> $FOLDER/info.txt
echo ""                             >> $FOLDER/info.txt
echo "docker ps:"                   >> $FOLDER/info.txt
docker ps                           >> $FOLDER/info.txt
echo ""                             >> $FOLDER/info.txt
echo "docker volume ls:"            >> $FOLDER/info.txt
docker volume ls                    >> $FOLDER/info.txt
echo ""                             >> $FOLDER/info.txt
echo "crontab -l:"                  >> $FOLDER/info.txt
crontab -l                          >> $FOLDER/info.txt
echo ""                             >> $FOLDER/info.txt
echo "ip addr:"                     >> $FOLDER/info.txt
ip addr                             >> $FOLDER/info.txt

# Copy .env file
cp $ENV_FILE $FOLDER/backup.env

# Export DB from running DB into SQL file
docker exec cbr_postgres \
   pg_dump $DB_NAME -U $POSTGRES_USER \
   > $FOLDER/$BACKUP_FILENAME_BASE.sql

# Compress files (in sub-shell so we don't encode leading folder names)
(cd "$FOLDER"; tar -czvf "$FOLDER/$BACKUP_FILENAME_BASE.tar.gz" *)

# Upload
aws s3 cp "$FOLDER/$BACKUP_FILENAME_BASE.tar.gz" "s3://$S3_BUCKET_NAME/$S3_FOLDER/"

# Cleanup
rm "$FOLDER/info.txt"
rm "$FOLDER/backup.env"
rm "$FOLDER/$BACKUP_FILENAME_BASE.sql"
rm "$FOLDER/$BACKUP_FILENAME_BASE.tar.gz"
rmdir $FOLDER
