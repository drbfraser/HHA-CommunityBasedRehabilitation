from django.core.management.base import BaseCommand
from cbr_api import models


class Command(BaseCommand):
    def handle(self, *args, **options):
        if models.Disability.objects.all().count() > 0:
            self.stdout.write(self.style.ERROR("Disabilities have already been created"))
            return

        models.Disability.objects.create(disability_type="Amputee")
        models.Disability.objects.create(disability_type="Polio")
        models.Disability.objects.create(disability_type="Spinal cord injury")
        models.Disability.objects.create(disability_type="Cerebral palsy")
        models.Disability.objects.create(disability_type="Spina bifida")
        models.Disability.objects.create(disability_type="Hydrocephalus")
        models.Disability.objects.create(disability_type="Visual impairment")
        models.Disability.objects.create(disability_type="Hearing impairment")
        models.Disability.objects.create(disability_type="Don’t know")
        models.Disability.objects.create(disability_type="Other")

        self.stdout.write(self.style.SUCCESS("Disabilities successfully created!"))
