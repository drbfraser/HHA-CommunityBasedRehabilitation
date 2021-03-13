from django.core.management.base import BaseCommand
from cbr_api import models
import time
import random


class Command(BaseCommand):
    def handle(self, *args, **options):
        zones = models.Zone.objects.all()

        def createUser(self, username, password, first, last, phone):
            user = models.UserCBR.objects.create(
                username=username,
                password=password,
                first_name=first,
                last_name=last,
                zone=random.choice(zones),
                phone_number=phone,
                created_date=int(time.time()),
                is_active=True,
            )
            user.set_password(password)
            user.save()
            return user

        def createAdmin(self, username, password, first, last, phone):
            user = models.UserCBR.objects.create(
                username=username,
                password=password,
                first_name=first,
                last_name=last,
                zone=random.choice(zones),
                phone_number=phone,
                created_date=int(time.time()),
                is_active=True,
                is_superuser=True,
            )
            user.set_password(password)
            user.save()
            return user

        if models.UserCBR.objects.all().count() > 0:
            self.stdout.write(self.style.ERROR("Users have already been created!"))
            return
        if models.Zone.objects.all().count() == 0:
            self.stdout.write(
                self.style.ERROR("Zones have not been created! Run seedzones first!")
            )
            return

        createAdmin(self, "bfraser", "hhaLogin", "Brian", "Fraser", "555-8080")

        createUser(self, "eruska", "hhaLogin", "Eliza", "Ruska", "555-1010")
        createUser(self, "rfatimah", "hhaLogin", "Robert", "Fatimah", "555-2020")
        createUser(self, "gnye", "hhaLogin", "Guo", "Nye", "555-3030")
        createUser(self, "jherry", "hhaLogin", "Julia", "Herry", "555-4040")
        createUser(self, "tjames", "hhaLogin", "Toby", "James", "555-5050")

        self.stdout.write(self.style.SUCCESS("Users successfully created!"))
