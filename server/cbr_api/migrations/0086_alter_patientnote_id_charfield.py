from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0085_patientnote_server_created_at"),
    ]

    operations = [
        migrations.AlterField(
            model_name="patientnote",
            name="id",
            field=models.CharField(max_length=100, primary_key=True, serialize=False),
        ),
    ]
