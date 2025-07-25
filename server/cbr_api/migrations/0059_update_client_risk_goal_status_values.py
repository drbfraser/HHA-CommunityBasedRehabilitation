# Generated by Django 4.1.10 on 2025-03-23 02:02

from django.db import migrations


def update_default_goal_status_vals(apps, schema_editor):
    ClientRisk = apps.get_model("cbr_api", "ClientRisk")
    clients = ClientRisk.objects.values("client_id", "risk_type").distinct()

    # Update the goal_status for all current risks associated to one user for each risk
    for client in clients:
        clientId = client["client_id"]
        riskType = client["risk_type"]

        totalClientRisks = ClientRisk.objects.filter(
            client_id=clientId, risk_type=riskType
        ).order_by("-timestamp")

        if totalClientRisks.exists():
            totalClientRisks.update(goal_status="NS")

            current = totalClientRisks.first()
            current.goal_status = "GO"
            current.save()


def reverse_migration(apps, schema_editor):
    ClientRisk = apps.get_model("cbr_api", "ClientRisk")
    ClientRisk.objects.all().update(goal_status="NS")


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0058_clientrisk_end_date_clientrisk_goal_name_and_more"),
    ]

    operations = [
        migrations.RunPython(update_default_goal_status_vals, reverse_migration)
    ]
