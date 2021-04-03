def getDisabilityStats():
    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT disability_id,
            COUNT(*) as total
            FROM cbr_api_client_disability GROUP BY disability_id ORDER BY disability_id
        """
        )

        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

def getTotalDisabilityStats():
    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT COUNT(DISTINCT client_id) as total
            FROM cbr_api_client_disability
        """
        )

        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

def getVisitStats(user_id, from_time, to_time):
    sql = """
        SELECT zone_id,
        COUNT(*) as total,
        COUNT(*) filter(where health_visit) as health_count,
        COUNT(*) filter(where educat_visit) as educat_count,
        COUNT(*) filter(where social_visit) as social_count
        FROM cbr_api_visit
    """
    if user_id != -1:
        sql += " WHERE user_id=" + str(user_id)

    if from_time != -1 and to_time != -1:
        if (user_id != -1):
            sql += " AND"
        else:
            sql += " WHERE"
        sql += " date_visited >= " + str(from_time) + " AND date_visited <= " + str(to_time)

    elif from_time != -1 and to_time == -1:
        if (user_id != -1):
            sql += " AND"
        else:
            sql += " WHERE"
        sql += " date_visited >= " + str(from_time)
    
    elif from_time == -1 and to_time != -1:
        if (user_id != -1):
            sql += " AND"
        else:
            sql += " WHERE"
        sql += " date_visited <= " + str(to_time)
        
        
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
        COUNT(*) filter(where services_other != '') as other_count
        FROM cbr_api_referral
    """

    if user_id != -1:
        sql += " WHERE user_id=" + str(user_id)

    if from_time != -1 and to_time != -1:
        if (user_id != -1):
            sql += " AND"
        else:
            sql += " WHERE"
        sql += " date_referred >= " + str(from_time) + " AND date_referred <= " + str(to_time)

    elif from_time != -1 and to_time == -1:
        if (user_id != -1):
            sql += " AND"
        else:
            sql += " WHERE"
        sql += " date_referred >= " + str(from_time)
    
    elif from_time == -1 and to_time != -1:
        if (user_id != -1):
            sql += " AND"
        else:
            sql += " WHERE"
        sql += " date_referred <= " + str(to_time)

    sql += " GROUP BY resolved ORDER BY resolved DESC"

    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(sql)

        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]

        empty_stats = dict(zip(columns, [0] * len(columns)))

        def getOrEmpty(resolved):
            return next(
                (r for r in rows if r["resolved"] == resolved), empty_stats
            )

        return {"resolved": getOrEmpty(True), "unresolved": getOrEmpty(False)}