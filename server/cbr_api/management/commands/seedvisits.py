import uuid
from django.core.management.base import BaseCommand
from cbr_api import models
import random


class Command(BaseCommand):
    def handle(self, *args, **options):
        outcomes_texts = [
            "Full Recovery",
            "Partial Recovery",
            "No Improvement",
            "Worsening Condition",
        ]
        provides = [
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
        clients = models.Client.objects.all()

        def getYearTimestamp(self, year):
            return ((year - 1970) * (60 * 60 * 24 * 365)) * 1000

        def createImprovement(self, visit, type, date):
            return models.Improvement.objects.create(
                id=uuid.uuid4(),
                visit_id=visit,
                risk_type=type,
                created_at=date,
                server_created_at=date,
                provided=random.choice(provides),
                desc="Provided the client with additional services and assistance to improve their health, social, educational, mental and nutritional conditions.",
            )

        def create_outcome_as_improvement(self, visit, type, date):
            return models.Improvement.objects.create(
                id=uuid.uuid4(),
                visit_id=visit,
                risk_type=type,
                created_at=date,
                server_created_at=date,
                provided="Outcome",
                desc=random.choice(outcomes_texts),
            )

        def create_visit(self, health, social, educat, nutrit, mental, type, village):
            client = random.choice(clients)

            date_visited = random.randint(
                max(getYearTimestamp(self, 2019), client.last_visit_date),
                getYearTimestamp(self, 2021),
            )

            client.last_visit_date = date_visited
            client.save()

            visit = models.Visit.objects.create(
                id=uuid.uuid4(),
                user_id=random.choice(users),
                client_id=client,
                created_at=date_visited,
                server_created_at=date_visited,
                longitude=0.0,
                latitude=0.0,
                zone=random.choice(zones),
                village=village,
                health_visit=health,
                social_visit=social,
                educat_visit=educat,
                nutrit_visit=nutrit,
                mental_visit=mental,
            )
            createImprovement(self, visit, type, date_visited)
            create_outcome_as_improvement(self, visit, type, date_visited)
            return visit

        if models.Visit.objects.all().count() > 0:
            self.stdout.write(self.style.ERROR("Visits have already been created!"))
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
        if models.Client.objects.all().count() == 0:
            self.stdout.write(
                self.style.ERROR(
                    "Clients have not been created! Run seedclients first!"
                )
            )
            return

        create_visit(self, True, False, False, False, False, "HEALTH", "#1")
        create_visit(self, False, True, False, False, False, "SOCIAL", "#2")
        create_visit(self, False, False, True, False, False, "EDUCAT", "#3")
        create_visit(self, False, False, False, True, False, "NUTRIT", "#4")
        create_visit(self, False, False, False, False, True, "MENTAL", "#5")

        create_visit(self, True, False, False, False, False, "HEALTH", "#6")
        create_visit(self, False, True, False, False, False, "SOCIAL", "#7")
        create_visit(self, False, False, True, False, False, "EDUCAT", "#8")
        create_visit(self, False, False, False, True, False, "NUTRIT", "#9")
        create_visit(self, False, False, False, False, True, "MENTAL", "#1")

        create_visit(self, True, False, False, False, False, "HEALTH", "#2")
        create_visit(self, False, True, False, False, False, "SOCIAL", "#3")
        create_visit(self, False, False, True, False, False, "EDUCAT", "#4")
        create_visit(self, False, False, False, True, False, "NUTRIT", "#5")
        create_visit(self, False, False, False, False, True, "MENTAL", "#6")

        self.stdout.write(self.style.SUCCESS("Visits successfully created!"))
