from cbr_api.models import (
    Client,
    ClientRisk,
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
            is_superuser=True,
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
            goal_status=GoalOutcomes.ONGOING,
            timestamp=1640995200,  # 2022-01-01
            server_created_at=1640995200,
        )
        self.risk2 = ClientRisk.objects.create(
            id=uuid.uuid4(),
            client_id=self.client,
            risk_type=RiskType.EDUCAT,
            risk_level=RiskLevel.MEDIUM,
            goal_status=GoalOutcomes.NOT_SET,
            timestamp=1641081600,  # 2022-01-02
            server_created_at=1641081600,
        )
        # for requests
        self.client_api = APIClient()
        self.client_api.force_authenticate(user=self.user)
