from django.core.management.base import BaseCommand
from cbr_api import models
import time
import random


class Command(BaseCommand):
    def handle(self, *args, **options):
        results = ["CAN", "GO", "CON"]
        risks = ["LO", "ME", "HI", "CR"]
        outcomes = [
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
        disabilities = models.Disability.objects.all()

        def getYearTimestamp(self, year):
            return (year - 1970) * (60 * 60 * 24 * 365)

        def createImprovement(self, visit, type):
            return models.Improvement.objects.create(
                visit=visit,
                risk_type=type,
                provided=random.choice(provides),
                desc="Provided the client with additional services and assistance to improve their health, social, and educational conditions.",
            )

        def createOutcome(self, visit, type):
            return models.Outcome.objects.create(
                visit=visit,
                risk_type=type,
                goal_met=random.choice(results),
                outcome=random.choice(outcomes),
            )

        def createVisit(self, health, social, educat, type, village):
            visit = models.Visit.objects.create(
                user=random.choice(users),
                client=random.choice(clients),
                date_visited=random.randint(
                    getYearTimestamp(self, 2019), getYearTimestamp(self, 2020)
                ),
                longitude=0.0,
                latitude=0.0,
                zone=random.choice(zones),
                village=village,
                health_visit=health,
                social_visit=social,
                educat_visit=educat,
            )
            visit.improvements.add(createImprovement(self, visit, type))
            visit.outcomes.add(createOutcome(self, visit, type))
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

        createVisit(self, True, False, False, "HEALTH", "#1")
        createVisit(self, False, True, False, "SOCIAL", "#2")
        createVisit(self, False, False, True, "EDUCAT", "#3")
        createVisit(self, True, False, False, "HEALTH", "#4")
        createVisit(self, False, True, False, "SOCIAL", "#5")
        createVisit(self, False, False, True, "EDUCAT", "#6")
        createVisit(self, True, False, False, "HEALTH", "#7")
        createVisit(self, False, True, False, "SOCIAL", "#8")
        createVisit(self, False, False, True, "EDUCAT", "#9")

        self.stdout.write(self.style.SUCCESS("Visits successfully created!"))
