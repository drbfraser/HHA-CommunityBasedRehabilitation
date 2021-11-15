# Generated by Django 3.2.8 on 2021-11-13 10:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0023_alert"),
    ]

    operations = [
        migrations.AlterField(
            model_name="alert",
            name="priority",
            field=models.CharField(
                choices=[("H", "High"), ("M", "Medium"), ("L", "Low")], max_length=9
            ),
        ),
    ]