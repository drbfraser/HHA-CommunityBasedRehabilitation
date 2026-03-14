# Generated manually for success story image upload support

import cbr_api.models
import cbr_api.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0081_successstory"),
    ]

    operations = [
        migrations.AlterField(
            model_name="successstory",
            name="photo",
            field=models.ImageField(
                blank=True,
                null=True,
                storage=cbr_api.storage.OverwriteStorage(),
                upload_to=cbr_api.models.SuccessStory.rename_file,
            ),
        ),
    ]
