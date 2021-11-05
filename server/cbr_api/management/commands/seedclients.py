from django.core.management.base import BaseCommand
from cbr_api import models
import time
import random
import uuid


class Command(BaseCommand):
    def handle(self, *args, **options):
        risks = ["LO", "ME", "HI", "CR"]
        goals = [
            "Full Recovery",
            "Additional Mobility",
            "Pain Relief",
            "Improved Learning",
            "Sport Participation",
        ]
        requirements = [
            "Referral",
            "Counseling",
            "Wheelchair",
            "Wheelchair Repair",
            "Physiotherapy",
            "Prosthetic",
            "Orthotic",
            "Other",
        ]
        zones = models.Zone.objects.all()
        users = models.UserCBR.objects.all()
        disabilities = models.Disability.objects.all()
        disabilities.exclude(disability_type="Other")

        def getYearTimestamp(self, year, days):
            return (
                ((year - 1970) * (60 * 60 * 24 * 365)) + (days * 60 * 60 * 24)
            ) * 1000

        def getDifferentRisk(self, client, type):
            diff_risks = ["LO", "ME", "HI", "CR"]

            if type == "HEALTH":
                client_risk_level = client.health_risk_level
            elif type == "SOCIAL":
                client_risk_level = client.social_risk_level
            elif type == "EDUCAT":
                client_risk_level = client.educat_risk_level

            if client_risk_level == "LO":
                diff_risks.pop(0)
            elif client_risk_level == "ME":
                diff_risks.pop(1)
            elif client_risk_level == "HI":
                diff_risks.pop(2)
            elif client_risk_level == "CR":
                diff_risks.pop(3)

            return diff_risks

        def createRisk(self, id, client, type, level, time):
            risk = models.ClientRisk.objects.create(
                id=id,
                client_id=client,
                timestamp=time,
                risk_type=type,
                risk_level=level,
                requirement=random.choice(requirements),
                goal=random.choice(goals),
            )
            client.risks.add(risk)

            if type == "HEALTH":
                client.health_risk_level = level
            elif type == "SOCIAL":
                client.social_risk_level = level
            elif type == "EDUCAT":
                client.educat_risk_level = level

            risk.save()
            client.save()

            return risk

        def createClient(
            self, id, first, last, gender, village, phone, other_disability=""
        ):
            health_risk = random.choice(risks)
            social_risk = random.choice(risks)
            educat_risk = random.choice(risks)
            creation_date = random.randint(
                getYearTimestamp(self, 2018, 0), getYearTimestamp(self, 2019, 0)
            )

            client = models.Client.objects.create(
                id=id,
                user_id=random.choice(users),
                created_at=creation_date,
                first_name=first,
                last_name=last,
                full_name=first + " " + last,
                phone_number=phone,
                zone=random.choice(zones),
                gender=gender,
                birth_date=random.randint(0, getYearTimestamp(self, 2000, 0)),
                longitude=0.0,
                latitude=0.0,
                village=village,
                other_disability=other_disability,
                health_risk_level=health_risk,
                social_risk_level=social_risk,
                educat_risk_level=educat_risk,
                health_timestamp=creation_date,
                social_timestamp=creation_date,
                educat_timestamp=creation_date,
            )
            client.disability.add(random.choice(disabilities))

            if other_disability:
                client.disability.add(
                    models.Disability.objects.get(disability_type="Other")
                )

            createRisk(self, uuid.uuid4(), client, "HEALTH", health_risk, creation_date)
            createRisk(self, uuid.uuid4(), client, "SOCIAL", social_risk, creation_date)
            createRisk(self, uuid.uuid4(), client, "EDUCAT", educat_risk, creation_date)

            client.save()

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

        createClient(self, "1", "Dan", "Nylah", "M", "#1", "555-0001")
        createClient(self, "2", "Blaise", "Georg", "F", "#2", "555-0002")
        createClient(self, "3", "Carol", "Yaumuna", "F", "#3", "555-0003")
        createClient(self, "4", "Aravind", "Bartolome", "M", "#4", "555-0004")
        createClient(self, "5", "Ana", "Sofia", "F", "#5", "555-0005")
        createClient(self, "6", "Edgar", "Hirah", "M", "#6", "555-0006")
        createClient(self, "7", "Okan", "Alvis", "M", "#7", "555-0007")
        createClient(self, "8", "Beatrix", "Adem", "F", "#8", "555-0008", "Epilepsy")
        createClient(self, "9", "Rigel", "Lachlan", "M", "#9", "555-0009", "Dementia")

        clients = models.Client.objects.all()

        risk_types = ["HEALTH", "SOCIAL", "EDUCAT"]

        for client in clients:
            num_risks = random.choice(range(1, 3))

            for x in range(num_risks):
                type = random.choice(risk_types)

                createRisk(
                    self,
                    uuid.uuid4(),
                    client,
                    type,
                    random.choice(getDifferentRisk(self, client, type)),
                    random.randint(
                        getYearTimestamp(self, 2019, x * 100),
                        getYearTimestamp(self, 2019, (x + 1) * 100),
                    ),
                )

        self.stdout.write(self.style.SUCCESS("Clients successfully created!"))
