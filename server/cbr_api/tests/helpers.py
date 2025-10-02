from datetime import datetime, timedelta, timezone
from cbr_api.models import (
    Client,
    ClientRisk,
    GoalOutcomes,
    Referral,
    RiskLevel,
    RiskType,
    UserCBR,
    Visit,
    Zone,
)
from rest_framework.test import APITestCase, APIClient
import uuid


def create_client(
    *,
    user,
    first,
    last,
    contact,
    zone,
    gender,
    created_at=0,
    birth_date=0,
    longitude=0.0,
    latitude=0.0,
    village="",
    hcr_type=Client.HCRType.NOT_SET,
    is_active=True,
    **kwargs,
):
    data = dict(
        id=uuid.uuid4(),
        user_id=user,
        created_at=created_at,
        first_name=first,
        last_name=last,
        full_name=f"{first} {last}",
        phone_number=contact,
        zone=zone,
        gender=gender,
        birth_date=birth_date,
        longitude=longitude,
        latitude=latitude,
        village=village,
        hcr_type=hcr_type,
        is_active=is_active,
    )
    data.update(kwargs)
    return Client.objects.create(**data)


def create_visit(
    *,
    client,
    user,
    zone,
    created_at,
    health=False,
    educat=False,
    social=False,
    nutrit=False,
    mental=False,
    longitude=0.0,
    latitude=0.0,
    village="",
):
    """
    Creates a Visit with required fields and optional *_visit flags.
    """
    return Visit.objects.create(
        id=uuid.uuid4(),
        client_id=client,
        user_id=user,
        created_at=created_at,
        server_created_at=0,
        health_visit=health,
        educat_visit=educat,
        social_visit=social,
        nutrit_visit=nutrit,
        mental_visit=mental,
        longitude=longitude,
        latitude=latitude,
        zone=zone,
        village=village,
    )


# setup for RiskList and RiskDetail view tests
class RiskViewsTestCase(APITestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create_user(
            username="root",
            password="root",
            zone=self.zone.id,
        )
        self.client = create_client(
            user=self.user,
            first="John",
            last="Doe",
            contact="1234567890",
            zone=self.zone,
            gender=Client.Gender.MALE,
        )

        # test risks for view tests
        self.risk1 = ClientRisk.objects.create(
            id=uuid.uuid4(),
            client_id=self.client,
            risk_type=RiskType.HEALTH,
            risk_level=RiskLevel.LOW,
            goal_name="Health Check",
            goal_status=GoalOutcomes.ONGOING,
            timestamp=1640995200,  # 2022-01-01
            server_created_at=1640995200,
        )
        self.risk2 = ClientRisk.objects.create(
            id=uuid.uuid4(),
            client_id=self.client,
            risk_type=RiskType.EDUCAT,
            risk_level=RiskLevel.MEDIUM,
            goal_name="Education Support",
            goal_status=GoalOutcomes.CANCELLED,
            timestamp=1641081600,  # 2022-01-02
            server_created_at=1641081600,
        )
        # for requests
        self.client_api = APIClient()
        self.client_api.force_authenticate(user=self.user)


# helper function to get valid client creation data in test_client_create_serializer.py
def get_valid_client_data(zone, d1, d2):
    return {
        "first_name": "Jane",
        "last_name": "Smith",
        "birth_date": 19900101,
        "gender": Client.Gender.FEMALE,
        "phone_number": "604-555-9876",
        "disability": [d1.id, d2.id],
        "other_disability": "Custom disability description",
        "longitude": -123.1207,
        "latitude": 49.2827,
        "zone": zone.id,
        "village": "Test Village",
        "hcr_type": Client.HCRType.HOST_COMMUNITY,
        "caregiver_name": "John Smith",
        "caregiver_present": True,
        "caregiver_phone": "604-555-1111",
        "caregiver_email": "caregiver@example.com",
        "health_risk": {
            "risk_level": RiskLevel.HIGH,
            "requirement": "Medical attention needed",
            "goal_name": "Improve health status",
            "goal_status": GoalOutcomes.ONGOING,
        },
        "social_risk": {
            "risk_level": RiskLevel.MEDIUM,
            "requirement": "Social support needed",
            "goal_name": "Build social connections",
            "goal_status": GoalOutcomes.NOT_SET,
        },
        "educat_risk": {
            "risk_level": RiskLevel.LOW,
            "requirement": "Educational support",
            "goal_name": "Complete primary education",
            "goal_status": GoalOutcomes.ONGOING,
        },
        "nutrit_risk": {
            "risk_level": RiskLevel.MEDIUM,
            "requirement": "Nutritional support",
            "goal_name": "Improve nutrition",
            "goal_status": GoalOutcomes.NOT_SET,
        },
        "mental_risk": {
            "risk_level": RiskLevel.LOW,
            "requirement": "Mental health support",
            "goal_name": "Improve mental wellbeing",
            "goal_status": GoalOutcomes.CONCLUDED,
        },
    }


# these static methods are used in test_detailed_visit_serializer.py
class DetailedVisitSerializerTestsHelper:
    @staticmethod
    def mock_request(user):
        return type("MockRequest", (), {"user": user})()

    @staticmethod
    def base_visit_payload(client_id, zone):
        # Provide the minimum valid visit payload for your model.
        # Toggle the *_visit flags as your model requires (booleans).
        return {
            "client_id": client_id,  # DRF usually accepts pk
            "health_visit": True,
            "educat_visit": False,
            "social_visit": False,
            "nutrit_visit": False,
            "mental_visit": False,
            "longitude": 12.34,
            "latitude": 56.78,
            "zone": zone,
            "village": "village x",
            # improvements intentionally omitted in some tests
        }

    @staticmethod
    def improvement(risk_type="HEALTH", provided="", desc=""):
        return {"risk_type": risk_type, "provided": provided, "desc": desc}


# helper setup for test_admin_stats_view.py
class AdminStatsSetUp(APITestCase):
    def ms(self, dt: datetime) -> int:
        return int(dt.timestamp() * 1000)

    def years_ago_ms(self, years: int) -> int:
        return self.ms(
            datetime.now(timezone.utc) - timedelta(days=365 * years + years // 4)
        )

    def setUp(self):
        # create zones
        self.z1 = Zone.objects.create(zone_name="BidiBidi Zone 1")
        self.z2 = Zone.objects.create(zone_name="BidiBidi Zone 2")
        self.user = UserCBR.objects.create_user(
            username="root",
            password="root",
            zone=self.z1.id,
        )

        now_ms = self.ms(datetime.now(timezone.utc))
        # Clients (2 adults host in z1, 2 children split z2)
        self.c_host_m_adult = create_client(
            user=self.user,
            first="Host",
            last="MAdult",
            contact="",
            zone=self.z1,
            gender=Client.Gender.MALE,
            hcr_type=Client.HCRType.HOST_COMMUNITY,
            birth_date=self.years_ago_ms(30),
            created_at=now_ms,
            is_active=True,
        )
        self.c_host_f_adult = create_client(
            user=self.user,
            first="Host",
            last="FAdult",
            contact="",
            zone=self.z1,
            gender=Client.Gender.FEMALE,
            hcr_type=Client.HCRType.HOST_COMMUNITY,
            birth_date=self.years_ago_ms(25),
            created_at=now_ms,
            is_active=True,
        )
        self.c_refugee_m_child = create_client(
            user=self.user,
            first="Ref",
            last="MChild",
            contact="",
            zone=self.z2,
            gender=Client.Gender.MALE,
            hcr_type=Client.HCRType.REFUGEE,
            birth_date=self.years_ago_ms(12),
            created_at=now_ms,
            is_active=True,
        )
        self.c_host_f_child = create_client(
            user=self.user,
            first="Host",
            last="FChild",
            contact="",
            zone=self.z2,
            gender=Client.Gender.FEMALE,
            hcr_type=Client.HCRType.HOST_COMMUNITY,
            birth_date=self.years_ago_ms(6),
            created_at=now_ms,
            is_active=True,
        )

        # Visits
        create_visit(
            client=self.c_host_m_adult,
            user=self.user,
            zone=self.z1,
            created_at=now_ms,
            health=True,
        )
        create_visit(
            client=self.c_host_m_adult,
            user=self.user,
            zone=self.z1,
            created_at=now_ms,
            health=True,
        )
        create_visit(
            client=self.c_host_f_adult,
            user=self.user,
            zone=self.z1,
            created_at=now_ms,
            social=True,
        )
        create_visit(
            client=self.c_refugee_m_child,
            user=self.user,
            zone=self.z2,
            created_at=now_ms,
            health=True,
        )
        create_visit(
            client=self.c_refugee_m_child,
            user=self.user,
            zone=self.z2,
            created_at=now_ms,
            health=True,
        )
        create_visit(
            client=self.c_refugee_m_child,
            user=self.user,
            zone=self.z2,
            created_at=now_ms,
            health=True,
        )
        create_visit(
            client=self.c_host_f_child,
            user=self.user,
            zone=self.z2,
            created_at=now_ms,
            mental=True,
        )

        Referral.objects.create(
            id=uuid.uuid4(),
            user_id=self.user,
            client_id=self.c_host_m_adult,
            date_referred=now_ms,
            resolved=True,
            outcome="ok",
        )
        Referral.objects.create(
            id=uuid.uuid4(),
            user_id=self.user,
            client_id=self.c_host_f_adult,
            date_referred=now_ms,
            resolved=False,
            outcome="tbd",
        )
