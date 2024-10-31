import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import pandas as pd

OUTPUT_DIR = f"{os.path.dirname(__file__)}/csv"
RAW_OUTPUT_DIR = f"{OUTPUT_DIR}/raw"
CLEANED_OUTPUT_DIR = f"{OUTPUT_DIR}/cleaned"


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
        os.makedirs(RAW_OUTPUT_DIR, exist_ok=True)

        for table_name in ["cbr_api_clientrisk", "cbr_api_improvement", "cbr_api_outcome"]:
            print(f"Outputting CSV file for: {table_name}")
            command = [
                "docker", "exec", "cbr_postgres",
                "psql", "-U", POSTGRES_USER, "-d", DB_NAME,
                "-c", f"\copy {table_name} TO STDOUT WITH (FORMAT csv, HEADER)"
            ]

            output_path = os.path.join(RAW_OUTPUT_DIR, f"raw_{table_name}.csv")
            with open(output_path, 'w') as output_file:
                subprocess.run(command, stdout=output_file, check=True)

    load_environment_vars()
    output_db_tables_as_csv()
    print("CSV files have been successfully created.")


def cleanup_csv_files():
    REMOVED_COLUMNS = ["id", "client_id_id", "visit_id_id",
                       "created_at", "server_created_at", "timestamp"]
    os.makedirs(CLEANED_OUTPUT_DIR, exist_ok=True)

    for file in Path(RAW_OUTPUT_DIR).glob("*.csv"):
        df = pd.read_csv(file)
        df = df.drop(REMOVED_COLUMNS, axis=1, errors="ignore")
        df.to_csv(f"{CLEANED_OUTPUT_DIR}/cleaned_{file.name}")


def get_counts():
    # Column names
    RISK_TYPE = "risk_type"
    REQUIREMENT = "requirement"
    GOAL = "goal"
    COUNT = "count"
    PROVIDED = "provided"
    DESC = "desc"
    GOAL_MET = "goal_met"
    OUTCOME = "outcome"

    def process_data(df: pd.DataFrame, group_by: list[str], sort_by: list[str]):
        df = df.groupby(group_by).size().reset_index(name=COUNT)
        df = df.sort_values(by=[*sort_by, COUNT], ascending=False)
        df = df.reset_index(drop=True)
        return df

    for file in Path(CLEANED_OUTPUT_DIR).glob("*.csv"):
        print(file.name)
        df = pd.read_csv(file)
        if ("clientrisk" in file.name):
            requirement_df = process_data(
                df.copy(), group_by=[RISK_TYPE, REQUIREMENT], sort_by=[RISK_TYPE])
            # print(requirement_df)

            # print("--------------------------------------------------------")

            goal_df = process_data(
                df.copy(), group_by=[RISK_TYPE, GOAL], sort_by=[RISK_TYPE])
            # print(goal_df)
            return
        elif ("improvement" in file.name):
            df = process_data(
                df, group_by=[RISK_TYPE, PROVIDED, DESC], sort_by=[RISK_TYPE, PROVIDED])
            # print(df)
        elif ("outcome" in file.name):
            df = process_data(
                df, group_by=[RISK_TYPE, GOAL_MET, OUTCOME], sort_by=[RISK_TYPE, GOAL_MET])
            # print(df)
        else:
            print(f"Error: unrecognized file name: {file.name}")
            return

        print(df)

        # df.to_csv(f"{OUTPUT_DIR}/cleaned_{file.name}")


if __name__ == '__main__':
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    generate_csv_files()
    cleanup_csv_files()
    get_counts()
