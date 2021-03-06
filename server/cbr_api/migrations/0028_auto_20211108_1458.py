# Generated by Django 3.2.9 on 2021-11-08 22:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cbr_api", "0027_alter_client_picture"),
    ]

    operations = [
        migrations.RenameField(
            model_name="improvement",
            old_name="visit",
            new_name="visit_id",
        ),
        migrations.RenameField(
            model_name="outcome",
            old_name="visit",
            new_name="visit_id",
        ),
        migrations.RenameField(
            model_name="visit",
            old_name="client",
            new_name="client_id",
        ),
        migrations.RenameField(
            model_name="visit",
            old_name="date_visited",
            new_name="created_at",
        ),
        migrations.RenameField(
            model_name="visit",
            old_name="user",
            new_name="user_id",
        ),
        migrations.AlterField(
            model_name="improvement",
            name="id",
            field=models.CharField(max_length=100, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name="outcome",
            name="id",
            field=models.CharField(max_length=100, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name="visit",
            name="id",
            field=models.CharField(max_length=100, primary_key=True, serialize=False),
        ),
    ]
