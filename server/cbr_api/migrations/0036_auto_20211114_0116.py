# Generated by Django 3.2.9 on 2021-11-14 09:16

import cbr_api.util
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cbr_api', '0035_merge_20211114_0057'),
    ]

    operations = [
        migrations.RenameField(
            model_name='referral',
            old_name='client',
            new_name='client_id',
        ),
        migrations.RenameField(
            model_name='referral',
            old_name='user',
            new_name='user_id',
        ),
        migrations.AddField(
            model_name='referral',
            name='server_created_at',
            field=models.BigIntegerField(default=cbr_api.util.current_milli_time),
        ),
    ]
