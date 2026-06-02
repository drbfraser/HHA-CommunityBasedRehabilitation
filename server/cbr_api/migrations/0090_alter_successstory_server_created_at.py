from django.db import migrations, models

import cbr_api.util


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0089_alter_successstory_id_charfield"),
    ]

    operations = [
        migrations.AlterField(
            model_name="successstory",
            name="server_created_at",
            field=models.BigIntegerField(default=cbr_api.util.current_milli_time),
        ),
    ]
