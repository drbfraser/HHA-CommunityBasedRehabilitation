import uuid
from datetime import date, datetime
from unittest.mock import patch

from django.test import TestCase

from cbr_api.models import Client, SuccessStory, UserCBR, Zone
from cbr_api.serializers import SuccessStorySerializer, UpdateSuccessStorySerializer
from cbr_api.tests.helpers import create_client


class SuccessStorySerializerTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create_user(
            username="testworker",
            password="testpass",
            first_name="Test",
            last_name="Worker",
            zone=self.zone.id,
        )

        # birth_date as milliseconds timestamp for ~30 year old
        thirty_years_ago = datetime(
            date.today().year - 30, date.today().month, date.today().day
        )
        self.birth_date_ms = int(thirty_years_ago.timestamp() * 1000)

        self.client_obj = create_client(
            user=self.user,
            first="Test",
            last="Client",
            contact="604-555-1234",
            zone=self.zone,
            gender=Client.Gender.MALE,
            birth_date=self.birth_date_ms,
            hcr_type=Client.HCRType.REFUGEE,
        )

        self.mock_request = type("MockRequest", (), {"user": self.user})()

    def _make_story(self, **overrides):
        defaults = {
            "id": uuid.uuid4(),
            "client_id": self.client_obj,
            "created_by_user_id": self.user,
            "created_at": 1700000000000,
            "updated_at": 1700000000000,
            "title": "A Success Story",
            "date": "2024-01-15",
            "status": SuccessStory.StoryStatus.WORK_IN_PROGRESS,
            "publish_permission": SuccessStory.PublishPermission.NO,
        }
        defaults.update(overrides)
        return SuccessStory.objects.create(**defaults)

    def _valid_data(self):
        return {
            "client_id": str(self.client_obj.id),
            "title": "A Success Story",
            "date": "2024-01-15",
            "status": "WIP",
            "publish_permission": "NO",
        }

    def test_serializer_contains_expected_fields(self):
        story = self._make_story()
        serializer = SuccessStorySerializer(story)
        expected_fields = {
            "id",
            "client_id",
            "created_by_user_id",
            "created_at",
            "updated_at",
            "written_by_name",
            "beneficiary_age",
            "beneficiary_gender",
            "hcr_status",
            "client_name",
            "title",
            "refugee_origin",
            "refugee_duration",
            "diagnosis",
            "treatment_service",
            "part1_background",
            "part2_challenge",
            "part3_introduction",
            "part4_action",
            "part5_impact",
            "photo",
            "publish_permission",
            "status",
            "date",
        }
        self.assertEqual(set(serializer.data.keys()), expected_fields)

    def test_written_by_name_full_name(self):
        story = self._make_story()
        serializer = SuccessStorySerializer(story)
        self.assertEqual(serializer.data["written_by_name"], "Test Worker")

    def test_written_by_name_falls_back_to_username(self):
        self.user.first_name = ""
        self.user.last_name = ""
        self.user.save()
        story = self._make_story()
        serializer = SuccessStorySerializer(story)
        self.assertEqual(serializer.data["written_by_name"], "testworker")

    def test_beneficiary_age_computed(self):
        story = self._make_story()
        serializer = SuccessStorySerializer(story)
        self.assertEqual(serializer.data["beneficiary_age"], 30)

    def test_beneficiary_age_zero_birth_date(self):
        self.client_obj.birth_date = 0
        self.client_obj.save()
        story = self._make_story()
        serializer = SuccessStorySerializer(story)
        self.assertEqual(serializer.data["beneficiary_age"], "")

    def test_beneficiary_gender(self):
        story = self._make_story()
        serializer = SuccessStorySerializer(story)
        self.assertEqual(serializer.data["beneficiary_gender"], Client.Gender.MALE)

    def test_hcr_status_refugee(self):
        story = self._make_story()
        serializer = SuccessStorySerializer(story)
        self.assertEqual(serializer.data["hcr_status"], "Refugee")

    def test_hcr_status_host_community(self):
        self.client_obj.hcr_type = Client.HCRType.HOST_COMMUNITY
        self.client_obj.save()
        story = self._make_story()
        serializer = SuccessStorySerializer(story)
        self.assertEqual(serializer.data["hcr_status"], "Host Community")

    def test_hcr_status_not_set(self):
        self.client_obj.hcr_type = Client.HCRType.NOT_SET
        self.client_obj.save()
        story = self._make_story()
        serializer = SuccessStorySerializer(story)
        self.assertEqual(serializer.data["hcr_status"], "")

    def test_client_name(self):
        story = self._make_story()
        serializer = SuccessStorySerializer(story)
        self.assertEqual(serializer.data["client_name"], "Test Client")

    def test_create_sets_uuid_and_timestamps(self):
        data = self._valid_data()
        serializer = SuccessStorySerializer(
            data=data, context={"request": self.mock_request}
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        story = serializer.save()

        self.assertIsNotNone(story.id)
        self.assertIsInstance(story.id, uuid.UUID)
        self.assertGreater(story.created_at, 0)
        self.assertGreater(story.updated_at, 0)
        self.assertEqual(story.created_by_user_id, self.user)

    def test_read_only_fields_ignored_on_create(self):
        data = self._valid_data()
        fake_id = uuid.uuid4()
        data["id"] = str(fake_id)
        data["created_at"] = 9999999
        data["updated_at"] = 9999999
        data["created_by_user_id"] = 999

        serializer = SuccessStorySerializer(
            data=data, context={"request": self.mock_request}
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        story = serializer.save()

        self.assertNotEqual(story.id, fake_id)
        self.assertNotEqual(story.created_at, 9999999)
        self.assertNotEqual(story.updated_at, 9999999)

    def test_create_valid_data(self):
        data = self._valid_data()
        serializer = SuccessStorySerializer(
            data=data, context={"request": self.mock_request}
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        story = serializer.save()

        self.assertEqual(story.title, "A Success Story")
        self.assertEqual(str(story.date), "2024-01-15")
        self.assertEqual(story.status, "WIP")
        self.assertEqual(story.publish_permission, "NO")
        self.assertEqual(str(story.client_id_id), str(self.client_obj.id))


class UpdateSuccessStorySerializerTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create_user(
            username="testworker",
            password="testpass",
            first_name="Test",
            last_name="Worker",
            zone=self.zone.id,
        )
        self.client_obj = create_client(
            user=self.user,
            first="Test",
            last="Client",
            contact="604-555-1234",
            zone=self.zone,
            gender=Client.Gender.MALE,
            hcr_type=Client.HCRType.REFUGEE,
        )
        self.mock_request = type("MockRequest", (), {"user": self.user})()
        self.story = SuccessStory.objects.create(
            id=uuid.uuid4(),
            client_id=self.client_obj,
            created_by_user_id=self.user,
            created_at=1700000000000,
            updated_at=1700000000000,
            title="Original Title",
            date="2024-01-15",
            status=SuccessStory.StoryStatus.WORK_IN_PROGRESS,
            publish_permission=SuccessStory.PublishPermission.NO,
        )

    def test_client_id_is_read_only(self):
        other_client = create_client(
            user=self.user,
            first="Other",
            last="Person",
            contact="604-555-5678",
            zone=self.zone,
            gender=Client.Gender.FEMALE,
        )
        data = {"client_id": str(other_client.id), "title": "Updated Title"}
        serializer = UpdateSuccessStorySerializer(
            self.story, data=data, partial=True, context={"request": self.mock_request}
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_story = serializer.save()

        self.assertEqual(updated_story.client_id, self.client_obj)

    def test_update_sets_updated_at(self):
        original_updated_at = self.story.updated_at
        data = {"title": "New Title"}
        serializer = UpdateSuccessStorySerializer(
            self.story, data=data, partial=True, context={"request": self.mock_request}
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_story = serializer.save()

        self.assertGreater(updated_story.updated_at, original_updated_at)

    def test_update_title(self):
        data = {"title": "Updated Title"}
        serializer = UpdateSuccessStorySerializer(
            self.story, data=data, partial=True, context={"request": self.mock_request}
        )
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_story = serializer.save()

        self.assertEqual(updated_story.title, "Updated Title")
