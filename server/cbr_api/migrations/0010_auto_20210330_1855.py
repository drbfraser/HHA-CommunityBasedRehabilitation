# Generated by Django 3.1.6 on 2021-03-31 01:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0009_usercbr_role"),
    ]

    operations = [
        migrations.AlterField(
            model_name="visit",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="visits",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
