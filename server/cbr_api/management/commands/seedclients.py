from django.core.management.base import BaseCommand
from cbr_api import models
import time
import random


class Command(BaseCommand):
    def handle(self, *args, **options):
        risks = ["LO", "ME", "HI", "CR"]
        zones = models.Zone.objects.all()
        users = models.UserCBR.objects.all()
        disabilities = models.Disability.objects.all()
        
        def getYearTimestamp(self, year):
            return (year - 1970) * (60 * 60 * 24 * 365)

        def createRisk(self, client, type, level, time):
            risk = models.ClientRisk.objects.create(
                client=client,
                timestamp=time,
                risk_type=type,
                risk_level=level,
                requirement="",
                goal="",
            )
            client.risks.add(risk)
            return risk

        def createClient(self, first, last, gender, village, phone):
            health_risk = random.choice(risks)
            social_risk = random.choice(risks)
            educat_risk = random.choice(risks)
            creation_date = random.randint(getYearTimestamp(self, 2018), getYearTimestamp(self, 2019))
            client = models.Client.objects.create(
                created_by_user=random.choice(users),
                created_date=creation_date,
                first_name=first,
                last_name=last,
                full_name=first + " " + last,
                phone_number=phone,
                zone=random.choice(zones),
                gender=gender,
                birth_date=random.randint(0, getYearTimestamp(self, 2000)),
                longitude=0.0,
                latitude=0.0,
                village=village,
                health_risk_level=health_risk,
                social_risk_level=social_risk,
                educat_risk_level=educat_risk,
            )
            client.disability.add(random.choice(disabilities))
            createRisk(self, client, "HEALTH", health_risk, creation_date)
            createRisk(self, client, "SOCIAL", social_risk, creation_date)
            createRisk(self, client, "EDUCAT", educat_risk, creation_date)
            return client

        if models.Client.objects.all().count() > 0:
            self.stdout.write(self.style.ERROR("Clients have already been created!"))
            return
        if models.Zone.objects.all().count() == 0:
            self.stdout.write(
                self.style.ERROR("Zones have not been created! Run seedzones first!")
            )
            return
        if models.Disability.objects.all().count() == 0:
            self.stdout.write(
                self.style.ERROR(
                    "Disabilities have not been created! Run seeddisabilities first!"
                )
            )
            return
        if models.UserCBR.objects.all().count() == 0:
            self.stdout.write(
                self.style.ERROR("Users have not been created! Run seedusers first!")
            )
            return

        createClient(self, "Dan", "Nylah", "M", "#1", "555-0001")
        createClient(self, "Blaise", "Georg", "F", "#2", "555-0002")
        createClient(self, "Carol", "Yaumuna", "F", "#3", "555-0003")
        createClient(self, "Aravind", "Bartolome", "M", "#4", "555-0004")
        createClient(self, "Ana", "Sofia", "F", "#5", "555-0005")
        createClient(self, "Edgar", "Hirah", "M", "#6", "555-0006")
        createClient(self, "Okan", "Alvis", "M", "#7", "555-0007")
        createClient(self, "Beatrix", "Adem", "F", "#8", "555-0008")
        createClient(self, "Rigel", "Lachlan", "M", "#9", "555-0009")
        
        clients = models.Client.objects.all()
        
        createRisk(self, random.choice(clients), "HEALTH", random.choice(risks), random.randint(getYearTimestamp(self, 2019), getYearTimestamp(self, 2020)))
        createRisk(self, random.choice(clients), "HEALTH", random.choice(risks), random.randint(getYearTimestamp(self, 2019), getYearTimestamp(self, 2020)))
        createRisk(self, random.choice(clients), "HEALTH", random.choice(risks), random.randint(getYearTimestamp(self, 2019), getYearTimestamp(self, 2020)))
        createRisk(self, random.choice(clients), "SOCIAL", random.choice(risks), random.randint(getYearTimestamp(self, 2019), getYearTimestamp(self, 2020)))
        createRisk(self, random.choice(clients), "SOCIAL", random.choice(risks), random.randint(getYearTimestamp(self, 2019), getYearTimestamp(self, 2020)))
        createRisk(self, random.choice(clients), "SOCIAL", random.choice(risks), random.randint(getYearTimestamp(self, 2019), getYearTimestamp(self, 2020)))
        createRisk(self, random.choice(clients), "EDUCAT", random.choice(risks), random.randint(getYearTimestamp(self, 2019), getYearTimestamp(self, 2020)))
        createRisk(self, random.choice(clients), "EDUCAT", random.choice(risks), random.randint(getYearTimestamp(self, 2019), getYearTimestamp(self, 2020)))
        createRisk(self, random.choice(clients), "EDUCAT", random.choice(risks), random.randint(getYearTimestamp(self, 2019), getYearTimestamp(self, 2020)))

        self.stdout.write(self.style.SUCCESS("Clients successfully created!"))
