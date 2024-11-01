import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import pandas as pd

OUTPUT_DIR = f"{os.path.dirname(__file__)}/output"
RAW_OUTPUT_DIR = f"{OUTPUT_DIR}/raw"
CLEANED_OUTPUT_DIR = f"{OUTPUT_DIR}/cleaned"
FINAL_OUTPUT_DIR = f"{OUTPUT_DIR}/final"


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

        TABLES = [
            "cbr_api_clientrisk",
            "cbr_api_improvement",
            "cbr_api_outcome",
            "cbr_api_baselinesurvey"
        ]
        for table_name in TABLES:
            print(f"--- outputting CSV file for: {table_name}")
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
    BASELINE_SURVEY_COLS = {"work_what", "empowerment_organization"}
    IMPROVEMENT_COLS = {"risk_type", "provided", "desc"}
    RISK_COLS = {"risk_type", "risk_level", "requirement", "goal"}
    OUTCOME_COLS = {"risk_type", "goal_met", "outcome"}
    RELEVANT_COLUMNS = {
        *BASELINE_SURVEY_COLS,
        *IMPROVEMENT_COLS,
        *RISK_COLS,
        *OUTCOME_COLS,
    }

    os.makedirs(CLEANED_OUTPUT_DIR, exist_ok=True)

    print("Cleaning raw CSV files...")
    for file in Path(RAW_OUTPUT_DIR).glob("*.csv"):
        print(f"--- cleaning: {file.name}")
        df = pd.read_csv(file)
        df = df[df.columns.intersection(RELEVANT_COLUMNS)]
        df.to_csv(f"{CLEANED_OUTPUT_DIR}/cleaned_{file.name}")
    print("Finished cleaning raw CSV files.")


def process_files_into_final_format():
    # Column names
    RISK_TYPE = "risk_type"
    REQUIREMENT = "requirement"
    GOAL = "goal"
    PROVIDED = "provided"
    DESC = "desc"
    GOAL_MET = "goal_met"
    OUTCOME = "outcome"
    JOB = "work_what"
    ORGANIZATION = "empowerment_organization"
    COUNT = "count"

    def process_data(df: pd.DataFrame, group_by: list[str], sort_by: list[str] = []) -> pd.DataFrame:
        df = df.groupby(group_by).size().reset_index(name=COUNT)
        df = df.sort_values(by=[*sort_by, COUNT], ascending=False)
        df = df.reset_index(drop=True)
        return df

    print("Processing CSV files into final output form...")
    os.makedirs(FINAL_OUTPUT_DIR, exist_ok=True)
    for file in Path(CLEANED_OUTPUT_DIR).glob("*.csv"):
        print(f"--- processing: {file.name}")

        df = pd.read_csv(file)
        if ("clientrisk" in file.name):
            requirement_df = process_data(
                df.copy(), group_by=[RISK_TYPE, REQUIREMENT], sort_by=[RISK_TYPE])
            requirement_df.to_csv(f"{FINAL_OUTPUT_DIR}/risk_requirements.csv")

            goal_df = process_data(
                df.copy(), group_by=[RISK_TYPE, GOAL], sort_by=[RISK_TYPE])
            goal_df.to_csv(f"{FINAL_OUTPUT_DIR}/risk_goals.csv")
        elif ("improvement" in file.name):
            df = process_data(
                df, group_by=[RISK_TYPE, PROVIDED, DESC], sort_by=[RISK_TYPE, PROVIDED])
            df.to_csv(f"{FINAL_OUTPUT_DIR}/improvements.csv")
        elif ("outcome" in file.name):
            df = process_data(
                df, group_by=[RISK_TYPE, GOAL_MET, OUTCOME], sort_by=[RISK_TYPE, GOAL_MET])
            df.to_csv(f"{FINAL_OUTPUT_DIR}/outcomes.csv")
        elif ("baselinesurvey" in file.name):
            job_df = process_data(df.copy(), group_by=[JOB])
            job_df.to_csv(f"{FINAL_OUTPUT_DIR}/jobs.csv")

            organization_df = process_data(df.copy(), group_by=[ORGANIZATION])
            organization_df.to_csv(f"{FINAL_OUTPUT_DIR}/organizations.csv")
        else:
            print(f"Error: unrecognized file name: {file.name}")

    print("finished processing CSV files into final output form.")


if __name__ == '__main__':
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    generate_csv_files()
    cleanup_csv_files()
    process_files_into_final_format()
