from django.db import connection
import logging

logger = logging.getLogger(__name__)

AGE_BANDS = [
    ("0-5", (0, 5)),
    ("6-10", (6, 10)),
    ("11-17", (11, 17)),
    ("18-25", (18, 25)),
    ("26-30", (26, 30)),
    ("31-45", (31, 45)),
    ("46+", (46, 200)),
]

CHILD_BANDS = {"0-5", "6-10", "11-17"}
ADULT_BANDS = {"18-25", "26-30", "31-45", "46+"}

AGE_EXPR = "EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000)))"


def _age_band_case(selected_bands):
    parts = []
    for name, (lo, hi) in AGE_BANDS:
        if name in selected_bands:
            parts.append(f"WHEN {AGE_EXPR} BETWEEN {lo} AND {hi} THEN '{name}'")
    # If nothing matches we return NULL; query will filter those out
    return "CASE " + " ".join(parts) + " ELSE NULL END"


def _format_rows_for_frontend(rows, categorize_by, group_by):
    GENDER_LABEL = {"M": "Male", "F": "Female"}
    HCR_LABEL = {"HC": "host", "R": "refugee", "NA": "not set"}

    def label(r):
        parts = []
        if "gender" in group_by and r.get("gender") is not None:
            parts.append(GENDER_LABEL.get(r["gender"], str(r["gender"])))
        if "host_status" in group_by and r.get("host_status") is not None:
            parts.append(HCR_LABEL.get(r["host_status"], str(r["host_status"])).lower())
        if "age_band" in group_by and r.get("age_band"):
            parts.append(f"Age {r['age_band']}")
        if "resolved" in group_by and r.get("resolved") is not None:
            parts.append("Resolved" if bool(r["resolved"]) else "Unresolved")
        return " ".join(parts) if parts else "Total"

    if categorize_by:
        by_cat = {}
        for r in rows:
            cat = r["category"]
            by_cat.setdefault(cat, []).append({"name": label(r), "value": r["value"]})
        result = []
        for cat, v in by_cat.items():
            display = str(cat)
            if categorize_by == "resolved":
                display = "Resolved" if bool(cat) else "Unresolved"
            result.append({"name": display, "data": sorted(v, key=lambda x: x["name"])})
        return result
    else:
        payload = [{"name": label(r), "value": r["value"]} for r in rows]
        return sorted(payload, key=lambda x: x["name"])


def getOutstandingReferrals():

    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT c.id, c.full_name, r.services_other, r.physiotherapy, r.wheelchair, r.prosthetic, r.orthotic, r.hha_nutrition_and_agriculture_project, r.date_referred, r.mental_health, r.id as referral_id
            FROM cbr_api_referral as r
            INNER JOIN cbr_api_client as c
            ON c.id = r.client_id_id
            WHERE r.resolved=False
        """
        )
        # it seems that '_id' is automatically appended to the end of foreign key column names.
        # So client_id -> client_id_id

        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


def getUnreadAlertListByUserId(user_id):

    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT COUNT(DISTINCT id) as total
            FROM cbr_api_alert
            WHERE %s=ANY(cbr_api_alert.unread_by_users)
        """,
            [user_id],
        )

        columns = [col[0] for col in cursor.description]
        # return results as a dictionary instead of a list of values
        unread_alerts_count = [dict(zip(columns, row)) for row in cursor.fetchall()][0][
            "total"
        ]
        return unread_alerts_count


def getDisabilityStats(
    user_id,
    from_time,
    to_time,
    is_active,
    *,
    categorize_by=None,
    group_by=None,
    demographics=None,
    selected_age_bands=None,
):

    select_from, group_keys, age_clause = demographicStatsBuilder(
        option="disability_stats",
        is_active=is_active,
        categorize_by=categorize_by,
        group_by=group_by or [],
        demographics=demographics,
        selected_age_bands=selected_age_bands,
    )

    sql = select_from
    where_sql = whereStatsBuilder(user_id, "c.created_at", from_time, to_time)
    if age_clause:
        where_sql += (" AND " if where_sql else "WHERE ") + age_clause
    sql += where_sql
    if group_keys:
        sql += "\nGROUP BY " + ", ".join(group_keys)

    with connection.cursor() as cursor:
        cursor.execute(sql)
        cols = [c[0] for c in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]

    return _format_rows_for_frontend(rows, categorize_by, group_by or [])


def getNumClientsWithDisabilities(user_id, from_time, to_time, is_active):
    from_join = (
        "FROM cbr_api_client_disability AS d "
        "JOIN cbr_api_client AS c ON d.client_id = c.id"
    )
    if is_active:
        from_join += " AND c.is_active = True"

    sql = "SELECT COUNT(DISTINCT d.client_id) AS total\n" + from_join
    sql += whereStatsBuilder(user_id, "c.created_at", from_time, to_time)

    with connection.cursor() as cursor:
        cursor.execute(sql)
        return cursor.fetchone()[0]


def getVisitStats(
    user_id,
    from_time,
    to_time,
    is_active,
    *,
    categorize_by=None,
    group_by=None,
    demographics=None,
    selected_age_bands=None,
):

    select_from, group_keys, age_clause = demographicStatsBuilder(
        option="visit_stats",
        is_active=is_active,
        categorize_by=categorize_by,  # e.g. "zone" or None
        group_by=group_by or [],  # e.g. ["gender","host_status","age_band"]
        demographics=demographics,  # "child" | "adult" | None
        selected_age_bands=selected_age_bands,  # optional set like {"0-5","6-10"}
    )

    sql = select_from
    where_sql = whereStatsBuilder(user_id, "v.created_at", from_time, to_time)
    if age_clause:
        where_sql += (" AND " if where_sql else "WHERE ") + age_clause
    sql += where_sql
    if group_keys:
        sql += "\nGROUP BY " + ", ".join(group_keys)

    with connection.cursor() as cursor:
        cursor.execute(sql)
        cols = [c[0] for c in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]

    return _format_rows_for_frontend(rows, categorize_by, group_by or [])


def getReferralStats(
    user_id,
    from_time,
    to_time,
    is_active,
    *,
    categorize_by=None,
    group_by=None,
    demographics=None,
    selected_age_bands=None,
    resolved=None,
):
    select_from, group_keys, age_clause = demographicStatsBuilder(
        option="referral_stats",
        is_active=is_active,
        categorize_by=categorize_by,
        group_by=group_by or [],
        demographics=demographics,
        selected_age_bands=selected_age_bands,
    )

    where_sql = whereStatsBuilder(user_id, "r.date_referred", from_time, to_time)
    if resolved is not None:
        where_sql += (" AND " if where_sql else "WHERE ") + (
            "r.resolved = TRUE" if resolved else "r.resolved = FALSE"
        )
    if age_clause:
        where_sql += (" AND " if where_sql else "WHERE ") + age_clause

    sql = select_from + where_sql
    if group_keys:
        sql += "\nGROUP BY " + ", ".join(group_keys)

    with connection.cursor() as cursor:
        cursor.execute(sql)
        cols = [c[0] for c in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]

    return _format_rows_for_frontend(rows, categorize_by, group_by or [])


def getNewClients(
    user_id,
    from_time,
    to_time,
    is_active,
    *,
    categorize_by=None,
    group_by=None,
    demographics=None,
    selected_age_bands=None,
):
    select_from, group_keys, age_clause = demographicStatsBuilder(
        option="new_clients",
        is_active=is_active,
        categorize_by=categorize_by,
        group_by=group_by or [],
        demographics=demographics,
        selected_age_bands=selected_age_bands,
    )

    sql = select_from
    where_sql = whereStatsBuilder(user_id, "c.created_at", from_time, to_time)
    if age_clause:
        where_sql += (" AND " if where_sql else "WHERE ") + age_clause
    sql += where_sql
    if group_keys:
        sql += "\nGROUP BY " + ", ".join(group_keys)

    with connection.cursor() as cursor:
        cursor.execute(sql)
        cols = [c[0] for c in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]

    return _format_rows_for_frontend(rows, categorize_by, group_by or [])


def getFollowUpVisits(
    user_id,
    from_time,
    to_time,
    is_active,
    *,
    categorize_by=None,
    group_by=None,
    demographics=None,
    selected_age_bands=None,
):
    select_from, group_keys, age_clause = demographicStatsBuilder(
        option="follow_up",
        is_active=is_active,
        categorize_by=categorize_by,
        group_by=group_by or [],
        demographics=demographics,
        selected_age_bands=selected_age_bands,
    )

    sql = select_from
    where_sql = whereStatsBuilder(user_id, "c.created_at", from_time, to_time)
    if age_clause:
        where_sql += (" AND " if where_sql else "WHERE ") + age_clause
    sql += where_sql
    if group_keys:
        sql += "\nGROUP BY " + ", ".join(group_keys)
        sql += " HAVING COUNT(v.client_id_id) > 1"

    with connection.cursor() as cursor:
        cursor.execute(sql)
        cols = [c[0] for c in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]

    return _format_rows_for_frontend(rows, categorize_by, group_by or [])


def getDischargedClients(
    user_id,
    from_time,
    to_time,
    is_active,
    *,
    categorize_by=None,
    group_by=None,
    demographics=None,
    selected_age_bands=None,
):
    cte = """
    WITH latest_risks AS (
        SELECT DISTINCT ON (client_id_id, risk_type)
            client_id_id,
            goal_status
        FROM cbr_api_clientrisk
        ORDER BY client_id_id, risk_type, timestamp DESC
    ),
    discharged_clients AS (
        SELECT client_id_id
        FROM latest_risks
        GROUP BY client_id_id
        HAVING 
            BOOL_OR(goal_status IN ('CON', 'CAN')) AND
            NOT BOOL_OR(goal_status = 'GO')
    )
    """

    select_from, group_keys, age_clause = demographicStatsBuilder(
        option="new_clients",
        is_active=is_active,
        categorize_by=categorize_by,
        group_by=group_by or [],
        demographics=demographics,
        selected_age_bands=selected_age_bands,
    )

    sql = cte + select_from + " JOIN discharged_clients d ON c.id = d.client_id_id"

    where_sql = whereStatsBuilder(user_id, "c.created_at", from_time, to_time)
    if age_clause:
        where_sql += (" AND " if where_sql else "WHERE ") + age_clause
    sql += where_sql
    if group_keys:
        sql += "\nGROUP BY " + ", ".join(group_keys)

    with connection.cursor() as cursor:
        cursor.execute(sql)
        cols = [c[0] for c in cursor.description]
        rows = [dict(zip(cols, r)) for r in cursor.fetchall()]

    return _format_rows_for_frontend(rows, categorize_by, group_by or [])


def whereStatsBuilder(user_id, time_col, from_time, to_time):
    where = """
    WHERE """
    args = 0

    if user_id is not None:
        where += f"""c.user_id_id='{user_id}'"""
        args += 1

    if from_time is not None:
        if args >= 1:
            where += """ AND """
        where += f"""{time_col}>={str(from_time)}"""
        args += 1

    if to_time is not None:
        if args >= 1:
            where += """ AND """
        where += f"""{time_col}<={str(to_time)}"""
        args += 1

    if args == 0:
        return ""

    return where


def _from_join_block(option, is_active):
    if option == "follow_up":
        if is_active:
            return "FROM cbr_api_client AS c JOIN cbr_api_visit AS v ON c.id = v.client_id_id AND c.is_active = True"
        return (
            "FROM cbr_api_client AS c JOIN cbr_api_visit AS v ON c.id = v.client_id_id"
        )

    if option == "new_clients":
        return "FROM cbr_api_client AS c"

    if option == "referral_stats":
        base = "FROM cbr_api_referral AS r "
        if is_active:
            return (
                base
                + "JOIN cbr_api_client AS c ON r.client_id_id = c.id AND c.is_active = True"
            )
        return base + "JOIN cbr_api_client AS c ON r.client_id_id = c.id"

    if option == "visit_stats":
        if is_active:
            return "FROM cbr_api_visit AS v JOIN cbr_api_client AS c ON v.client_id_id = c.id and c.is_active = True"
        return (
            "FROM cbr_api_visit AS v JOIN cbr_api_client AS c ON v.client_id_id = c.id"
        )

    if option == "disability_stats" or option == "clients_with_disabilities":
        base = "FROM cbr_api_client_disability AS d JOIN cbr_api_client as c ON d.client_id = c.id"
        if is_active:
            return base + " AND c.is_active = True"
        return base

    raise ValueError(f"Unsupported option: {option}")


def demographicStatsBuilder(
    option,
    is_active,
    *,
    categorize_by=None,
    group_by=None,
    demographics=None,
    selected_age_bands=None,
):
    group_by = group_by or []

    # ---- choose which zone FK to use depending on option ----
    zone_fk = "v.zone_id" if option == "visit_stats" else "c.zone_id"

    # Map logical names to SQL columns (now uses zone NAME)
    colmap = {
        "zone": "z.zone_name",  # <-- use zone name for labels
        "gender": "c.gender",
        "host_status": "c.hcr_type",
    }
    # Allow grouping/categorizing by referral resolution state
    if option == "referral_stats":
        colmap["resolved"] = "r.resolved"

    # Which age bands are active
    if selected_age_bands:
        active_bands = set(selected_age_bands)
    elif demographics == "child":
        active_bands = set(CHILD_BANDS)
    elif demographics == "adult":
        active_bands = set(ADULT_BANDS)
    else:
        active_bands = {name for name, _ in AGE_BANDS}

    # Only include age band column when explicitly grouped by it.
    # Demographics/selected_age_bands now act as FILTER-ONLY (see age_filter_clause below).
    include_age_band_col = ("age_band" in group_by)

    # SELECT fields & GROUP BY keys
    select_fields, group_keys = [], []
    needs_zone_join = False

    if categorize_by:
        if categorize_by not in colmap:
            raise ValueError(f"Unsupported categorize_by: {categorize_by}")
        if categorize_by == "zone":
            needs_zone_join = True
        select_fields.append(f"{colmap[categorize_by]} AS category")
        group_keys.append(colmap[categorize_by])

    if include_age_band_col:
        select_fields.append(f"{_age_band_case(active_bands)} AS age_band")
        group_keys.append("age_band")

    for g in group_by:
        if g == "age_band":
            continue
        if g not in colmap:
            raise ValueError(f"Unsupported group_by: {g}")
        if g == "zone":
            needs_zone_join = True
        select_fields.append(f"{colmap[g]} AS {g}")
        group_keys.append(colmap[g])

    sql = (
        ("SELECT " + ", ".join(select_fields) + ", COUNT(*) AS value\n")
        if select_fields
        else "SELECT COUNT(*) AS value\n"
    )
    sql += _from_join_block(option, is_active)

    # ---- join Zone only if needed ----
    if needs_zone_join:
        sql += f" JOIN cbr_api_zone AS z ON z.id = {zone_fk}"

    # Return a bare age clause (no WHERE/AND prefix)
    age_filter_clause = ""
    if demographics or selected_age_bands:
        clauses = [
            f"({AGE_EXPR} BETWEEN {lo} AND {hi})"
            for name, (lo, hi) in AGE_BANDS
            if name in active_bands
        ]
        if clauses:
            age_filter_clause = "(" + " OR ".join(clauses) + ")"

    return sql, group_keys, age_filter_clause
