#!/bin/bash

restore_backup() {
  # Get the list of available backups from the S3 bucket
  backups=$(aws s3 ls "s3://$S3_BUCKET_NAME/$FOLDER/")

  if [ -z "$backups" ]; then
    echo "No backups found"
    return
  fi

  # Ask the user to select a backup to restore
  echo "Available backups:"
  echo "$backups"
  read -p "Enter the name of the backup you want to restore: " selected_backup

  aws s3 cp "s3://$S3_BUCKET_NAME/$FOLDER/$selected_backup" .

  # Unzip the backup
  tar -xzvf "$selected_backup"

  rm "$selected_backup"

  echo "\nBackup successfully downloaded (_data) and is in root directory. Move the _data directory to this location ${SOURCES_DIR}\n"
}

# Main script starts here

# Set the S3 bucket name
source ../.env

# Ask the user to choose hourly or daily backup
echo "Choose a backup type:"
echo "1. Hourly Backup"
echo "2. Daily Backup"
read -p "Enter your choice (1, 2 or 3): " choice

case $choice in
  1)
    FOLDER="hourly"
    ;;
  2)
    FOLDER="daily"
    ;;
  3)
    FOLDER="monthly"
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

restore_backup