import logging

logger = logging.getLogger(__name__)


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


# QUERIES FOR STATISTICS
def getDisabilityStats(user_id, from_time, to_time, is_active):
    sql = """
    SELECT d.disability_id AS disability_id, c.hcr_type, c.zone_id,
    COUNT(*) AS total"""

    sql += demographicStatsBuilder("disability_stats", is_active, "d.")
    sql += whereStatsBuilder(user_id, "c.created_at", from_time, to_time)

    sql += "GROUP BY d.disability_id, c.hcr_type, c.zone_id ORDER BY d.disability_id"

    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(sql)

        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


def getNumClientsWithDisabilities(user_id, from_time, to_time, is_active):
    sql = """
    SELECT COUNT(DISTINCT d.client_id) as total"""

    sql += demographicStatsBuilder("clients_with_disabilities", is_active, "d.")
    sql += whereStatsBuilder(user_id, "c.created_at", from_time, to_time)

    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(sql)

        return cursor.fetchone()[0]


def getVisitStats(user_id, from_time, to_time, is_active):
    column_names = [
        "health_visit",
        "educat_visit",
        "social_visit",
        "nutrit_visit",
        "mental_visit",
    ]

    category_names = ["health", "educat", "social", "nutrit", "mental"]

    sql = """
    SELECT v.zone_id, c.hcr_type,
    COUNT(*) AS total"""

    sql += demographicStatsBuilder(
        "visit_stats",
        is_active,
        "v.",
        column_names=column_names,
        category_names=category_names,
    )

    sql += whereStatsBuilder(user_id, "v.created_at", from_time, to_time)

    sql += """
    GROUP BY v.zone_id, c.hcr_type ORDER BY v.zone_id"""

    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(sql)

        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


def getReferralStats(user_id, from_time, to_time, is_active):
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
    SELECT r.resolved, c.zone_id, c.hcr_type,
    COUNT(*) AS total"""

    sql += demographicStatsBuilder(
        "referral_stats",
        is_active,
        "r.",
        column_names=column_names,
        category_names=category_names,
    )
    sql += whereStatsBuilder(user_id, "r.date_referred", from_time, to_time)
    sql += """
    GROUP BY r.resolved, c.zone_id, c.hcr_type ORDER BY r.resolved DESC"""

    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(sql)

        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]

        empty_stats = dict(zip(columns, [0] * len(columns)))

        def getOrEmpty(resolved):
            return next((r for r in rows if r["resolved"] == resolved), empty_stats)

        return {"resolved": getOrEmpty(True), "unresolved": getOrEmpty(False)}


def getNewClients(user_id, from_time, to_time, is_active):
    from django.db import connection

    sql = """
    SELECT c.zone_id, c.hcr_type,
    COUNT(*) AS total"""
    sql += demographicStatsBuilder("new_clients", is_active, "c.")
    statsRes = whereStatsBuilder(user_id, "c.created_at", from_time, to_time)

    if is_active:
        if len(statsRes) != 0:
            statsRes += """ AND c.is_active = True"""
        else:
            statsRes = """
            WHERE c.is_active = True"""

    sql += statsRes
    sql += """
    GROUP BY c.zone_id, c.hcr_type"""

    with connection.cursor() as cursor:
        cursor.execute(sql)

        columns = [col[0] for col in cursor.description]
        res = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return res


def getFollowUpVisits(user_id, from_time, to_time, is_active):
    from django.db import connection

    sql = """
    SELECT c.zone_id, c.hcr_type,
    COUNT (*) AS total"""
    sql += demographicStatsBuilder("follow_up", is_active, "c.")
    sql += whereStatsBuilder(user_id, "c.created_at", from_time, to_time)

    sql += """
    GROUP BY c.zone_id, c.hcr_type HAVING COUNT(v.client_id_id) > 1"""

    with connection.cursor() as cursor:
        cursor.execute(sql)

        columns = [col[0] for col in cursor.description]
        res = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return res

def getDischargedClients(user_id, from_time, to_time, is_active):
    from django.db import connection

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
    """
    sql += demographicStatsBuilder("new_clients", is_active, alias="")

    sql += """
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
        result = [dict(zip(columns, row)) for row in cursor.fetchall()]

    return result


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
            where += """AND """
        where += f"""{time_col}<={str(to_time)}"""
        args += 1

    if args == 0:
        return ""

    return where


# Gets the default demographic (age and gender) statistics
def demographicStatsBuilder(
    option,
    is_active,
    alias=None,
    column_names=None,
    category_names=None,
):
    sql = ""

    # If there are custom column names to query from and custom category names
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
        sql += """FROM cbr_api_client AS c """

        if is_active:
            sql += """JOIN cbr_api_visit AS v ON c.id = v.client_id_id AND c.is_active = True"""

        else:
            sql += """JOIN cbr_api_visit AS v ON c.id = v.client_id_id"""

    elif option == "new_clients":
        sql += """FROM cbr_api_client AS c"""

    elif option == "referral_stats":
        sql += """,
    COUNT(*) FILTER (WHERE r.services_other != '' AND c.gender = 'F' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) >= 18) AS other_female_adult_total,
    COUNT(*) FILTER (WHERE r.services_other != '' AND c.gender = 'M' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) >= 18) AS other_male_adult_total,
    COUNT(*) FILTER (WHERE r.services_other != '' AND c.gender = 'F' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) < 18) AS other_female_child_total,
    COUNT(*) FILTER (WHERE r.services_other != '' AND c.gender = 'M' AND EXTRACT(YEAR FROM AGE(TO_TIMESTAMP(c.birth_date / 1000))) < 18) AS other_male_child_total
    FROM cbr_api_referral AS r 
    """
        if is_active:
            sql += """JOIN cbr_api_client AS c ON r.client_id_id = c.id AND c.is_active = True"""
        else:
            sql += """JOIN cbr_api_client AS c ON r.client_id_id = c.id"""

    elif option == "visit_stats":
        if is_active:
            sql += """
        FROM cbr_api_visit as v 
        JOIN cbr_api_client AS c ON v.client_id_id = c.id and c.is_active = True"""

        else:
            sql += """
        FROM cbr_api_visit as v
        JOIN cbr_api_client AS c ON v.client_id_id = c.id"""

    elif option == "disability_stats":
        if is_active:
            sql += """FROM cbr_api_client_disability AS d
        JOIN cbr_api_client as c ON d.client_id = c.id AND c.is_active = True
        """

        else:
            sql += """FROM cbr_api_client_disability AS d
        JOIN cbr_api_client as c ON d.client_id = c.id
        """

    elif option == "clients_with_disabilities":
        if is_active:
            sql += """FROM cbr_api_client_disability AS d
        JOIN cbr_api_client as c ON d.client_id = c.id AND c.is_active = True
        """
        else:
            sql += """FROM cbr_api_client_disability AS d
        JOIN cbr_api_client as c ON d.client_id = c.id
        """

    return sql
