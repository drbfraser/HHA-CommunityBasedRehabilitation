from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class Zone(models.Model):
    zone_name = models.CharField(max_length=50)


class Disability(models.Model):
    disability_type = models.CharField(max_length=50)


class RiskType(models.TextChoices):
    HEALTH = "HEALTH", _("Health")
    SOCIAL = "SOCIAL", _("Social")
    EDUCATION = "EDUCAT", _("Education")

    def getField():
        return models.CharField(
            max_length=6, choices=RiskType.choices, default="HEALTH"
        )


class Client(models.Model):
    class Gender(models.TextChoices):
        MALE = "M", _("Male")
        FEMALE = "F", _("Female")

    created_by_user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    client_id = models.PositiveIntegerField(primary_key=True)
    birth_date = models.BigIntegerField()
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    gender = models.CharField(max_length=1, choices=Gender.choices)
    register_date = models.BigIntegerField()
    phone_number = models.CharField(
        max_length=50, blank=True
    )  # if contact info available
    longitude = models.DecimalField(max_digits=12, decimal_places=6)
    latitude = models.DecimalField(max_digits=12, decimal_places=6)
    zone = models.ForeignKey(Zone, on_delete=models.PROTECT)
    village = models.CharField(max_length=50)
    picture = models.ImageField(upload_to="images/", blank=True)  # if picture available
    caregiver_present = models.BooleanField(default=False)
    # ------if caregiver present-----
    caregiver_phone = models.CharField(max_length=50, blank=True)
    caregiver_email = models.CharField(max_length=50, blank=True)
    caregiver_picture = models.ImageField(upload_to="images/", blank=True)
    # ------if caregiver present-----


class ClientRisk(models.Model):
    class RiskLevel(models.TextChoices):
        LOW = "LO", _("Low")
        MEDIUM = "ME", _("Medium")
        HIGH = "HI", _("High")
        CRITICAL = "CR", _("Critical")

    client_id = models.ForeignKey(Client, on_delete=models.CASCADE)
    timestamp = models.BigIntegerField()
    risk_type = RiskType.getField()
    risk_level = models.CharField(max_length=2, choices=RiskLevel.choices)
    requirement = models.TextField()
    goal = models.TextField()


class DisabilityJunction(models.Model):
    disability = models.ForeignKey(Disability, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)


class UserCBR(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE)
    zone = models.ForeignKey(Zone, on_delete=models.PROTECT)
    phone_number = models.CharField(max_length=50)


class Visit(models.Model):
    class Purpose(models.TextChoices):
        CBR = "CBR", _("Community Based Rehabilitation")
        REFERRAL = "REF", _("Disability Centre Referral")
        FOLLOWUP = "FOL", _("Referral Follow-Up")

    visit_id = models.PositiveIntegerField(primary_key=True)
    client_id = models.ForeignKey(Client, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    date_visited = models.BigIntegerField()
    purpose = models.CharField(max_length=3, choices=Purpose.choices)
    longitude = models.DecimalField(max_digits=22, decimal_places=16)
    latitude = models.DecimalField(max_digits=22, decimal_places=16)
    zone = models.ForeignKey(Zone, on_delete=models.PROTECT)
    village = models.CharField(max_length=50)


class Outcome(models.Model):
    class Goal(models.TextChoices):
        CANCELLED = "CAN", _("Cancelled")
        ONGOING = "GO", _("Ongoing")
        CONCLUDED = "CON", _("Concluded")

    visit = models.ForeignKey(Visit, on_delete=models.CASCADE)
    risk_type = RiskType.getField()
    goal_met = models.CharField(max_length=3, choices=Goal.choices)
    outcome = models.TextField(blank=True)


class Improvement(models.Model):
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE)
    risk_type = RiskType.getField()
    provided = models.CharField(max_length=50)
    desc = models.TextField()
