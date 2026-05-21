from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("cbr_api", "0084_emailsettings_category"),
    ]

    operations = [
        migrations.AddField(
            model_name="patientnote",
            name="server_created_at",
            field=models.BigIntegerField(default=0),
        ),
    ]
