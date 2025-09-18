from django.db import migrations

# If you have a known translation key list for "provided", choose the value
# that will display best in your UI (e.g., "Outcome" or "legacy_outcome" or "Other").
PROVIDED_LABEL_FOR_LEGACY = "Outcome"  # <= 50 chars (fits Improvement.provided)


def forwards(apps, schema_editor):
    Outcome = apps.get_model("cbr_api", "Outcome")
    Improvement = apps.get_model("cbr_api", "Improvement")

    db_alias = schema_editor.connection.alias

    # Use a deterministic id so the migration is safe to re-run (idempotent)
    # and won't create duplicates if partially applied.
    def migrated_id(outcome_id: str) -> str:
        return f"migr_{outcome_id}"  # "migr_" + 36-char UUID = 41 chars < 100 max

    # Iterate in chunks to avoid memory spikes on large tables
    qs = Outcome.objects.using(db_alias).all().select_related("visit_id")
    to_create = []
    BATCH = 1000

    for o in qs.iterator(chunk_size=BATCH):
        imp_id = migrated_id(o.id)

        # Skip if already migrated (idempotency)
        if Improvement.objects.using(db_alias).filter(pk=imp_id).exists():
            continue

        to_create.append(
            Improvement(
                id=imp_id,
                visit_id=o.visit_id,
                risk_type=o.risk_type,
                provided=PROVIDED_LABEL_FOR_LEGACY,
                desc=o.outcome or "",
                created_at=o.created_at,
                server_created_at=o.server_created_at,
            )
        )

        if len(to_create) >= BATCH:
            Improvement.objects.using(db_alias).bulk_create(
                to_create, ignore_conflicts=True
            )
            to_create.clear()

    if to_create:
        Improvement.objects.using(db_alias).bulk_create(
            to_create, ignore_conflicts=True
        )


def backwards(apps, schema_editor):
    # Delete only the improvements we created (those with our deterministic id prefix)
    Improvement = apps.get_model("cbr_api", "Improvement")
    db_alias = schema_editor.connection.alias
    Improvement.objects.using(db_alias).filter(id__startswith="migr_").delete()


class Migration(migrations.Migration):

    # Update this dependency to the latest migration in cbr_api
    dependencies = [
        ("cbr_api", "0070_merge_20250707_2016"),
    ]

    # If you expect very large tables and want partial commits per batch, you can set:
    # atomic = False

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
