from django.test import TestCase
from cbr_api.models import (
    Client,
    UserCBR,
    Zone,
    ClientRisk,
    RiskType,
    RiskLevel,
    GoalOutcomes,
    RiskChangeType,
)
from cbr_api.serializers import NormalRiskSerializer
from cbr_api.tests.helpers import create_client
import uuid


class NormalRiskSerializerTests(TestCase):
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
            first="Jane",
            last="Smith",
            gender=Client.Gender.FEMALE,
            contact="604-555-7676",
            zone=self.zone,
        )

    def test_goal_status_update(self):
        # Create initial risk object
        ClientRisk.objects.create(
            id=uuid.uuid4(),
            client_id=self.client,
            risk_type=RiskType.HEALTH,
            risk_level=RiskLevel.LOW,
            timestamp=1,
            server_created_at=1,
        )
        # Prepare data for serializer
        data = {
            "client_id": self.client.id,
            "risk_type": RiskType.HEALTH,
            "risk_level": RiskLevel.LOW,
            "goal_status": GoalOutcomes.ONGOING,
        }
        serializer = NormalRiskSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        risk = serializer.save()

        self.client.refresh_from_db()
        # client should have same risk level but goal status should be updated to "GO"
        self.assertEqual(self.client.health_risk_level, RiskLevel.LOW)
        self.assertEqual(risk.goal_status, GoalOutcomes.ONGOING)
        # change_type should be "GS" for goal status updates
        self.assertEqual(risk.change_type, RiskChangeType.GOAL_STATUS)

    def test_initial_risk(self):
        # no previous risk exists, so this should create a new risk with goal_status "NS"
        data = {
            "client_id": self.client.id,
            "risk_type": RiskType.HEALTH,
            "risk_level": RiskLevel.LOW,
        }
        serializer = NormalRiskSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        risk = serializer.save()

        self.client.refresh_from_db()
        # client should have risk level set to "NA" since there is no goal
        self.assertEqual(self.client.health_risk_level, RiskLevel.NOT_ACTIVE)
        self.assertEqual(risk.goal_status, GoalOutcomes.NOT_SET)
        # change_type should be INITIAL for the first risk
        self.assertEqual(risk.change_type, RiskChangeType.INITIAL)

    def test_risk_level_update(self):
        ClientRisk.objects.create(
            id=uuid.uuid4(),
            client_id=self.client,
            risk_type=RiskType.HEALTH,
            risk_level=RiskLevel.LOW,
            timestamp=1,
            server_created_at=1,
        )
        # New risk with changed risk_level
        data = {
            "client_id": self.client.id,
            "risk_type": RiskType.HEALTH,
            "risk_level": RiskLevel.MEDIUM,
        }
        serializer = NormalRiskSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        risk = serializer.save()

        self.client.refresh_from_db()
        # client's health risk level should still be "NA" since there is no goal
        self.assertEqual(self.client.health_risk_level, RiskLevel.NOT_ACTIVE)
        self.assertEqual(risk.goal_status, GoalOutcomes.NOT_SET)
        # change_type should be "RL" for risk level changes
        self.assertEqual(risk.change_type, RiskChangeType.RISK_LEVEL)

    def test_both_update(self):
        # when both risk level and goal status are updated
        ClientRisk.objects.create(
            id=uuid.uuid4(),
            client_id=self.client,
            risk_type=RiskType.HEALTH,
            risk_level=RiskLevel.LOW,
            timestamp=1,
            server_created_at=1,
        )
        data = {
            "client_id": self.client.id,
            "risk_type": RiskType.HEALTH,
            "risk_level": RiskLevel.MEDIUM,
            "goal_status": GoalOutcomes.ONGOING,
        }
        serializer = NormalRiskSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        risk = serializer.save()

        self.client.refresh_from_db()
        # client's health risk level should be "ME" since there is an active goal
        self.assertEqual(self.client.health_risk_level, RiskLevel.MEDIUM)
        self.assertEqual(risk.goal_status, GoalOutcomes.ONGOING)
        self.assertEqual(risk.change_type, RiskChangeType.BOTH)
