from django.conf import settings
from django.db import migrations, models
import cbr_api.util
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("cbr_api", "0080_merge_0075_visit_picture_0079_merge_20260209_1702"),
    ]

    operations = [
        migrations.CreateModel(
            name="SuccessStory",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "created_at",
                    models.BigIntegerField(default=cbr_api.util.current_milli_time),
                ),
                (
                    "updated_at",
                    models.BigIntegerField(default=cbr_api.util.current_milli_time),
                ),
                (
                    "refugee_origin",
                    models.CharField(blank=True, default="", max_length=200),
                ),
                (
                    "refugee_duration",
                    models.CharField(blank=True, default="", max_length=200),
                ),
                ("diagnosis", models.TextField(blank=True, default="")),
                ("treatment_service", models.TextField(blank=True, default="")),
                ("part1_background", models.TextField(blank=True, default="")),
                ("part2_challenge", models.TextField(blank=True, default="")),
                ("part3_introduction", models.TextField(blank=True, default="")),
                ("part4_action", models.TextField(blank=True, default="")),
                ("part5_impact", models.TextField(blank=True, default="")),
                ("photo", models.TextField(blank=True, default="")),
                (
                    "publish_permission",
                    models.CharField(
                        choices=[("YES", "Yes"), ("NO", "No"), ("ANON", "Anonymous")],
                        default="NO",
                        max_length=5,
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[("WIP", "Work in Progress"), ("READY", "Ready")],
                        default="WIP",
                        max_length=5,
                    ),
                ),
                ("date", models.DateField()),
                (
                    "client_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="success_stories",
                        to="cbr_api.client",
                    ),
                ),
                (
                    "created_by_user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="created_success_stories",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
                "indexes": [
                    models.Index(
                        fields=["client_id", "created_at"],
                        name="cbr_api_suc_client__8163e4_idx",
                    ),
                    models.Index(
                        fields=["created_by_user_id", "created_at"],
                        name="cbr_api_suc_created_b7401b_idx",
                    ),
                ],
            },
        ),
    ]
