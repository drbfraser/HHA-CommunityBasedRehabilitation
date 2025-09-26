from cbr_api.models import (
    Client,
    ClientRisk,
    Disability,
    GoalOutcomes,
    RiskLevel,
    RiskType,
    UserCBR,
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
    **kwargs
):
    data = dict(
        id=uuid.uuid4(),
        user_id=user,
        created_at=created_at,
        first_name=first,
        last_name=last,
        phone_number=contact,
        zone=zone,
        gender=gender,
        birth_date=birth_date,
        longitude=longitude,
        latitude=latitude,
        village=village,
    )
    data.update(kwargs)
    return Client.objects.create(**data)


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
