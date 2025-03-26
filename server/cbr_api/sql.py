import logging

logger = logging.getLogger(__name__)


def getDisabilityStats(is_active):
    sql = """
    SELECT d.disability_id AS disability_id, c.hcr_type, c.zone_id,"""

    sql += getFilteredStats("disability_stats", "d.")

    if is_active:
        sql += """ 
            WHERE d.client_id = (
                SELECT id 
                FROM cbr_api_client
                WHERE cbr_api_client_disability.client_id = cbr_api_client.id AND 
                cbr_api_client.is_active = True
            ) """

    sql += "GROUP BY d.disability_id, c.hcr_type, c.zone_id ORDER BY d.disability_id"
    print(sql)

    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(sql)

        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


def getNumClientsWithDisabilities(is_active):
    sql = """
        SELECT COUNT(DISTINCT client_id) as total
        FROM cbr_api_client_disability
        """

    if is_active:
        sql += """ 
            WHERE cbr_api_client_disability.client_id = (
                SELECT id 
                FROM cbr_api_client
                WHERE cbr_api_client_disability.client_id = cbr_api_client.id AND 
                cbr_api_client.is_active = True
        )"""
    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(sql)

        return cursor.fetchone()[0]


def getVisitStats(user_id, from_time, to_time):
    column_names = [
        "health_visit",
        "educat_visit",
        "social_visit",
        "nutrit_visit",
        "mental_visit",
    ]

    category_names = ["health", "educat", "social", "nutrit", "mental"]

    sql = """
    SELECT v.zone_id, c.hcr_type,"""
    sql += getFilteredStats(
        "visit_stats",
        from_time,
        to_time,
        "v.",
        column_names=column_names,
        category_names=category_names,
    )
    sql += getStatsWhere(user_id, "created_at", from_time, to_time, "v.")
    sql += """
    GROUP BY v.zone_id, c.hcr_type ORDER BY v.zone_id"""

    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(sql)

        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


def getReferralStats(user_id, from_time, to_time):
    column_names = [
        "wheelchair",
        "physiotherapy",
        "prosthetic",
        "orthotic",
        "hha_nutrition_and_agriculture_project",
        "mental_health",
    ]

    category_names = [
        "wheelchair",
        "physiotherapy",
        "prosthetic",
        "orthotic",
        "nutrition_agriculture",
        "mental_health",
    ]

    sql = """
    SELECT r.resolved, c.zone_id, c.hcr_type,"""

    sql += getFilteredStats(
        "referral_stats",
        from_time,
        to_time,
        "r.",
        column_names=column_names,
        category_names=category_names,
    )
    sql += getStatsWhere(user_id, "r.date_referred", from_time, to_time, "r.")
    sql += "GROUP BY r.resolved, c.zone_id, c.hcr_type ORDER BY r.resolved DESC"

    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(sql)

        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]

        empty_stats = dict(zip(columns, [0] * len(columns)))

        def getOrEmpty(resolved):
            return next((r for r in rows if r["resolved"] == resolved), empty_stats)

        return {"resolved": getOrEmpty(True), "unresolved": getOrEmpty(False)}


def getStatsWhere(user_id, time_col, from_time, to_time, alias):
    where = []

    if user_id is not None:
        # it seems that '_id' is automatically appended to the end of foreign key column names.
        # So user_id -> user_id_id
        where.append(f"{alias}user_id_id='{user_id}'")

    if from_time is not None:
        where.append(f"{time_col}>={str(from_time)}")

    if to_time is not None:
        where.append(f"{time_col}<={str(to_time)}")

    if len(where) == 0:
        return ""

    return "WHERE " + " AND ".join(where)


def getOutstandingReferrals():
    from django.db import connection

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
    from django.db import connection

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


def getNewClients(from_time, to_time):
    from django.db import connection

    sql = """
    SELECT c.zone_id, c.hcr_type,"""
    sql += getFilteredStats("new_clients", from_time, to_time, "c.")

    with connection.cursor() as cursor:
        if from_time is not None and to_time is not None:
            cursor.execute(
                sql,
                [str(from_time), str(to_time)],
            )

        else:
            cursor.execute(sql)

        columns = [col[0] for col in cursor.description]
        res = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return res


def getFollowUpVisits(from_time, to_time):
    from django.db import connection

    sql = """
    SELECT c.zone_id, c.hcr_type,"""
    sql += getFilteredStats("follow_up", from_time, to_time, "c.")

    with connection.cursor() as cursor:
        if from_time is not None and to_time is not None:
            cursor.execute(
                sql,
                [str(from_time), str(to_time)],
            )

        else:
            cursor.execute(sql)

        columns = [col[0] for col in cursor.description]
        res = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return res


def getFilteredStats(
    option,
    from_time=None,
    to_time=None,
    alias=None,
    column_names=None,
    category_names=None,
):
    sql = """
    COUNT(*) AS total"""
    if column_names:
        for i in range(len(column_names)):
            sql += f""",
    COUNT(*) FILTER (WHERE {alias}{column_names[i]} AND c.gender = 'F' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) >= 18) AS {category_names[i]}_female_adult_total,
    COUNT(*) FILTER (WHERE {alias}{column_names[i]} AND c.gender = 'M' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) >= 18) AS {category_names[i]}_male_adult_total,
    COUNT(*) FILTER (WHERE {alias}{column_names[i]} AND c.gender = 'F' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) < 18) AS {category_names[i]}_female_child_total,
    COUNT(*) FILTER (WHERE {alias}{column_names[i]} AND c.gender = 'M' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) < 18) AS {category_names[i]}_male_child_total"""

    else:
        sql += """,
    COUNT(*) FILTER (WHERE c.gender = 'F' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) >= 18) AS female_adult_total,
    COUNT(*) FILTER (WHERE c.gender = 'M' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) >= 18) AS male_adult_total,
    COUNT(*) FILTER (WHERE c.gender = 'F' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) < 18) AS female_child_total,
    COUNT(*) FILTER (WHERE c.gender = 'M' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) < 18) AS male_child_total
    """

    if option == "follow_up":
        sql += """FROM cbr_api_client AS c
        """
        sql += """
        JOIN cbr_api_visit AS v ON c.id = v.client_id_id
        """

        if from_time is not None and to_time is not None:
            sql += """WHERE v.created_at BETWEEN %s AND %s
            GROUP BY c.zone_id, c.hcr_type HAVING COUNT(v.client_id_id) > 1
            """

        else:
            sql += """
        GROUP BY c.zone_id, c.hcr_type HAVING COUNT(v.client_id_id) > 1"""

    elif option == "new_clients":
        sql += """FROM cbr_api_client AS c"""
        if from_time is not None and to_time is not None:
            sql += """WHERE c.created_at BETWEEN %s AND %s
            GROUP BY c.zone_id, c.hcr_type
            """
        else:
            sql += """
            GROUP BY c.zone_id, c.hcr_type"""

    elif option == "referral_stats":
        sql += """,
    COUNT(*) FILTER (WHERE r.services_other != '' AND c.gender = 'F' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) >= 18) AS other_female_adult_total,
    COUNT(*) FILTER (WHERE r.services_other != '' AND c.gender = 'M' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) >= 18) AS other_male_adult_total,
    COUNT(*) FILTER (WHERE r.services_other != '' AND c.gender = 'F' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) < 18) AS other_female_child_total,
    COUNT(*) FILTER (WHERE r.services_other != '' AND c.gender = 'M' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) < 18) AS other_male_child_total
    FROM cbr_api_referral AS r 
    JOIN cbr_api_client AS c ON r.client_id_id = c.id
    """

    elif option == "visit_stats":
        sql += """
    FROM cbr_api_visit as v
    JOIN cbr_api_client AS c ON v.client_id_id = c.id"""

    elif option == "disability_stats":
        sql += """FROM cbr_api_client_disability AS d
    JOIN cbr_api_client as c ON d.client_id = c.id
    """

    return sql
