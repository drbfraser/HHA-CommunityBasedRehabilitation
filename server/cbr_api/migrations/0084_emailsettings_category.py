from django.db import migrations, models


def seed_email_settings_categories(apps, schema_editor):
    EmailSettings = apps.get_model("cbr_api", "EmailSettings")

    referral_settings = (
        EmailSettings.objects.filter(category="referral").order_by("id").first()
    )
    if referral_settings is None:
        referral_settings = EmailSettings.objects.create(
            category="referral",
            from_email="",
            from_email_password="",
            to_email="",
            password_updated_at=0,
        )

    bug_report_settings = (
        EmailSettings.objects.filter(category="bug_report").order_by("id").first()
    )
    if bug_report_settings is None:
        EmailSettings.objects.create(
            category="bug_report",
            from_email="",
            from_email_password="",
            to_email="",
            password_updated_at=0,
        )


class Migration(migrations.Migration):
    dependencies = [
        ("cbr_api", "0083_successstory_title"),
    ]

    operations = [
        migrations.AddField(
            model_name="emailsettings",
            name="category",
            field=models.CharField(
                choices=[
                    ("referral", "Referral"),
                    ("bug_report", "Bug Report / Suggestion"),
                ],
                db_index=True,
                default="referral",
                max_length=30,
            ),
        ),
        migrations.RunPython(seed_email_settings_categories, migrations.RunPython.noop),
    ]
