from django.test import TestCase
from cbr_api.models import Zone
from cbr_api.serializers import (
    AdminStatsFollowUpVisitsSerializer,
    AdminStatsNewClientsSerializer,
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
