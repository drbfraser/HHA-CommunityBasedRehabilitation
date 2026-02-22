from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0075_email_settings"),
    ]

    operations = [
        migrations.AddField(
            model_name="emailsettings",
            name="password_updated_at",
            field=models.BigIntegerField(default=0),
        ),
    ]
