from django.core.management.base import BaseCommand
from cbr_api import models


class Command(BaseCommand):
    def handle(self, *args, **options):
        zone0 = models.Zone.objects.get(zone_name="Palorinya Basecamp")
        zone1 = models.Zone.objects.get(zone_name="BidiBidi Zone 1")
        zone2 = models.Zone.objects.get(zone_name="BidiBidi Zone 2")
        zone3 = models.Zone.objects.get(zone_name="BidiBidi Zone 3")
        zone4 = models.Zone.objects.get(zone_name="BidiBidi Zone 4")
        zone5 = models.Zone.objects.get(zone_name="BidiBidi Zone 5")
        
        if zone0 is None or zone1 is None or zone2 is None or zone3 is None or zone4 is None or zone5 is None:
            self.stdout.write(self.style.ERROR("Zones have not been seeded yet!"))
            return
            
        limb = models.Disability.objects.get(disability_type="Amputee")
        other = models.Disability.objects.get(disability_type="Other")
        visual = models.Disability.objects.get(disability_type="Visual impairment")
        hearing = models.Disability.objects.get(disability_type="Hearing impairment")

        if limb is None or other is None or visual is None or hearing is None:
            self.stdout.write(self.style.ERROR("Disabilities have not been seeded yet!"))
            return
            
            
        # create users
        
        # create clients
        
        # create visits
        
        self.stdout.write(self.style.SUCCESS("Test data successfully created!"))
