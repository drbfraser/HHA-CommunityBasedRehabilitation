# Generated manually for multi-photo support and admin Published/Archived statuses

import cbr_api.models
import cbr_api.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0090_alter_successstory_server_created_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="successstory",
            name="photo_2",
            field=models.ImageField(
                blank=True,
                null=True,
                storage=cbr_api.storage.OverwriteStorage(),
                upload_to=cbr_api.models.SuccessStory.rename_file_2,
            ),
        ),
        migrations.AddField(
            model_name="successstory",
            name="photo_3",
            field=models.ImageField(
                blank=True,
                null=True,
                storage=cbr_api.storage.OverwriteStorage(),
                upload_to=cbr_api.models.SuccessStory.rename_file_3,
            ),
        ),
        migrations.AddField(
            model_name="successstory",
            name="photo_4",
            field=models.ImageField(
                blank=True,
                null=True,
                storage=cbr_api.storage.OverwriteStorage(),
                upload_to=cbr_api.models.SuccessStory.rename_file_4,
            ),
        ),
        migrations.AddField(
            model_name="successstory",
            name="photo_5",
            field=models.ImageField(
                blank=True,
                null=True,
                storage=cbr_api.storage.OverwriteStorage(),
                upload_to=cbr_api.models.SuccessStory.rename_file_5,
            ),
        ),
        migrations.AlterField(
            model_name="successstory",
            name="status",
            field=models.CharField(
                choices=[
                    ("WIP", "Work in Progress"),
                    ("READY", "Ready"),
                    ("PUB", "Published"),
                    ("ARCH", "Archived"),
                ],
                default="WIP",
                max_length=5,
            ),
        ),
    ]
