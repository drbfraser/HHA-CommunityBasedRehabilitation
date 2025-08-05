from django.test import TestCase
from unittest.mock import patch
from cbr_api.models import (
    Client,
    ClientRisk,
    GoalOutcomes,
    RiskLevel,
    RiskType,
    UserCBR,
    Zone,
)
from cbr_api.tests.helpers import get_valid_client_data
from cbr_api.serializers import ClientCreateSerializer


class ClientCreateSerializerTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create(
            username="testuser",
            password="testpass123",
            zone=self.zone,
        )

    @patch("cbr_api.serializers.current_milli_time")
    def test_create_client_with_all_risks(self, mock_time):
        mock_time.return_value = 1640995200000

        data = get_valid_client_data(self.zone)
        context = {"request": type("MockRequest", (), {"user": self.user})()}

        serializer = ClientCreateSerializer(data=data, context=context)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        client = serializer.save()

        # Verify client was created with correct data
        self.assertEqual(client.first_name, "Jane")
        self.assertEqual(client.last_name, "Smith")
        self.assertEqual(client.full_name, "Jane Smith")
        self.assertEqual(client.gender, Client.Gender.FEMALE)
        self.assertEqual(client.phone_number, "604-555-9876")
        self.assertEqual(client.zone, self.zone)
        self.assertEqual(client.village, "Test Village")
        self.assertEqual(client.user_id, self.user)
        self.assertEqual(client.hcr_type, Client.HCRType.HOST_COMMUNITY)

        # Verify risk levels were set on client
        self.assertEqual(client.health_risk_level, RiskLevel.HIGH)
        self.assertEqual(client.social_risk_level, RiskLevel.MEDIUM)
        self.assertEqual(client.educat_risk_level, RiskLevel.LOW)
        self.assertEqual(client.nutrit_risk_level, RiskLevel.MEDIUM)
        self.assertEqual(client.mental_risk_level, RiskLevel.LOW)

        # Verify timestamps were set
        self.assertEqual(client.health_timestamp, 1640995200000)
        self.assertEqual(client.social_timestamp, 1640995200000)
        self.assertEqual(client.educat_timestamp, 1640995200000)
        self.assertEqual(client.nutrit_timestamp, 1640995200000)
        self.assertEqual(client.mental_timestamp, 1640995200000)

        # Verify caregiver information
        self.assertEqual(client.caregiver_name, "John Smith")
        self.assertTrue(client.caregiver_present)
        self.assertEqual(client.caregiver_phone, "604-555-1111")
        self.assertEqual(client.caregiver_email, "caregiver@example.com")

        # is active is true by default
        self.assertTrue(client.is_active)

        # Verify all 5 risk records were created
        risks = ClientRisk.objects.filter(client_id=client)
        self.assertEqual(risks.count(), 5)

        # Verify specific risk records
        health_risk = risks.get(risk_type=RiskType.HEALTH)
        self.assertEqual(health_risk.risk_level, RiskLevel.HIGH)
        self.assertEqual(health_risk.requirement, "Medical attention needed")
        self.assertEqual(health_risk.goal, "Improve health status")
        self.assertEqual(health_risk.goal_status, GoalOutcomes.ONGOING)

        social_risk = risks.get(risk_type=RiskType.SOCIAL)
        self.assertEqual(social_risk.risk_level, RiskLevel.MEDIUM)
        self.assertEqual(social_risk.goal_status, GoalOutcomes.NOT_SET)

        educat_risk = risks.get(risk_type=RiskType.EDUCAT)
        self.assertEqual(educat_risk.risk_level, RiskLevel.LOW)

        nutrit_risk = risks.get(risk_type=RiskType.NUTRIT)
        self.assertEqual(nutrit_risk.risk_level, RiskLevel.MEDIUM)

        mental_risk = risks.get(risk_type=RiskType.MENTAL)
        self.assertEqual(mental_risk.risk_level, RiskLevel.LOW)
        self.assertEqual(mental_risk.goal_status, GoalOutcomes.CONCLUDED)
