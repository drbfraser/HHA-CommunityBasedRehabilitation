import os
import subprocess
from dotenv import load_dotenv


def generate_csv_files():
    def load_environment_vars():
        SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
        ENV_FILE = os.path.join(SCRIPT_DIR, "../../.env")
        if not os.path.isfile(ENV_FILE):
            print("Error: Missing .env file")
            exit(1)

        load_dotenv(ENV_FILE)
        if os.getenv("POSTGRES_USER") is None:
            print("Error: POSTGRES_USER variable is missing from .env file.")
            exit(1)

    def output_db_tables_as_csv():
        OUTPUT_DIR = f"{os.path.dirname(__file__)}/db_table_csv"
        POSTGRES_USER = os.getenv("POSTGRES_USER")
        DB_NAME = "cbr"

        os.makedirs(OUTPUT_DIR, exist_ok=True)
        for table_name in ["cbr_api_clientrisk", "cbr_api_improvement", "cbr_api_outcome"]:
            print(f"Outputting CSV file for: {table_name}")
            command = [
                "docker", "exec", "cbr_postgres",
                "psql", "-U", POSTGRES_USER, "-d", DB_NAME,
                "-c", f"\copy {table_name} TO STDOUT WITH (FORMAT csv, HEADER)"
            ]
            with open(os.path.join(OUTPUT_DIR, f"{table_name}.csv"), 'w') as output_file:
                subprocess.run(command, stdout=output_file, check=True)

    load_environment_vars()
    output_db_tables_as_csv()
    print("CSV files have been successfully created.")


def cleanup_csv_files():
    pass


if __name__ == '__main__':
    generate_csv_files()
    cleanup_csv_files()
