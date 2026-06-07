from django.db import migrations, models

import cbr_api.models


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0088_successstory_server_created_at"),
    ]

    operations = [
        migrations.AlterField(
            model_name="successstory",
            name="id",
            field=models.CharField(
                default=cbr_api.models.generate_id,
                max_length=100,
                primary_key=True,
                serialize=False,
            ),
        ),
    ]
