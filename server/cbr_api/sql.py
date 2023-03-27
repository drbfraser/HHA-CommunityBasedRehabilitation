def getDisabilityStats(is_active):
    sql = """
        SELECT disability_id,
        COUNT(*) as total
        FROM cbr_api_client_disability
        """

    if is_active:
        sql += """ 
            WHERE cbr_api_client_disability.client_id = (
                SELECT id 
                FROM cbr_api_client
                WHERE cbr_api_client_disability.client_id = cbr_api_client.id AND 
                cbr_api_client.is_active = True
            ) """

    sql += "GROUP BY disability_id ORDER BY disability_id"

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
    sql = """
        SELECT zone_id,
        COUNT(*) as total,
        COUNT(*) filter(where health_visit) as health_count,
        COUNT(*) filter(where educat_visit) as educat_count,
        COUNT(*) filter(where social_visit) as social_count,
        COUNT(*) filter(where nutrit_visit) as nutrit_count
        FROM cbr_api_visit
    """

    sql += getStatsWhere(user_id, "created_at", from_time, to_time)
    sql += " GROUP BY zone_id ORDER BY zone_id"

    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(sql)

        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


def getReferralStats(user_id, from_time, to_time):
    sql = """
        SELECT resolved,
        COUNT(*) as total,
        COUNT(*) filter(where wheelchair) as wheelchair_count,
        COUNT(*) filter(where physiotherapy) as physiotherapy_count,
        COUNT(*) filter(where prosthetic) as prosthetic_count,
        COUNT(*) filter(where orthotic) as orthotic_count,
        COUNT(*) filter(where hha_nutrition_and_agriculture_project) as nutrition_agriculture_count,
        COUNT(*) filter(where services_other != '') as other_count
        FROM cbr_api_referral
    """

    sql += getStatsWhere(user_id, "date_referred", from_time, to_time)
    sql += " GROUP BY resolved ORDER BY resolved DESC"

    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(sql)

        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]

        empty_stats = dict(zip(columns, [0] * len(columns)))

        def getOrEmpty(resolved):
            return next((r for r in rows if r["resolved"] == resolved), empty_stats)

        return {"resolved": getOrEmpty(True), "unresolved": getOrEmpty(False)}


def getStatsWhere(user_id, time_col, from_time, to_time):
    where = []

    if user_id is not None:
        # it seems that '_id' is automatically appended to the end of foreign key column names.
        # So user_id -> user_id_id
        where.append(f"user_id_id='{user_id}'")

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
            SELECT c.id, c.full_name, r.services_other, r.physiotherapy, r.wheelchair, r.prosthetic, r.orthotic, r.hha_nutrition_and_agriculture_project, r.date_referred
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
