import uuid
from unittest.mock import patch

from django.test import TestCase

from cbr_api.models import Client, Referral, UserCBR, Zone
from cbr_api.serializers import DetailedReferralSerializer
from cbr_api.tests.helpers import create_client


class DetailedReferralSerializerTests(TestCase):
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

    def _mock_request(self):
        return type("MockRequest", (), {"user": self.user})()

    def _payload(self):
        return {
            "client_id": self.client.id,
            "wheelchair": True,
            "wheelchair_experience": Referral.Experience.BASIC,
            "hip_width": 42,
            "wheelchair_owned": True,
            "wheelchair_repairable": False,
            "physiotherapy": True,
            "condition": "Back pain",
            "prosthetic": True,
            "prosthetic_injury_location": Referral.InjuryLocation.BELOW_KNEE,
            "orthotic": True,
            "orthotic_injury_location": Referral.OrthoticInjury.WEAK_LEG,
            "hha_nutrition_and_agriculture_project": True,
            "emergency_food_aid": True,
            "agriculture_livelihood_program_enrollment": False,
            "mental_health": True,
            "mental_health_condition": "Anxiety",
            "services_other": "Transport assistance",
        }

    @patch("cbr_api.serializers.send_referral_created_email")
    @patch("cbr_api.serializers.current_milli_time", return_value=1700000000000)
    @patch("uuid.uuid4", return_value=uuid.UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"))
    def test_create_referral_sets_server_fields_and_sends_email(
        self, _mock_uuid, _mock_now, mock_send_email
    ):
        serializer = DetailedReferralSerializer(
            data=self._payload(),
            context={"request": self._mock_request()},
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        referral = serializer.save()

        self.assertEqual(str(referral.id), "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
        self.assertEqual(referral.user_id, self.user)
        self.assertEqual(referral.client_id, self.client)
        self.assertEqual(referral.date_referred, 1700000000000)
        self.assertEqual(referral.server_created_at, 1700000000000)
        self.assertEqual(referral.date_resolved, 0)
        self.assertFalse(referral.resolved)
        self.assertEqual(referral.outcome, "")
        self.assertTrue(referral.wheelchair)
        self.assertTrue(referral.physiotherapy)
        self.assertTrue(referral.mental_health)

        mock_send_email.assert_called_once_with(referral)

    @patch("cbr_api.serializers.send_referral_created_email")
    @patch("cbr_api.serializers.current_milli_time", return_value=1700000000000)
    @patch("uuid.uuid4", return_value=uuid.UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"))
    def test_read_only_fields_are_ignored_on_input(
        self, _mock_uuid, _mock_now, mock_send_email
    ):
        payload = self._payload()
        payload.update(
            {
                "id": "spoofed-id",
                "user_id": "spoofed-user",
                "date_referred": 123,
                "date_resolved": 456,
                "resolved": True,
                "outcome": "spoofed outcome",
                "updated_at": 789,
                "server_created_at": 999,
            }
        )

        serializer = DetailedReferralSerializer(
            data=payload,
            context={"request": self._mock_request()},
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        referral = serializer.save()

        self.assertEqual(str(referral.id), "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")
        self.assertEqual(referral.user_id, self.user)
        self.assertEqual(referral.date_referred, 1700000000000)
        self.assertEqual(referral.server_created_at, 1700000000000)
        self.assertEqual(referral.date_resolved, 0)
        self.assertFalse(referral.resolved)
        self.assertEqual(referral.outcome, "")
        mock_send_email.assert_called_once_with(referral)

    def test_missing_required_client_id_fails_validation(self):
        payload = self._payload()
        del payload["client_id"]

        serializer = DetailedReferralSerializer(
            data=payload,
            context={"request": self._mock_request()},
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("client_id", serializer.errors)

    @patch("cbr_api.serializers.send_referral_created_email")
    @patch("cbr_api.serializers.current_milli_time", return_value=1700000000000)
    @patch("uuid.uuid4", return_value=uuid.UUID("cccccccc-cccc-cccc-cccc-cccccccccccc"))
    def test_missing_request_context_raises_key_error(
        self, _mock_uuid, _mock_now, mock_send_email
    ):
        serializer = DetailedReferralSerializer(data=self._payload())
        self.assertTrue(serializer.is_valid(), serializer.errors)

        with self.assertRaises(KeyError):
            serializer.save()

        mock_send_email.assert_not_called()
