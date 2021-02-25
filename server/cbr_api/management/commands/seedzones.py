from django.core.management.base import BaseCommand
from cbr_api import models


class Command(BaseCommand):
    def handle(self, *args, **options):
        if models.Zone.objects.all().count() > 0:
            self.stdout.write(self.style.ERROR("Zones have already been created"))
            return

        models.Zone.objects.create(zone_name="BidiBidi Zone 1")
        models.Zone.objects.create(zone_name="BidiBidi Zone 2")
        models.Zone.objects.create(zone_name="BidiBidi Zone 3")
        models.Zone.objects.create(zone_name="BidiBidi Zone 4")
        models.Zone.objects.create(zone_name="BidiBidi Zone 5")
        models.Zone.objects.create(zone_name="Palorinya Basecamp")
        models.Zone.objects.create(zone_name="Palorinya Zone 1")
        models.Zone.objects.create(zone_name="Palorinya Zone 2")
        models.Zone.objects.create(zone_name="Palorinya Zone 3")

        self.stdout.write(self.style.SUCCESS("Zones successfully created!"))
