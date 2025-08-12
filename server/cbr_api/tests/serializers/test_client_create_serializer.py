from django.test import TestCase
from unittest.mock import patch
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
        self.d1 = Disability.objects.create(disability_type="Amputee")
        self.d2 = Disability.objects.create(disability_type="Special Needs")

    @patch("cbr_api.serializers.current_milli_time")
    def test_create_client_with_all_risks(self, mock_time):
        mock_time.return_value = 1640995200000

        data = get_valid_client_data(self.zone, self.d1, self.d2)
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
        self.assertEqual(health_risk.goal_name, "Improve health status")
        self.assertEqual(health_risk.goal_status, GoalOutcomes.ONGOING)

        social_risk = risks.get(risk_type=RiskType.SOCIAL)
        self.assertEqual(social_risk.risk_level, RiskLevel.MEDIUM)
        self.assertEqual(social_risk.requirement, "Social support needed")
        self.assertEqual(social_risk.goal_name, "Build social connections")
        self.assertEqual(social_risk.goal_status, GoalOutcomes.NOT_SET)

        educat_risk = risks.get(risk_type=RiskType.EDUCAT)
        self.assertEqual(educat_risk.risk_level, RiskLevel.LOW)
        self.assertEqual(educat_risk.requirement, "Educational support")
        self.assertEqual(educat_risk.goal_name, "Complete primary education")
        self.assertEqual(social_risk.goal_status, GoalOutcomes.NOT_SET)

        nutrit_risk = risks.get(risk_type=RiskType.NUTRIT)
        self.assertEqual(nutrit_risk.risk_level, RiskLevel.MEDIUM)
        self.assertEqual(nutrit_risk.requirement, "Nutritional support")
        self.assertEqual(nutrit_risk.goal_name, "Improve nutrition")
        self.assertEqual(social_risk.goal_status, GoalOutcomes.NOT_SET)

        mental_risk = risks.get(risk_type=RiskType.MENTAL)
        self.assertEqual(mental_risk.risk_level, RiskLevel.LOW)
        self.assertEqual(mental_risk.requirement, "Mental health support")
        self.assertEqual(mental_risk.goal_name, "Improve mental wellbeing")
        self.assertEqual(mental_risk.goal_status, GoalOutcomes.CONCLUDED)

    def test_create_client_missing_required_fields(self):
        data = {
            "first_name": "Jane",
            # Missing last_name and risk data
        }

        serializer = ClientCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())

        # Should have errors for missing fields
        expected_errors = [
            "last_name",
            "birth_date",
            "gender",
            "disability",
            "longitude",
            "latitude",
            "zone",
            "village",
            "health_risk",
            "social_risk",
            "educat_risk",
            "nutrit_risk",
            "mental_risk",
        ]

        for field in expected_errors:
            self.assertIn(field, serializer.errors)

    def test_invalid_risk_data_prevents_client_creation(self):
        data = get_valid_client_data(self.zone, self.d1, self.d2)
        data["health_risk"]["risk_level"] = "INVALID_LEVEL"

        context = {"request": type("MockRequest", (), {"user": self.user})()}
        serializer = ClientCreateSerializer(data=data, context=context)

        self.assertFalse(serializer.is_valid())
        self.assertIn("health_risk", serializer.errors)

    def test_minimal_risk_data(self):
        data = {
            "first_name": "John",
            "last_name": "Doe",
            "birth_date": 19850615,
            "gender": Client.Gender.MALE,
            "disability": get_valid_client_data(self.zone, self.d1, self.d2)[
                "disability"
            ],
            "longitude": -123.1207,
            "latitude": 49.2827,
            "zone": self.zone.id,
            "village": "Test Village",
            "health_risk": {"risk_level": RiskLevel.LOW},
            "social_risk": {"risk_level": RiskLevel.MEDIUM},
            "educat_risk": {"risk_level": RiskLevel.HIGH},
            "nutrit_risk": {"risk_level": RiskLevel.LOW},
            "mental_risk": {"risk_level": RiskLevel.MEDIUM},
        }

        context = {"request": type("MockRequest", (), {"user": self.user})()}
        serializer = ClientCreateSerializer(data=data, context=context)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        client = serializer.save()

        self.assertEqual(client.first_name, "John")
        self.assertEqual(client.last_name, "Doe")
        self.assertEqual(client.full_name, "John Doe")
        self.assertEqual(client.hcr_type, Client.HCRType.NOT_SET)

        risks = ClientRisk.objects.filter(client_id=client)
        self.assertEqual(risks.count(), 5)

    def test_read_only_fields_ignored(self):
        data = get_valid_client_data(self.zone, self.d1, self.d2)
        # all fields below should be ignored as they are read only
        data.update(
            {
                "id": "test-id-123",
                "user_id": 99999,
                "created_at": 999999,
                "updated_at": 888888,
                "server_created_at": 777777,
                "full_name": "Should Be Ignored",
                "is_active": False,
            }
        )

        context = {"request": type("MockRequest", (), {"user": self.user})()}
        serializer = ClientCreateSerializer(data=data, context=context)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        client = serializer.save()

        # Read-only fields should be set by the serializer, not from input/users
        self.assertNotEqual(client.id, "test-id-123")
        self.assertNotEqual(client.user_id, 99999)
        self.assertEqual(client.user_id, self.user)
        self.assertNotEqual(client.created_at, 99999)
        self.assertNotEqual(client.updated_at, 888888)
        self.assertNotEqual(client.server_created_at, 777777)
        self.assertNotEqual(client.full_name, "Should Be Ignored")
        self.assertEqual(client.full_name, "Jane Smith")
        # is_active should default to True regardless of input
        self.assertTrue(client.is_active)

    def test_invalid_gender(self):
        data = get_valid_client_data(self.zone, self.d1, self.d2)
        data["gender"] = "INVALID_GENDER"

        serializer = ClientCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("gender", serializer.errors)

    def test_invalid_zone(self):
        data = get_valid_client_data(self.zone, self.d1, self.d2)
        data["zone"] = 99999  # Non-existent zone

        serializer = ClientCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("zone", serializer.errors)

    def test_invalid_hcr_type(self):
        data = get_valid_client_data(self.zone, self.d1, self.d2)
        data["hcr_type"] = "INVALID_TYPE"

        serializer = ClientCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("hcr_type", serializer.errors)

    def test_valid_hcr_types(self):
        valid_types = [
            Client.HCRType.HOST_COMMUNITY,
            Client.HCRType.REFUGEE,
            Client.HCRType.NOT_SET,
        ]

        for hcr_type in valid_types:
            data = get_valid_client_data(self.zone, self.d1, self.d2)
            data["hcr_type"] = hcr_type

            context = {"request": type("MockRequest", (), {"user": self.user})()}
            serializer = ClientCreateSerializer(data=data, context=context)

            self.assertTrue(
                serializer.is_valid(),
                f"HCR type {hcr_type} should be valid: {serializer.errors}",
            )
            client = serializer.save()
            self.assertEqual(client.hcr_type, hcr_type)

    @patch("cbr_api.serializers.current_milli_time")
    def test_risk_timestamps_match_client_timestamps(self, mock_time):
        mock_time.return_value = 1640995200000

        data = get_valid_client_data(self.zone, self.d1, self.d2)
        context = {"request": type("MockRequest", (), {"user": self.user})()}

        serializer = ClientCreateSerializer(data=data, context=context)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        client = serializer.save()

        self.assertEqual(client.created_at, 1640995200000)
        # All risk records should have the same timestamp as client timestamps
        risks = ClientRisk.objects.filter(client_id=client)
        for risk in risks:
            self.assertEqual(risk.timestamp, 1640995200000)
            self.assertEqual(risk.server_created_at, 1640995200000)

    def test_no_context_raises_error(self):
        data = get_valid_client_data(self.zone, self.d1, self.d2)

        serializer = ClientCreateSerializer(
            data=data
        )  # deliberately did not pass in context
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Should raise an error when trying to save without context
        with self.assertRaises(KeyError):
            serializer.save()

    @patch("cbr_api.serializers.current_milli_time")
    def test_different_risk_goal_statuses(self, mock_time):
        mock_time.return_value = 1640995200000

        data = get_valid_client_data(self.zone, self.d1, self.d2)
        data.update(
            {
                "health_risk": {
                    "risk_level": RiskLevel.HIGH,
                    "goal_name": "Daily Exercise",
                    "goal_status": GoalOutcomes.ONGOING,
                },
                "social_risk": {
                    "risk_level": RiskLevel.MEDIUM,
                    "goal_name": "Family time",
                    "goal_status": GoalOutcomes.CONCLUDED,
                },
                "educat_risk": {
                    "risk_level": RiskLevel.LOW,
                    "goal_name": "Graduating Grade 6",
                    "goal_status": GoalOutcomes.CANCELLED,
                },
                "nutrit_risk": {
                    "risk_level": RiskLevel.MEDIUM,
                },
                "mental_risk": {
                    "risk_level": RiskLevel.HIGH,
                },
            }
        )

        context = {"request": type("MockRequest", (), {"user": self.user})()}
        serializer = ClientCreateSerializer(data=data, context=context)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        client = serializer.save()

        # Verify each risk has the correct goal status
        risks = ClientRisk.objects.filter(client_id=client)

        health_risk = risks.get(risk_type=RiskType.HEALTH)
        self.assertEqual(health_risk.risk_level, RiskLevel.HIGH)
        self.assertEqual(health_risk.goal_name, "Daily Exercise")
        self.assertEqual(health_risk.goal_status, GoalOutcomes.ONGOING)

        social_risk = risks.get(risk_type=RiskType.SOCIAL)
        self.assertEqual(social_risk.risk_level, RiskLevel.MEDIUM)
        self.assertEqual(social_risk.goal_name, "Family time")
        self.assertEqual(social_risk.goal_status, GoalOutcomes.CONCLUDED)

        educat_risk = risks.get(risk_type=RiskType.EDUCAT)
        self.assertEqual(educat_risk.risk_level, RiskLevel.LOW)
        self.assertEqual(educat_risk.goal_name, "Graduating Grade 6")
        self.assertEqual(educat_risk.goal_status, GoalOutcomes.CANCELLED)

        nutrit_risk = risks.get(risk_type=RiskType.NUTRIT)
        self.assertEqual(nutrit_risk.risk_level, RiskLevel.MEDIUM)
        self.assertEqual(nutrit_risk.goal_name, "No goal set")
        self.assertEqual(nutrit_risk.goal_status, GoalOutcomes.NOT_SET)

        mental_risk = risks.get(risk_type=RiskType.MENTAL)
        self.assertEqual(mental_risk.risk_level, RiskLevel.HIGH)
        self.assertEqual(mental_risk.goal_name, "No goal set")
        self.assertEqual(mental_risk.goal_status, GoalOutcomes.NOT_SET)

    def test_optional_caregiver_fields(self):
        # Test with full caregiver info from helper
        data_with_caregiver = get_valid_client_data(self.zone, self.d1, self.d2)

        context = {"request": type("MockRequest", (), {"user": self.user})()}
        serializer = ClientCreateSerializer(data=data_with_caregiver, context=context)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        client_with_caregiver = serializer.save()

        self.assertEqual(client_with_caregiver.caregiver_name, "John Smith")
        self.assertTrue(client_with_caregiver.caregiver_present)

        # Test without caregiver info
        data_without_caregiver = get_valid_client_data(self.zone, self.d1, self.d2)
        del data_without_caregiver["caregiver_name"]
        del data_without_caregiver["caregiver_present"]
        del data_without_caregiver["caregiver_phone"]
        del data_without_caregiver["caregiver_email"]

        serializer2 = ClientCreateSerializer(
            data=data_without_caregiver, context=context
        )
        self.assertTrue(serializer2.is_valid(), serializer2.errors)
        client_without_caregiver = serializer2.save()

        # Verify default values for caregiver fields
        self.assertEqual(
            client_without_caregiver.caregiver_name, ""
        )  # blank=True means empty string
        self.assertFalse(client_without_caregiver.caregiver_present)  # default=False
        self.assertEqual(client_without_caregiver.caregiver_phone, "")
        self.assertEqual(client_without_caregiver.caregiver_email, "")

    def test_required_location_fields(self):
        data = get_valid_client_data(self.zone, self.d1, self.d2)

        # Test missing longitude
        del data["longitude"]
        serializer = ClientCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("longitude", serializer.errors)

        # Reset and test missing latitude
        data = get_valid_client_data(self.zone, self.d1, self.d2)
        del data["latitude"]
        serializer = ClientCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("latitude", serializer.errors)

        # Reset and test missing village
        data = get_valid_client_data(self.zone, self.d1, self.d2)
        del data["village"]
        serializer = ClientCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("village", serializer.errors)

    def test_decimal_precision_for_coordinates(self):
        data = get_valid_client_data(self.zone, self.d1, self.d2)
        data.update(
            {
                "longitude": -123.123456,  # 6 decimal places (within max_digits=12, decimal_places=6)
                "latitude": 49.123456,
            }
        )

        context = {"request": type("MockRequest", (), {"user": self.user})()}
        serializer = ClientCreateSerializer(data=data, context=context)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        client = serializer.save()

        # Verify coordinates are stored with proper precision (as floats not rounded or integers)
        self.assertEqual(float(client.longitude), -123.123456)
        self.assertEqual(float(client.latitude), 49.123456)

    def test_caregiver_present_default_false(self):
        data = get_valid_client_data(self.zone, self.d1, self.d2)
        # Don't include caregiver_present in data
        del data["caregiver_present"]

        context = {"request": type("MockRequest", (), {"user": self.user})()}
        serializer = ClientCreateSerializer(data=data, context=context)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        client = serializer.save()

        # Should default to False
        self.assertFalse(client.caregiver_present)
