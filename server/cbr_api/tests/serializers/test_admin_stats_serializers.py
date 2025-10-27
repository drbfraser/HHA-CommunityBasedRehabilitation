from django.test import TestCase
from cbr_api.models import Zone
from cbr_api.serializers import (
    AdminStatsDisabilitySerializer,
    AdminStatsDischargedClientsSerializer,
    AdminStatsFollowUpVisitsSerializer,
    AdminStatsNewClientsSerializer,
    AdminStatsSerializer,
)


class AdminStatsNewClientsSerializerTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")

    def test_serialization_with_valid_data(self):
        data = {
            "zone_id": self.zone.id,
            "total": 50,
            "hcr_type": "CBR",
            "female_adult_total": 15,
            "male_adult_total": 18,
            "female_child_total": 8,
            "male_child_total": 9,
        }

        serializer = AdminStatsNewClientsSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["total"], 50)

    def test_deserialization_output(self):
        data = {
            "zone_id": self.zone.id,
            "total": 50,
            "hcr_type": "CBR",
            "female_adult_total": 15,
            "male_adult_total": 18,
            "female_child_total": 8,
            "male_child_total": 9,
        }

        serializer = AdminStatsNewClientsSerializer(data=data)
        self.assertTrue(serializer.is_valid())

        # Verify all demographics are present
        validated = serializer.validated_data
        self.assertEqual(validated["female_adult_total"], 15)
        self.assertEqual(validated["male_adult_total"], 18)
        self.assertEqual(validated["female_child_total"], 8)
        self.assertEqual(validated["male_child_total"], 9)


class AdminStatsFollowUpVisitsSerializerTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")

    def test_serialization_with_valid_data(self):
        data = {
            "zone_id": self.zone.id,
            "total": 120,
            "hcr_type": "CBR",
            "female_adult_total": 35,
            "male_adult_total": 40,
            "female_child_total": 20,
            "male_child_total": 25,
        }

        serializer = AdminStatsFollowUpVisitsSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["total"], 120)


class AdminStatsDischargedClientsSerializerTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")

    def test_serialization_with_valid_data(self):
        data = {
            "zone_id": self.zone.id,
            "total": 30,
            "hcr_type": "CBR",
            "female_adult_total": 10,
            "male_adult_total": 8,
            "female_child_total": 6,
            "male_child_total": 6,
        }

        serializer = AdminStatsDischargedClientsSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["total"], 30)


class AdminStatsDisabilitySerializerTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")

    def test_serialization_with_valid_data(self):
        data = {
            "disability_id": 1,
            "total": 45,
            "zone_id": self.zone.id,
            "hcr_type": "CBR",
            "female_adult_total": 10,
            "male_adult_total": 12,
            "female_child_total": 11,
            "male_child_total": 12,
        }

        serializer = AdminStatsDisabilitySerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["disability_id"], 1)
        self.assertEqual(serializer.validated_data["total"], 45)

    def test_missing_required_fields(self):
        data = {
            "disability_id": 1,
            # missing total
        }

        serializer = AdminStatsDisabilitySerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("total", serializer.errors)


class AdminStatsSerializerTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")

    def test_serialization_with_complete_data(self):
        data = {
            "disabilities": [
                {"disability_id": 1, "total": 20},
                {"disability_id": 2, "total": 15},
            ],
            "clients_with_disabilities": 35,
            "visits": [{"zone_id": self.zone.id, "total": 100, "hcr_type": "CBR"}],
            "referrals_resolved": [
                {"zone_id": self.zone.id, "total": 50, "hcr_type": "CBR"}
            ],
            "referrals_unresolved": [
                {"zone_id": self.zone.id, "total": 10, "hcr_type": "CBR"}
            ],
            "new_clients": [
                {
                    "zone_id": self.zone.id,
                    "total": 30,
                    "hcr_type": "CBR",
                    "female_adult_total": 10,
                    "male_adult_total": 10,
                    "female_child_total": 5,
                    "male_child_total": 5,
                }
            ],
            "discharged_clients": [
                {
                    "zone_id": self.zone.id,
                    "total": 20,
                    "hcr_type": "CBR",
                    "female_adult_total": 8,
                    "male_adult_total": 6,
                    "female_child_total": 3,
                    "male_child_total": 3,
                }
            ],
            "follow_up_visits": [
                {
                    "zone_id": self.zone.id,
                    "total": 80,
                    "hcr_type": "CBR",
                    "female_adult_total": 25,
                    "male_adult_total": 30,
                    "female_child_total": 12,
                    "male_child_total": 13,
                }
            ],
        }

        serializer = AdminStatsSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["clients_with_disabilities"], 35)
        self.assertEqual(len(serializer.validated_data["disabilities"]), 2)

    def test_json_field_validation(self):
        data = {
            "disabilities": {"invalid": "structure"},  # Should still be valid JSON
            "clients_with_disabilities": 10,
            "visits": [],
            "referrals_resolved": [],
            "referrals_unresolved": [],
            "new_clients": [],
            "discharged_clients": [],
            "follow_up_visits": [],
        }

        serializer = AdminStatsSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_missing_required_fields(self):
        data = {
            "disabilities": [],
            # missing other required fields
        }

        serializer = AdminStatsSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("clients_with_disabilities", serializer.errors)

    def test_empty_lists_are_valid(self):
        data = {
            "disabilities": [],
            "clients_with_disabilities": 0,
            "visits": [],
            "referrals_resolved": [],
            "referrals_unresolved": [],
            "new_clients": [],
            "discharged_clients": [],
            "follow_up_visits": [],
        }

        serializer = AdminStatsSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)


class IntegrationTests(TestCase):
    # Integration tests for stats serializers working together

    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")

    def test_full_stats_pipeline(self):
        # Create individual stat components
        new_clients_data = {
            "zone_id": self.zone.id,
            "total": 25,
            "hcr_type": "CBR",
            "female_adult_total": 8,
            "male_adult_total": 9,
            "female_child_total": 4,
            "male_child_total": 4,
        }

        disabilities_data = [
            {"disability_id": 1, "total": 10},
            {"disability_id": 2, "total": 15},
        ]

        # Build complete admin stats
        admin_stats_data = {
            "disabilities": disabilities_data,
            "clients_with_disabilities": 25,
            "visits": [],
            "referrals_resolved": [],
            "referrals_unresolved": [],
            "new_clients": [new_clients_data],
            "discharged_clients": [],
            "follow_up_visits": [],
        }

        # Validate complete structure
        admin_serializer = AdminStatsSerializer(data=admin_stats_data)
        self.assertTrue(admin_serializer.is_valid(), admin_serializer.errors)

        # Verify nested data integrity
        validated = admin_serializer.validated_data
        self.assertEqual(len(validated["new_clients"]), 1)
        self.assertEqual(validated["new_clients"][0]["total"], 25)
        self.assertEqual(len(validated["disabilities"]), 2)
