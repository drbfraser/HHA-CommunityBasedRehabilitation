import uuid
from datetime import date
from django.test import TestCase
from django.db import IntegrityError
from cbr_api.models import Client, SuccessStory, UserCBR, Zone
from cbr_api.tests.helpers import create_client


class SuccessStoryModelTests(TestCase):
    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create(
            username="testworker",
            password="testpass",
            is_superuser=False,
            zone=self.zone,
        )
        self.client_obj = create_client(
            user=self.user,
            first="Test",
            last="Client",
            gender=Client.Gender.MALE,
            contact="604-555-0000",
            zone=self.zone,
        )

    def test_create_success_story(self):
        story = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            title="A Great Recovery",
            date=date(2024, 1, 15),
        )
        self.assertIsNotNone(story.id)
        self.assertIsInstance(story.id, uuid.UUID)
        self.assertEqual(story.client_id, self.client_obj)
        self.assertEqual(story.created_by_user_id, self.user)
        self.assertEqual(story.title, "A Great Recovery")
        self.assertEqual(story.date, date(2024, 1, 15))

    def test_uuid_auto_generated(self):
        story1 = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
        )
        story2 = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
        )
        self.assertNotEqual(story1.id, story2.id)

    def test_created_at_auto_set(self):
        story = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
        )
        self.assertGreater(story.created_at, 0)

    def test_updated_at_auto_set(self):
        story = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
        )
        self.assertGreater(story.updated_at, 0)

    def test_ordering_newest_first(self):
        story_old = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
            created_at=1000,
        )
        story_new = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
            created_at=2000,
        )
        stories = list(SuccessStory.objects.all())
        self.assertEqual(stories[0], story_new)
        self.assertEqual(stories[1], story_old)

    def test_client_cascade_deletes_stories(self):
        SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
        )
        self.assertEqual(SuccessStory.objects.count(), 1)
        self.client_obj.delete()
        self.assertEqual(SuccessStory.objects.count(), 0)

    def test_created_by_user_protect(self):
        SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
        )
        with self.assertRaises(Exception):
            self.user.delete()

    def test_client_related_name(self):
        SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            title="Via related name",
            date=date(2024, 1, 15),
        )
        self.assertEqual(self.client_obj.success_stories.count(), 1)
        self.assertEqual(
            self.client_obj.success_stories.first().title, "Via related name"
        )

    def test_user_related_name(self):
        SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
        )
        self.assertEqual(self.user.created_success_stories.count(), 1)

    def test_default_status_is_wip(self):
        story = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
        )
        self.assertEqual(story.status, "WIP")

    def test_default_publish_permission_is_no(self):
        story = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
        )
        self.assertEqual(story.publish_permission, "NO")

    def test_title_max_length(self):
        field = SuccessStory._meta.get_field("title")
        self.assertEqual(field.max_length, 300)

    def test_optional_text_fields_default_empty(self):
        story = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
        )
        self.assertEqual(story.title, "")
        self.assertEqual(story.refugee_origin, "")
        self.assertEqual(story.refugee_duration, "")
        self.assertEqual(story.diagnosis, "")
        self.assertEqual(story.treatment_service, "")
        self.assertEqual(story.part1_background, "")
        self.assertEqual(story.part2_challenge, "")
        self.assertEqual(story.part3_introduction, "")
        self.assertEqual(story.part4_action, "")
        self.assertEqual(story.part5_impact, "")

    def test_photo_is_optional(self):
        story = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
        )
        self.assertFalse(story.photo)

    def test_date_field_required(self):
        with self.assertRaises(IntegrityError):
            SuccessStory.objects.create(
                client_id=self.client_obj,
                created_by_user_id=self.user,
            )

    def test_status_choices(self):
        story_wip = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
            status="WIP",
        )
        self.assertEqual(story_wip.status, "WIP")

        story_ready = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
            status="READY",
        )
        self.assertEqual(story_ready.status, "READY")

    def test_publish_permission_choices(self):
        story_yes = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
            publish_permission="YES",
        )
        self.assertEqual(story_yes.publish_permission, "YES")

        story_no = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
            publish_permission="NO",
        )
        self.assertEqual(story_no.publish_permission, "NO")

        story_anon = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            date=date(2024, 1, 15),
            publish_permission="ANON",
        )
        self.assertEqual(story_anon.publish_permission, "ANON")
