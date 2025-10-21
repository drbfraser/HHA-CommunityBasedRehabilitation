from django.test import TestCase
from cbr_api.models import Zone
from cbr_api.serializers import ConfigStatsSerializer


class ConfigStatsSerializerTests(TestCase):
    """Tests for the dynamic ConfigStatsSerializer factory"""

    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")

    def test_create_serializer_without_stat_types(self):
        TestSerializer = ConfigStatsSerializer.create_serializer("TestSerializer")

        data = {
            "zone_id": self.zone.id,
            "total": 100,
            "hcr_type": "CBR",
            "female_adult_total": 25,
            "male_adult_total": 30,
            "female_child_total": 20,
            "male_child_total": 25,
        }

        serializer = TestSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["total"], 100)
        self.assertEqual(serializer.validated_data["female_adult_total"], 25)
