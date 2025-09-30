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
    def label(r):
        parts = []
        if "gender" in group_by and r.get("gender"):
            parts.append(r["gender"].capitalize())
        if "host_status" in group_by and r.get("host_status"):
            parts.append(r["host_status"].lower())
        if "age_band" in group_by and r.get("age_band"):
            parts.append(f"Age {r['age_band']}")
        return " ".join(parts) if parts else "Total"

    if categorize_by:
        by_cat = {}
        for r in rows:
            cat = r["category"]
            by_cat.setdefault(cat, []).append({"name": label(r), "value": r["value"]})
        return [
            {"name": str(cat), "data": sorted(v, key=lambda x: x["name"])}
            for cat, v in by_cat.items()
        ]
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
    where_sql = whereStatsBuilder(user_id, "d.created_at", from_time, to_time)
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


def getNewClients(user_id, from_time, to_time, is_active):
    sql = (
        "SELECT c.zone_id, c.hcr_type, COUNT(*) AS total\n" "FROM cbr_api_client AS c\n"
    )
    statsRes = whereStatsBuilder(user_id, "c.created_at", from_time, to_time)

    if is_active:
        if statsRes:
            statsRes += " AND c.is_active = True"
        else:
            statsRes = "WHERE c.is_active = True"

    sql += statsRes
    sql += "\nGROUP BY c.zone_id, c.hcr_type"

    with connection.cursor() as cursor:
        cursor.execute(sql)
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


def getFollowUpVisits(user_id, from_time, to_time, is_active):
    from_join = (
        "FROM cbr_api_client AS c " "JOIN cbr_api_visit AS v ON c.id = v.client_id_id"
    )
    if is_active:
        from_join += " AND c.is_active = True"

    sql = "SELECT c.zone_id, c.hcr_type, COUNT(*) AS total\n" + from_join
    sql += whereStatsBuilder(user_id, "c.created_at", from_time, to_time)
    sql += "\nGROUP BY c.zone_id, c.hcr_type HAVING COUNT(v.client_id_id) > 1"

    with connection.cursor() as cursor:
        cursor.execute(sql)
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


def getDischargedClients(user_id, from_time, to_time, is_active):
    sql = """
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
    SELECT 
        c.zone_id,
        c.hcr_type,
        COUNT(*) AS total
    FROM cbr_api_client AS c
    JOIN discharged_clients d ON c.id = d.client_id_id
    """
    statsRes = whereStatsBuilder(user_id, "c.created_at", from_time, to_time)

    if is_active:
        if statsRes:
            statsRes += " AND c.is_active = True"
        else:
            statsRes = "WHERE c.is_active = True"

    sql += "\n" + statsRes
    sql += "\nGROUP BY c.zone_id, c.hcr_type"

    with connection.cursor() as cursor:
        cursor.execute(sql)
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


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
    categorize_by=None,  # e.g. "zone" (0–1 field) or None
    group_by=None,  # e.g. ["gender","host_status","age_band"] (0..N)
    demographics=None,  # "child" | "adult" | None
    selected_age_bands=None,  # e.g. {"0-5","6-10"} (overrides demographics if provided)
):
    """
    Build a dynamic SELECT ... FROM ... for stats, returning:
      select_from_sql:  'SELECT ... FROM ...' (no WHERE, no GROUP BY)
      group_keys:       list of SQL expressions to put in GROUP BY
      age_filter_sql:   optional ' AND (... OR ...)' to append inside your WHERE when
                        demographics/selected_age_bands should *filter* the rows.
    """
    group_by = group_by or []

    # Map logical names to SQL columns (adjust to your exact schema)
    colmap = {
        "zone": "c.zone_id",  # or a name column if you join on zones
        "gender": "c.gender",
        "host_status": "c.hcr_type",  # host/refugee field in your schema
    }

    # ---- Which age bands are active? (for grouping and/or filtering) ----
    if selected_age_bands:
        active_bands = set(selected_age_bands)
    elif demographics == "child":
        active_bands = set(CHILD_BANDS)
    elif demographics == "adult":
        active_bands = set(ADULT_BANDS)
    else:
        # all bands available; if not grouping by age we won't SELECT a band column
        active_bands = {name for name, _ in AGE_BANDS}

    include_age_band_col = (
        ("age_band" in group_by)
        or (demographics in {"child", "adult"})
        or (selected_age_bands is not None)
    )

    # ---- SELECT pieces & GROUP BY keys ----
    select_fields = []
    group_keys = []

    if categorize_by:
        if categorize_by not in colmap:
            raise ValueError(f"Unsupported categorize_by: {categorize_by}")
        select_fields.append(f"{colmap[categorize_by]} AS category")
        group_keys.append(colmap[categorize_by])

    if include_age_band_col:
        select_fields.append(f"{_age_band_case(active_bands)} AS age_band")
        group_keys.append("age_band")

    for g in group_by:
        if g == "age_band":
            continue  # handled above
        if g not in colmap:
            raise ValueError(f"Unsupported group_by: {g}")
        select_fields.append(f"{colmap[g]} AS {g}")
        group_keys.append(colmap[g])

    # COUNT(*) aggregate
    if select_fields:
        sql = "SELECT " + ", ".join(select_fields) + ", COUNT(*) AS value\n"
    else:
        sql = "SELECT COUNT(*) AS value\n"

    # FROM / JOIN identical to the old builder
    sql += _from_join_block(option, is_active)

    # ---- If demographics/selected_age_bands are used *as a filter*, return a WHERE snippet ----
    # inside demographicStatsBuilder
    age_filter_clause = ""
    if demographics or selected_age_bands:
        clauses = []
        for name, (lo, hi) in AGE_BANDS:
            if name in active_bands:
                clauses.append(f"({AGE_EXPR} BETWEEN {lo} AND {hi})")
        if clauses:
            age_filter_clause = "(" + " OR ".join(clauses) + ")"

    return sql, group_keys, age_filter_clause
