# Generated by Django 4.1.10 on 2025-03-12 07:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0057_auto_20230814_2355"),
    ]

    operations = [
        migrations.AddField(
            model_name="client",
            name="hcr_type",
            field=models.CharField(
                choices=[("HC", "Host Community"), ("R", "Refugee"), ("NA", "Not Set")],
                default="NA",
                max_length=2,
            ),
        ),
    ]
