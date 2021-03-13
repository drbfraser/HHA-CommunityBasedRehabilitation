from django.core.management.base import BaseCommand
from cbr_api import models
import time
import random


class Command(BaseCommand):
    def handle(self, *args, **options):
        zones = models.Zone.objects.all()

        def createUser(self, Username, First, Last, Phone):
            user = models.UserCBR.objects.create(
                username=Username,
                password=Username,
                first_name=First,
                last_name=Last,
                zone=random.choice(zones),
                phone_number=Phone,
                created_date=int(time.time()),
                is_active=True,
            )
            user.set_password(Username)
            return user

        def createAdmin(self, Username, Password, First, Last, Phone):
            user = models.UserCBR.objects.create(
                username=Username,
                password=Password,
                first_name=First,
                last_name=Last,
                zone=random.choice(zones),
                phone_number=Phone,
                created_date=int(time.time()),
                is_active=True,
                is_superuser=True,
            )
            user.set_password(Username)
            return user

        if models.UserCBR.objects.all().count() > 0:
            self.stdout.write(self.style.ERROR("Users have already been created!"))
            return
        if models.Zone.objects.all().count() == 0:
            self.stdout.write(
                self.style.ERROR("Zones have not been created! Run seedzones first!")
            )
            return

        createAdmin(self, "venus", "hhaLogin", "Brian", "Fraser", "555-8080")

        createUser(self, "eruska", "Eliza", "Ruska", "555-1010")
        createUser(self, "rfatimah", "Robert", "Fatimah", "555-2020")
        createUser(self, "gnye", "Guo", "Nye", "555-3030")
        createUser(self, "jherry", "Julia", "Herry", "555-4040")
        createUser(self, "tjames", "Toby", "James", "555-5050")

        self.stdout.write(self.style.SUCCESS("Users successfully created!"))
