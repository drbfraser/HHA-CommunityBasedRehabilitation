# Generated by Django 3.2.8 on 2021-11-05 05:31

import cbr_api.util
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0026_alter_referral_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="referral",
            name="created_at",
            field=models.BigIntegerField(
                default=cbr_api.util.current_milli_time, verbose_name="date created"
            ),
        ),
        migrations.AddField(
            model_name="referral",
            name="updated_at",
            field=models.BigIntegerField(default=0, verbose_name="date updated"),
        ),
    ]
