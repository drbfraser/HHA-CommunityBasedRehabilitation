# Generated by Django 4.1.10 on 2023-08-15 04:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0055_referral_mental_health_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="clientrisk",
            name="goal",
            field=models.TextField(default="No goal set"),
        ),
        migrations.AlterField(
            model_name="clientrisk",
            name="requirement",
            field=models.TextField(default="No requirement set"),
        ),
    ]