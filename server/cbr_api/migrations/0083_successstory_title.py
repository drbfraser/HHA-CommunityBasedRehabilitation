from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0082_alter_successstory_photo"),
    ]

    operations = [
        migrations.AddField(
            model_name="successstory",
            name="title",
            field=models.CharField(blank=True, default="", max_length=300),
        ),
    ]
