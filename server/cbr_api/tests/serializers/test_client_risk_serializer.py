from django.test import TestCase
from cbr_api.serializers import ClientRiskSerializer
from cbr_api.models import (
    Client,
    UserCBR,
    Zone,
    ClientRisk,
    RiskType,
    RiskLevel,
    RiskChangeType,
    GoalOutcomes,
)
from cbr_api.tests.helpers import create_client
import uuid


class ClientRiskSerializerTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.super_user = UserCBR.objects.create(
            username="root",
            password="root",
            is_superuser=True,
            zone=self.zone,
        )
        self.client = create_client(
            user=self.super_user,
            first="John",
            last="Doe",
            gender=Client.Gender.MALE,
            contact="604-555-0000",
            zone=self.zone,
        )

    def test_change_type_is_read_only_on_input(self):
        data = {
            "id": str(uuid.uuid4()),
            "client_id": self.client.id,
            "timestamp": 1234567890,
            "risk_type": RiskType.HEALTH,
            "risk_level": RiskLevel.HIGH,
            "change_type": RiskChangeType.BOTH,
        }

        serializer = ClientRiskSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertNotIn("change_type", serializer.validated_data)

        risk = serializer.save()
        self.assertEqual(risk.change_type, RiskChangeType.INITIAL)

    def test_serialization_includes_change_type(self):
        risk = ClientRisk.objects.create(
            id=str(uuid.uuid4()),
            client_id=self.client,
            timestamp=1111111111,
            risk_type=RiskType.SOCIAL,
            risk_level=RiskLevel.MEDIUM,
            change_type=RiskChangeType.RISK_LEVEL,
        )

        serializer = ClientRiskSerializer(risk)
        self.assertIn("change_type", serializer.data)
        self.assertEqual(serializer.data["change_type"], RiskChangeType.RISK_LEVEL)

    def test_start_date_auto_set_when_created_via_serializer(self):
        data = {
            "id": str(uuid.uuid4()),
            "client_id": self.client.id,
            "timestamp": 2222222222,
            "risk_type": RiskType.HEALTH,
            "risk_level": RiskLevel.LOW,
            # omit start_date to let model set it
        }

        serializer = ClientRiskSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        risk = serializer.save()
        self.assertEqual(risk.start_date, 2222222222)

    def test_cancelled_goal_status_sets_end_date_on_create(self):
        data = {
            "id": str(uuid.uuid4()),
            "client_id": self.client.id,
            "timestamp": 3333333333,
            "risk_type": RiskType.EDUCAT,
            "risk_level": RiskLevel.CRITICAL,
            "goal_status": GoalOutcomes.CANCELLED,
            "cancellation_reason": "Moved away",
        }

        serializer = ClientRiskSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        risk = serializer.save()

        # end_date should be set by model.save()
        self.assertNotEqual(risk.end_date, 0)
        self.assertEqual(risk.cancellation_reason, "Moved away")
