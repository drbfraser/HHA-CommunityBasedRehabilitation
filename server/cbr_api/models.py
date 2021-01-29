from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Zone(models.Model):
    zone_name = models.CharField(max_length=200)

class Disability(models.Model):
    disability_type = models.CharField(max_length=200)

class Client(models.Model):
    client_id = models.PositiveIntegerField(primary_key=True)
    public_id = models.PositiveIntegerField(unique=True)
    longitude = models.DecimalField(max_digits=22, decimal_places=16)
    latitude = models.DecimalField(max_digits=22, decimal_places=16)
    zone = models.ForeignKey(Zone, on_delete=models.PROTECT)
    village_name = models.CharField(max_length=200)
    birth_date = models.BigIntegerField()
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    gender = models.BooleanField()
    register_date = models.BigIntegerField()
    contact_number = models.CharField(max_length=200)

class Junction(models.Model):
    disability = models.ForeignKey(Disability, on_delete=models.CASCADE) 
    client = models.ForeignKey(Client, on_delete=models.CASCADE)