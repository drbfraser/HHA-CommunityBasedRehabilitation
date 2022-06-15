# Seed only one admin user
from django.core.management.base import BaseCommand
from cbr_api import models
import random
import uuid
import string, secrets
import datetime, time


class Command(BaseCommand):
    def handle(self, *args, **options):
        zones = models.Zone.objects.all()

        def createUser(self, id, username, password, first, last, phone, role):
            millisecond = datetime.datetime.now()
            creation_date_ms = time.mktime(millisecond.timetuple()) * 1000

            user = models.UserCBR.objects.create(
                id=id,
                username=username,
                password=password,
                first_name=first,
                last_name=last,
                zone=random.choice(zones),
                phone_number=phone,
                created_at=creation_date_ms,
                server_created_at=creation_date_ms,
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

        # Generate a random 20 character password
        # Source: https://docs.python.org/3/library/secrets.html#recipes-and-best-practices
        alphabet = string.ascii_letters + string.digits
        password = "".join(
            secrets.choice(alphabet) for i in range(20)
        )  # for a 20-character password

        username = "tempadmin"

        createUser(
            self,
            uuid.uuid4(),
            username,
            password,
            "Temporary",
            "Admin",
            "000-0000",
            models.UserCBR.Role.ADMIN,
        )

        self.stdout.write(self.style.SUCCESS("Admin user successfully created!"))
        self.stdout.write(
            self.style.SUCCESS("--> User name set to:         '" + username + "'")
        )
        self.stdout.write(
            self.style.SUCCESS("--> Initial password set to:  '" + password + "'")
        )
        self.stdout.write(
            self.style.SUCCESS(
                "--> You *must* write this password down now! Then log-in and change it."
            )
        )
