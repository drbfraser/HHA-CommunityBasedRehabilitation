from django.core.management.base import BaseCommand
from cbr_api import models
import time
import random


class Command(BaseCommand):
    def handle(self, *args, **options):
        outcomes = ["CAN", "GO", "CON"]
        risks = ["LO", "ME", "HI", "CR"]
        zones = models.Zone.objects.all()
        users = models.UserCBR.objects.all()
        clients = models.Client.objects.all()
        disabilities = models.Disability.objects.all()

        def createImprovement(self, Visit, Type):
            return models.Improvement.objects.create(
                visit=Visit,
                risk_type=Type,
                provided="",
                desc="",
            )

        def createOutcome(self, Visit, Type):
            return models.Outcome.objects.create(
                visit=Visit,
                risk_type=Type,
                goal_met=random.choice(outcomes),
                outcome="",
            )

        def createVisit(self, Health, Social, Educat, Type, Village):
            visit = models.Visit.objects.create(
                user=random.choice(users),
                client=random.choice(clients),
                date_visited=int(time.time()),
                longitude=0.0,
                latitude=0.0,
                zone=random.choice(zones),
                village=Village,
                health_visit=Health,
                educat_visit=Social,
                social_visit=Educat,
            )
            visit.improvements.add(createImprovement(self, visit, Type))
            visit.outcomes.add(createOutcome(self, visit, Type))
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
