from django.db import migrations


def ensure_impairments(apps, schema_editor):
    Disability = apps.get_model("cbr_api", "Disability")

    def ensure_disability(name: str):
        try:
            d = Disability.objects.get(disability_type__iexact=name)
            if d.disability_type != name:
                d.disability_type = name
                d.save(update_fields=["disability_type"])
        except Disability.DoesNotExist:
            Disability.objects.create(disability_type=name)

    # Ensure these commonly used impairments exist (idempotent)
    ensure_disability("Visual Impairment")
    ensure_disability("Hearing Impairment")


class Migration(migrations.Migration):
    dependencies = [
        ("cbr_api", "0073_remove_clientrisk_goal"),
    ]

    operations = [
        migrations.RunPython(ensure_impairments, migrations.RunPython.noop),
    ]
