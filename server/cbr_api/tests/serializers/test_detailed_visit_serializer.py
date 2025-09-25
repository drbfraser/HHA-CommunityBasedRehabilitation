import uuid
from django.test import TestCase
from unittest.mock import patch

from cbr_api.models import Client, Improvement, RiskType, UserCBR, Zone
from cbr_api.tests.helpers import (
    create_client,
    DetailedVisitSerializerTestsHelper as helper,
)
from cbr_api.serializers import DetailedVisitSerializer


class DetailedVisitSerializerTests(TestCase):
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

    @patch("cbr_api.serializers.current_milli_time", return_value=1700000000000)
    @patch("uuid.uuid4")
    def test_create_visit_without_improvements(self, mock_uuid, mock_now):
        mock_uuid.side_effect = [
            # visit id:
            uuid.UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
        ]
        data = helper.base_visit_payload(self.client.id, self.zone.id)
        ctx = {"request": helper.mock_request(self.user)}

        s = DetailedVisitSerializer(data=data, context=ctx)
        self.assertTrue(s.is_valid(), s.errors)
        visit = s.save()

        # visit created with correct fields
        self.assertEqual(visit.id, uuid.UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"))
        self.assertEqual(visit.user_id, self.user)
        self.assertEqual(str(visit.client_id.id), str(self.client.id))
        self.assertEqual(visit.created_at, 1700000000000)
        self.assertEqual(visit.server_created_at, 1700000000000)

        # should no improvements since none were in payload
        self.assertEqual(Improvement.objects.filter(visit_id=visit).count(), 0)

    @patch("cbr_api.serializers.current_milli_time", return_value=1700000000000)
    @patch("uuid.uuid4")
    def test_create_visit_with_multiple_improvements(self, mock_uuid, mock_now):
        mock_uuid.side_effect = [
            # visit id
            uuid.UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
            # improvement 1 id
            uuid.UUID("00000000-0000-0000-0000-000000000001"),
            # improvement 2 id
            uuid.UUID("00000000-0000-0000-0000-000000000002"),
        ]
        data = helper.base_visit_payload(self.client.id, self.zone.id) | {
            "improvements": [
                helper.improvement(
                    risk_type=RiskType.HEALTH, provided="Outcome", desc="Vitals checked"
                ),
                helper.improvement(
                    risk_type=RiskType.EDUCAT,
                    provided="School supplies",
                    desc="School follow-up",
                ),
            ]
        }
        ctx = {"request": helper.mock_request(self.user)}
        s = DetailedVisitSerializer(data=data, context=ctx)
        self.assertTrue(s.is_valid(), s.errors)
        visit = s.save()

        imps = list(Improvement.objects.filter(visit_id=visit).order_by("created_at"))
        self.assertEqual(len(imps), 2)
        self.assertEqual(imps[0].risk_type, RiskType.HEALTH)
        self.assertEqual(imps[0].provided, "Outcome")
        self.assertEqual(imps[0].desc, "Vitals checked")
        self.assertEqual(imps[0].created_at, 1700000000000)
        self.assertEqual(imps[1].risk_type, RiskType.EDUCAT)
        self.assertEqual(imps[1].provided, "School supplies")
        self.assertEqual(imps[1].desc, "School follow-up")

        # visit fields still correct
        self.assertEqual(visit.user_id, self.user)
        self.assertEqual(str(visit.client_id.id), str(self.client.id))

    @patch("cbr_api.serializers.current_milli_time", return_value=1700000000000)
    @patch(
        "uuid.uuid4",
        side_effect=[
            uuid.UUID("cccccccc-cccc-cccc-cccc-cccccccccccc"),
            uuid.UUID("00000000-0000-0000-0000-000000000003"),
        ],
    )
    def test_improvements_default_to_empty_list(self, _, __):
        data = helper.base_visit_payload(self.client.id, self.zone.id)
        # do NOT include "improvements" to ensure default=list kicks in
        ctx = {"request": helper.mock_request(self.user)}
        s = DetailedVisitSerializer(data=data, context=ctx)
        self.assertTrue(s.is_valid(), s.errors)
        visit = s.save()
        self.assertEqual(Improvement.objects.filter(visit_id=visit).count(), 0)

    @patch("cbr_api.serializers.current_milli_time", return_value=1700000000000)
    @patch(
        "uuid.uuid4", side_effect=[uuid.UUID("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee")]
    )
    def test_read_only_fields_are_ignored_on_input(self, _uuid, _now):
        # Try to spoof id/user/created_at in the input; they should be ignored/overridden.
        data = helper.base_visit_payload(self.client.id, self.zone.id) | {
            "id": "ffffffff-ffff-ffff-ffff-ffffffffffff",
            "user_id": "spoof-user",
            "created_at": 123,
        }
        ctx = {"request": helper.mock_request(self.user)}
        s = DetailedVisitSerializer(data=data, context=ctx)
        self.assertTrue(s.is_valid(), s.errors)
        visit = s.save()

        # Ensure our serializer's create() logic won over input
        self.assertEqual(visit.id, uuid.UUID("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"))
        self.assertEqual(visit.user_id, self.user)
        self.assertEqual(visit.created_at, 1700000000000)

    @patch("cbr_api.serializers.current_milli_time", return_value=1700000000000)
    @patch(
        "uuid.uuid4",
        side_effect=[
            uuid.UUID("dddddddd-dddd-dddd-dddd-dddddddddddd"),
            uuid.UUID("00000000-0000-0000-0000-000000000004"),
        ],
    )
    def test_improvement_desc_is_required(self, _, __):
        data = helper.base_visit_payload(self.client.id, self.zone.id) | {
            "improvements": [
                {
                    "risk_type": RiskType.HEALTH,
                    "provided": "wheel chair repair",
                }  # no desc
            ]
        }
        ctx = {"request": helper.mock_request(self.user)}
        s = DetailedVisitSerializer(data=data, context=ctx)
        self.assertFalse(s.is_valid())
        self.assertIn("improvements", s.errors)
        self.assertIn("desc", s.errors["improvements"][0])

    def test_invalid_improvement_payload_surfaces_validation_error(self):
        data = helper.base_visit_payload(self.client.id, self.zone.id) | {
            "improvements": [
                {"desc": "wheel chair repair"},  # missing 'provided'
            ]
        }
        ctx = {"request": helper.mock_request(self.user)}
        s = DetailedVisitSerializer(data=data, context=ctx)
        self.assertFalse(s.is_valid())
        self.assertIn("improvements", s.errors)
        self.assertIn("provided", s.errors["improvements"][0])

    @patch("cbr_api.serializers.current_milli_time", return_value=1700000000000)
    @patch(
        "uuid.uuid4",
        side_effect=[
            # visit id
            uuid.UUID("12121212-1212-1212-1212-121212121212"),
            # improvement 1
            uuid.UUID("23232323-2323-2323-2323-232323232323"),
            # improvement 2
            uuid.UUID("34343434-3434-3434-3434-343434343434"),
            # improvement 3
            uuid.UUID("45454545-4545-4545-4545-454545454545"),
        ],
    )
    def test_bulk_create_is_called_once(self, _uuid, _now):
        data = helper.base_visit_payload(self.client.id, self.zone.id) | {
            "improvements": [
                helper.improvement(RiskType.HEALTH, "wheel chair repair", "A"),
                helper.improvement(RiskType.EDUCAT, "school supplies", "B"),
                helper.improvement(RiskType.SOCIAL, "mobile phone", "C"),
            ]
        }
        ctx = {"request": helper.mock_request(self.user)}

        with patch.object(
            Improvement.objects, "bulk_create", wraps=Improvement.objects.bulk_create
        ) as bc:
            s = DetailedVisitSerializer(data=data, context=ctx)
            self.assertTrue(s.is_valid(), s.errors)
            visit = s.save()

            # assert bulk_create called exactly once with 3 objects which are improvements
            self.assertEqual(bc.call_count, 1)
            args, kwargs = bc.call_args
            created_list = args[0]
            self.assertEqual(len(created_list), 3)
            self.assertTrue(all(isinstance(x, Improvement) for x in created_list))

            # sanity check they actually exist
            self.assertEqual(Improvement.objects.filter(visit_id=visit).count(), 3)
