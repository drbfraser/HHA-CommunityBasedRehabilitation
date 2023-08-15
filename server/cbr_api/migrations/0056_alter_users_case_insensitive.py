from django.db import migrations, models
from cbr_api import models as cbr_models
from django.db.models.functions import Lower
def make_usernames_lowercase(apps, schema_editor):
    cbr_models.UserCBR.objects.all().update(username=Lower('username'))

class Migration(migrations.Migration):
    dependencies = [
        ("cbr_api", "0055_referral_mental_health_and_more"),
    ]

    operations = [
        migrations.RunPython(make_usernames_lowercase),
    ]