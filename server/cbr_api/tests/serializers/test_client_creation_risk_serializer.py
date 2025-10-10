from django.test import TestCase
from cbr_api.serializers import ClientCreationRiskSerializer
from cbr_api.models import RiskLevel


class ClientCreationRiskSerializerTests(TestCase):
    def test_goal_field_removed_from_fields(self):
        serializer = ClientCreationRiskSerializer()
        self.assertNotIn("goal", serializer.fields)

    def test_unexpected_goal_field_in_input_is_ignored(self):
        data = {"goal": "some goal", "risk_level": RiskLevel.HIGH}
        serializer = ClientCreationRiskSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        # 'goal' should not be present in validated_data or in errors
        self.assertNotIn("goal", serializer.validated_data)
        self.assertNotIn("goal", serializer.errors)

    def test_read_only_fields_ignored_in_validated_data(self):
        data = {
            "id": "test-id",
            "client_id": "some-client",
            "timestamp": 12345,
            "risk_level": RiskLevel.MEDIUM,
        }
        serializer = ClientCreationRiskSerializer(data=data)
        # should be valid because writable fields have defaults or are optional
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertNotIn("id", serializer.validated_data)
        self.assertNotIn("client_id", serializer.validated_data)
        self.assertNotIn("timestamp", serializer.validated_data)

    def test_minimal_valid_data(self):
        """A minimal payload without a 'goal' field should validate and include the provided writable fields."""
        data = {"risk_level": RiskLevel.LOW}
        serializer = ClientCreationRiskSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data.get("risk_level"), RiskLevel.LOW)
