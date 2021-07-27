import os
import time

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from cbr import settings
from cbr_api.storage import OverwriteStorage


class Zone(models.Model):
    zone_name = models.CharField(max_length=50, unique=True)


class Disability(models.Model):
    disability_type = models.CharField(max_length=50, unique=True)


class UserCBRManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        extra_fields["zone"] = Zone.objects.get(id=extra_fields["zone"])

        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username, password, **extra_fields):
        self.create_user(username, password, **extra_fields)


class UserCBR(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        ADMIN = "ADM", _("Admin")
        WORKER = "WRK", _("CBR Worker")
        CLINICIAN = "CLN", _("Clinician")

    username_validator = UnicodeUsernameValidator()

    username = models.CharField(
        _("username"),
        max_length=50,
        unique=True,
        validators=[username_validator],
    )
    first_name = models.CharField(_("first name"), max_length=50)
    last_name = models.CharField(_("last name"), max_length=50)
    zone = models.ForeignKey(Zone, on_delete=models.PROTECT)
    phone_number = models.CharField(max_length=50, blank=True)
    role = models.CharField(max_length=3, choices=Role.choices, default=Role.WORKER)
    is_active = models.BooleanField(
        _("active"),
        default=True,
    )
    created_date = models.BigIntegerField(_("date created"), default=time.time)

    objects = UserCBRManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
        "zone",
        "role",
    ]

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")
        swappable = "AUTH_USER_MODEL"


class RiskType(models.TextChoices):
    HEALTH = "HEALTH", _("Health")
    SOCIAL = "SOCIAL", _("Social")
    EDUCAT = "EDUCAT", _("Education")

    def getField():
        return models.CharField(
            max_length=6, choices=RiskType.choices, default="HEALTH"
        )


class RiskLevel(models.TextChoices):
    LOW = "LO", _("Low")
    MEDIUM = "ME", _("Medium")
    HIGH = "HI", _("High")
    CRITICAL = "CR", _("Critical")

    def getField():
        return models.CharField(max_length=2, choices=RiskLevel.choices, default="LO")


class Client(models.Model):
    class Gender(models.TextChoices):
        MALE = "M", _("Male")
        FEMALE = "F", _("Female")

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    full_name = models.CharField(max_length=101, default="")

    birth_date = models.BigIntegerField()
    gender = models.CharField(max_length=1, choices=Gender.choices)
    phone_number = models.CharField(
        max_length=50, blank=True
    )  # if contact info available
    disability = models.ManyToManyField(Disability)
    other_disability = models.CharField(max_length=100, blank=True)
    created_by_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT
    )
    created_date = models.BigIntegerField()
    modified_date = models.BigIntegerField()
    longitude = models.DecimalField(max_digits=12, decimal_places=6)
    latitude = models.DecimalField(max_digits=12, decimal_places=6)
    zone = models.ForeignKey(Zone, on_delete=models.PROTECT)
    village = models.CharField(max_length=50)

    def rename_file(self, original_filename):
        upload_dir = "images"
        extension = original_filename.split(".")[-1]

        new_filename = f"client-{self.pk}.{extension}"
        return os.path.join(upload_dir, new_filename)

    picture = models.ImageField(
        upload_to=rename_file, storage=OverwriteStorage(), blank=True
    )  # if picture available
    caregiver_present = models.BooleanField(default=False)

    # ------if caregiver present-----
    caregiver_name = models.CharField(max_length=101, blank=True)
    caregiver_phone = models.CharField(max_length=50, blank=True)
    caregiver_email = models.CharField(max_length=50, blank=True)
    caregiver_picture = models.ImageField(upload_to="images/", blank=True)

    # summary data to make queries more reasonable
    health_risk_level = RiskLevel.getField()
    social_risk_level = RiskLevel.getField()
    educat_risk_level = RiskLevel.getField()
    last_visit_date = models.BigIntegerField(default=0)

    def save(self, *args, **kwargs):
        self.modified_date = int(time.time())
        super().save(*args, **kwargs)


class ClientRisk(models.Model):
    client = models.ForeignKey(Client, related_name="risks", on_delete=models.CASCADE)
    timestamp = models.BigIntegerField()
    risk_type = RiskType.getField()
    risk_level = RiskLevel.getField()
    requirement = models.TextField()
    goal = models.TextField()


class Visit(models.Model):
    client = models.ForeignKey(Client, related_name="visits", on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="visits", on_delete=models.PROTECT
    )
    date_visited = models.BigIntegerField()
    health_visit = models.BooleanField(default=False)
    educat_visit = models.BooleanField(default=False)
    social_visit = models.BooleanField(default=False)
    longitude = models.DecimalField(max_digits=22, decimal_places=16)
    latitude = models.DecimalField(max_digits=22, decimal_places=16)
    zone = models.ForeignKey(Zone, on_delete=models.PROTECT)
    village = models.CharField(max_length=50)


class Referral(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    date_referred = models.BigIntegerField()
    date_resolved = models.BigIntegerField(default=0)
    resolved = models.BooleanField(default=False)
    outcome = models.CharField(max_length=100)

    client = models.ForeignKey(
        Client, related_name="referrals", on_delete=models.CASCADE
    )
    picture = models.ImageField(upload_to="images/", blank=True)

    class Experience(models.TextChoices):
        BASIC = "BAS", _("Basic")
        INTERMEDIATE = "INT", _("Intermediate")

    wheelchair = models.BooleanField(default=False)
    wheelchair_experience = models.CharField(
        max_length=3, choices=Experience.choices, blank=True
    )
    hip_width = models.IntegerField(default=0)
    wheelchair_owned = models.BooleanField(default=False)
    wheelchair_repairable = models.BooleanField(default=False)

    physiotherapy = models.BooleanField(default=False)
    condition = models.CharField(max_length=100, blank=True)

    class InjuryLocation(models.TextChoices):
        BELOW = "BEL", _("Below")
        ABOVE = "ABO", _("Above")

    prosthetic = models.BooleanField(default=False)
    prosthetic_injury_location = models.CharField(
        max_length=3, choices=InjuryLocation.choices, blank=True
    )

    orthotic = models.BooleanField(default=False)
    orthotic_injury_location = models.CharField(
        max_length=3, choices=InjuryLocation.choices, blank=True
    )

    services_other = models.CharField(max_length=100, blank=True)


class Outcome(models.Model):
    class Goal(models.TextChoices):
        CANCELLED = "CAN", _("Cancelled")
        ONGOING = "GO", _("Ongoing")
        CONCLUDED = "CON", _("Concluded")

    visit = models.ForeignKey(Visit, related_name="outcomes", on_delete=models.CASCADE)
    risk_type = RiskType.getField()
    goal_met = models.CharField(max_length=3, choices=Goal.choices)
    outcome = models.TextField(blank=True)


class Improvement(models.Model):
    visit = models.ForeignKey(
        Visit, related_name="improvements", on_delete=models.CASCADE
    )
    risk_type = RiskType.getField()
    provided = models.CharField(max_length=50)
    desc = models.TextField()


class BaselineSurvey(models.Model):
    client = models.ForeignKey(
        Client, related_name="baseline_surveys", on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="baselinesurveys",
        on_delete=models.PROTECT,
    )
    survey_date = models.BigIntegerField()

    class Ratings(models.TextChoices):
        VERY_POOR = "VP", _("Very Poor")
        POOR = "P", _("Poor")
        FINE = "F", _("Fine")
        GOOD = "G", _("Good")

    class AssistiveDevices(models.TextChoices):
        WHEELCHAIR = "WC", _("Wheelchair")
        PROSTHETIC = "PR", _("Prosthetic")
        ORTHOTIC = "OR", _("Orthotic")
        CRUTCH = "CR", _("Crutch")
        WALKING_STICK = "WS", _("Walking Stick")
        HEARING_AID = "HA", _("Hearing Aid")
        GLASSES = "GL", _("Glasses")
        STANDING_FRAME = "SF", _("Standing Frame")
        CORNER_SEAT = "CS", _("Corner Seat")

    # Health
    health = models.CharField(max_length=2, choices=Ratings.choices)
    health_have_rehabilitation_access = models.BooleanField()
    health_need_rehabilitation_access = models.BooleanField()
    health_have_assistive_device = models.BooleanField()
    health_working_assistive_device = models.BooleanField()
    health_need_assistive_device = models.BooleanField()
    health_assistive_device_type = models.CharField(
        max_length=2, choices=AssistiveDevices.choices, blank=True
    )
    health_services_satisfaction = models.CharField(
        max_length=2, choices=Ratings.choices
    )

    class SchoolBarriers(models.TextChoices):
        LACK_FUNDING = "LF", _("Lack Funding")
        DISABILITY = "D", _("Disability")
        OTHER = "O", _("Other")

    # Education (under 18)
    school_currently_attend = models.BooleanField()
    school_grade = models.IntegerField(blank=True)
    school_not_attend_reason = models.CharField(
        max_length=2, choices=SchoolBarriers.choices, blank=True
    )
    school_ever_attend = models.BooleanField()
    school_want_attend = models.BooleanField()

    # Social
    social_community_valued = models.BooleanField()
    social_independent = models.BooleanField()
    social_able_participate = models.BooleanField()
    social_affected_by_disability = models.BooleanField()
    social_discrimination = models.BooleanField()

    class Employment(models.TextChoices):
        EMPLOYED = "EMPL", _("Employed")
        SELF_EMPLOYED = "SEMPL", _("Self-Employed")

    # Livelihood
    work = models.BooleanField()
    work_what = models.CharField(max_length=50, blank=True)
    work_status = models.CharField(max_length=5, choices=Employment.choices, blank=True)
    work_meet_financial_needs = models.BooleanField()
    work_affected_by_disability = models.BooleanField()
    work_want = models.BooleanField()

    class Nourishment(models.TextChoices):
        MALNOURISHED = "M", _("Malnourished")
        UNDERNOURISHED = "U", _("Undernourished")
        WELLNOURISHED = "W", _("Well-nourished")

    # Food and Nutrition
    food_security = models.CharField(max_length=2, choices=Ratings.choices)
    food_enough_monthly = models.BooleanField()
    food_enough_for_child = models.CharField(
        max_length=1, choices=Nourishment.choices, blank=True
    )

    # Empowerment
    empowerment_organization_member = models.BooleanField()
    empowerment_organization = models.CharField(max_length=50, blank=True)
    empowerment_rights_awareness = models.BooleanField()
    empowerment_influence_others = models.BooleanField()

    # Shelter and Care
    shelter_adequate = models.BooleanField()
    shelter_essential_access = models.BooleanField()
