from django.db import models
from django.utils.translation import gettext_lazy as _

class Zone(models.Model):
    zone_name = models.CharField(max_length=200)

class Disability(models.Model):
    disability_type = models.CharField(max_length=200)

class Client(models.Model):
    client_id = models.PositiveIntegerField(primary_key=True)
    public_id = models.PositiveIntegerField(unique=True)
    birth_date = models.BigIntegerField()
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    gender = models.BooleanField()
    register_date = models.BigIntegerField()
    contact_number = models.CharField(max_length=200, blank=True) # if contact info available
    
    # updated whenever a visit form is submitted for this client
    current_longitude = models.DecimalField(max_digits=22, decimal_places=16)
    current_latitude = models.DecimalField(max_digits=22, decimal_places=16)
    current_zone = models.ForeignKey(Zone, on_delete=models.PROTECT)
    current_village = models.CharField(max_length=200)
    current_picture = models.ImageField(upload_to='images/', blank=True) # if picture available

class DisabilityJunction(models.Model):
    disability = models.ForeignKey(Disability, on_delete=models.CASCADE) 
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    
class User(models.Model):
    class UserType(models.TextChoices):
        WORKER = 'WRK', _('Worker')
        CLINICIAN = 'CLN', _('Clinician')
        ADMIN = 'ADM', _('Admin')

    user_id = models.PositiveIntegerField(primary_key=True)
    user_type = models.CharField(max_length=3, choices=UserType.choices)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    zone = models.ForeignKey(Zone, on_delete=models.PROTECT)
    phone_number = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    password = models.CharField(max_length=200) # To be changed: Add password hashing
    deactivated = models.BooleanField(default=False)

class Visit(models.Model):
    class Risk(models.TextChoices):
        LOW = 'LO', _('Low')
        MEDIUM = 'ME', _('Medium')
        HIGH = 'HI', _('High')
        CRITICAL = 'CR', _('Critical')
        
    class Purpose(models.TextChoices):
        CBR = 'CBR', _('Community Based Rehabilitation')
        REFERRAL = 'REF', _('Disability Centre Referral')
        FOLLOWUP = 'FOL', _('Referral Follow-Up')
        
    class Goal(models.TextChoices):
        CANCELLED = 'CAN', _('Cancelled')
        ONGOING = 'GO', _('Ongoing')
        CONCLUDED = 'CON', _('Concluded')
        
    visit_id = models.PositiveIntegerField(primary_key=True)
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    caregiver_present = models.BooleanField(default=False)
    caregiver_contact = models.CharField(max_length=200, blank=True) # if caregiver present
    date_visited = models.BigIntegerField()
    purpose = models.CharField(max_length=3, choices=Purpose.choices)
    
    # if purpose is CBR
    health_risk = models.CharField(max_length=2, choices=Risk.choices, blank=True)
    health_goal_met = models.CharField(max_length=3, choices=Goal.choices, blank=True)
    health_goal_outcome = models.CharField(max_length=500, blank=True)
    social_risk = models.CharField(max_length=2, choices=Risk.choices, blank=True)
    social_goal_met = models.CharField(max_length=3, choices=Goal.choices, blank=True)
    social_goal_outcome = models.CharField(max_length=500, blank=True)
    education_risk = models.CharField(max_length=2, choices=Risk.choices, blank=True)
    education_goal_met = models.CharField(max_length=3, choices=Goal.choices, blank=True)
    education_goal_outcome = models.CharField(max_length=500, blank=True)
    
    # these values will be copied to the client
    visit_longitude = models.DecimalField(max_digits=22, decimal_places=16)
    visit_latitude = models.DecimalField(max_digits=22, decimal_places=16)
    visit_zone = models.ForeignKey(Zone, on_delete=models.PROTECT)
    visit_village = models.CharField(max_length=200)
    visit_picture = models.ImageField(upload_to='images/', blank=True) # if picture available
    
class Improvement(models.Model):
    improvement_type = models.CharField(max_length=200)
    improvement_desc = models.CharField(max_length=500)
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE)
    