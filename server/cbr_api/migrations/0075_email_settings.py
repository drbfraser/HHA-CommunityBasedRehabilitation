from django.db import migrations, models

from cbr_api.util import current_milli_time


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0074_add_impairment_disabilities"),
    ]

    operations = [
        migrations.CreateModel(
            name="EmailSettings",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("from_email", models.EmailField(max_length=254)),
                ("from_email_password", models.CharField(blank=True, default="", max_length=128)),
                ("to_email", models.EmailField(max_length=254)),
                ("updated_at", models.BigIntegerField(default=current_milli_time)),
            ],
        ),
    ]
