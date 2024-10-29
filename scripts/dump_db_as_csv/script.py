import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import pandas as pd

OUTPUT_DIR = f"{os.path.dirname(__file__)}/csv"


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
    REMOVED_COLUMNS = ["id", "client_id_id", "visit_id_id",
                       "created_at", "server_created_at", "timestamp"]

    for file in Path(OUTPUT_DIR).glob("*.csv"):
        df = pd.read_csv(file)
        df = df.drop(REMOVED_COLUMNS, axis=1, errors="ignore")
        # print(df)

        df.to_csv(f"{OUTPUT_DIR}/cleaned_{file.name}")


def get_counts():
    for file in Path(OUTPUT_DIR).glob("*cleaned_*.csv"):
        df = pd.read_csv(file)

        if ("clientrisk" in file.name):
            print(file.name)
            df = df.groupby(["risk_type", "requirement"])
            df = df.size().reset_index(name="count")
            df = df.sort_values(by="count", ascending=False)
            df = df.reset_index()
            print(df)
            pass
        elif ("improvement" in file.name):
            pass
        elif ("outcome" in file.name):
            pass

        # df.to_csv(f"{OUTPUT_DIR}/cleaned_{file.name}")


if __name__ == '__main__':
    # generate_csv_files()
    # cleanup_csv_files()
    get_counts()
