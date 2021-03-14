from django.core import management
from django.core.management.base import BaseCommand
from cbr_api import models
import time


class Command(BaseCommand):
    def handle(self, *args, **options):
        management.call_command("seedzones")
        management.call_command("seeddisabilities")
        management.call_command("seedusers")
        management.call_command("seedclients")
        management.call_command("seedvisits")
