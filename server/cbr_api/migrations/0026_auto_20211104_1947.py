# Generated by Django 3.2.9 on 2021-11-05 02:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0025_auto_20211101_2110"),
    ]

    operations = [
        migrations.AddField(
            model_name="client",
            name="educat_timestamp",
            field=models.BigIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="client",
            name="health_timestamp",
            field=models.BigIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="client",
            name="social_timestamp",
            field=models.BigIntegerField(default=0),
        ),
    ]