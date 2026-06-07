from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("cbr_api", "0087_alter_patientnote_server_created_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="successstory",
            name="server_created_at",
            field=models.BigIntegerField(default=0),
        ),
    ]
