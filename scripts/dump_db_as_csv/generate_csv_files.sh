#!/bin/bash

# dumps dev database into .csv file for human examination
# IMPORTANT: make sure you are inside scripts/dumb_db_as_csv/ when executing 

# If .env file is missing, then exit
SCRIPT_DIR="$(dirname "$(realpath "$0")")"
if [ ! -f "$SCRIPT_DIR/../../.env" ]; then
    echo "Error: Missing .env file"
    echo "Ensure this script is located in the scripts/ folder of the project."
    exit 1
fi

# Variables that should be in root .env file:
# POSTGRES_USER
source "$SCRIPT_DIR/../../.env"

# constants
DB_NAME=cbr
OUTPUT_DIR="./db_table_csv"
TABLES=(cbr_api_clientrisk cbr_api_improvement cbr_api_outcome)

mkdir $OUTPUT_DIR
for table_name in "${TABLES[@]}"; do
    echo "Outputting csv file for: $table_name"
    docker exec cbr_postgres \
        psql -U $POSTGRES_USER -d $DB_NAME \
        -c "\copy $table_name TO STDOUT WITH (FORMAT csv, HEADER)" \
        > $OUTPUT_DIR/$table_name.csv
done