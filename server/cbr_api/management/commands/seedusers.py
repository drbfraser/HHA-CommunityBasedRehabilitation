from django.core.management.base import BaseCommand
from cbr_api import models
import random


class Command(BaseCommand):
    def handle(self, *args, **options):
        zones = models.Zone.objects.all()

        def getYearTimestamp(self, year):
            return (year - 1970) * (60 * 60 * 24 * 365)

        def createUser(self, id, username, password, first, last, phone, role):
            user = models.UserCBR.objects.create(
                id=id,
                username=username,
                password=password,
                first_name=first,
                last_name=last,
                zone=random.choice(zones),
                phone_number=phone,
                created_date=random.randint(
                    getYearTimestamp(self, 2017), getYearTimestamp(self, 2018)
                ),
                is_active=True,
                role=role,
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

        createUser(
            self,
            "1",
            "venus",
            "hhaLogin",
            "Venus",
            "Admin",
            "555-4242",
            models.UserCBR.Role.ADMIN,
        )
        createUser(
            self,
            "2",
            "eruska",
            "hhaLogin",
            "Eliza",
            "Ruska",
            "555-1010",
            models.UserCBR.Role.WORKER,
        )
        createUser(
            self,
            "3",
            "rfatimah",
            "hhaLogin",
            "Robert",
            "Fatimah",
            "555-2020",
            models.UserCBR.Role.WORKER,
        )
        createUser(
            self,
            "4",
            "gnye",
            "hhaLogin",
            "Guo",
            "Nye",
            "555-3030",
            models.UserCBR.Role.WORKER,
        )
        createUser(
            self,
            "5",
            "jherry",
            "hhaLogin",
            "Julia",
            "Herry",
            "555-4040",
            models.UserCBR.Role.CLINICIAN,
        )
        createUser(
            self,
            "6",
            "tjames",
            "hhaLogin",
            "Toby",
            "James",
            "555-5050",
            models.UserCBR.Role.CLINICIAN,
        )

        self.stdout.write(self.style.SUCCESS("Users successfully created!"))
