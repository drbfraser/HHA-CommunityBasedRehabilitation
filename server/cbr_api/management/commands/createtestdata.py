from django.core.management.base import BaseCommand
from cbr_api import models
import time


class Command(BaseCommand):
    def handle(self, *args, **options):
        def createUser(self, Username, First, Last, Phone, Zone):
            return models.UserCBR.objects.create(
                username=Username,
                password=Username,
                first_name=First,
                last_name=Last,
                zone=Zone,
                phone_number=Phone,
                created_date=int(time.time()),
            )
            
        def createAdmin(self, Username, Password, First, Last, Phone, Zone):
            return models.UserCBR.objects.create(
                username=Username,
                password=Password,
                first_name=First,
                last_name=Last,
                zone=Zone,
                phone_number=Phone,
                created_date=int(time.time()),
                is_superuser=True,
            )

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
            
        try:
            admin = models.UserCBR.objects.get(username="venus")
        except models.UserCBR.DoesNotExist:
            admin = createAdmin(self, "venus", "hhaLogin", "Brian", "Fraser", "555-8080", zone0)
            
        try:
            user1 = models.UserCBR.objects.get(username="eruska")
        except models.UserCBR.DoesNotExist:
            user1 = createUser(self, "eruska", "Eliza", "Ruska", "555-1010", zone1)
        try:
            user2 = models.UserCBR.objects.get(username="rfatimah")
        except models.UserCBR.DoesNotExist:
            user2 = createUser(self, "rfatimah", "Robert", "Fatimah", "555-2020", zone2)
        try:
            user3 = models.UserCBR.objects.get(username="gnye")
        except models.UserCBR.DoesNotExist:
            user3 = createUser(self, "gnye", "Guo", "Nye", "555-3030", zone3)
        try:
            user4 = models.UserCBR.objects.get(username="jherry")
        except models.UserCBR.DoesNotExist:
            user4 = createUser(self, "jherry", "Julia", "Herry", "555-4040", zone4)
        try:
            user5 = models.UserCBR.objects.get(username="tjames")
        except models.UserCBR.DoesNotExist:
            user5 = createUser(self, "tjames", "Toby", "James", "555-5050", zone5)
        
        # create clients
        
        # create visits
        
        self.stdout.write(self.style.SUCCESS("Test data successfully created!"))
