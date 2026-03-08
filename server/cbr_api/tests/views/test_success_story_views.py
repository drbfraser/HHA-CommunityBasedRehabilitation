from datetime import date, datetime, timezone
import uuid

from django.urls import reverse
from rest_framework.test import APITestCase, APIClient

from cbr_api.models import Client, SuccessStory, UserCBR, Zone
from cbr_api.tests.helpers import create_client


class SuccessStoryViewsTestCase(APITestCase):
    def birth_date_ms(self, year, month, day):
        return int(datetime(year, month, day, tzinfo=timezone.utc).timestamp() * 1000)

    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create_user(
            username="storyuser",
            password="storypass123",
            first_name="Story",
            last_name="Author",
            zone=self.zone.id,
        )
        self.other_user = UserCBR.objects.create_user(
            username="otherstoryuser",
            password="storypass456",
            first_name="Other",
            last_name="Author",
            zone=self.zone.id,
        )

        self.client_obj = create_client(
            user=self.user,
            first="Amina",
            last="Example",
            contact="1234567890",
            zone=self.zone,
            gender=Client.Gender.FEMALE,
            birth_date=self.birth_date_ms(1990, 5, 10),
            hcr_type=Client.HCRType.REFUGEE,
        )
        self.other_client = create_client(
            user=self.other_user,
            first="David",
            last="Example",
            contact="0987654321",
            zone=self.zone,
            gender=Client.Gender.MALE,
            birth_date=self.birth_date_ms(2012, 7, 15),
            hcr_type=Client.HCRType.HOST_COMMUNITY,
        )

        self.story1 = SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            created_at=1000,
            updated_at=1500,
            refugee_origin="DRC",
            refugee_duration="3 years",
            diagnosis="Lower limb disability",
            treatment_service="Wheelchair provision",
            part1_background="Background 1",
            part2_challenge="Challenge 1",
            part3_introduction="Introduction 1",
            part4_action="Action 1",
            part5_impact="Impact 1",
            photo="",
            publish_permission=SuccessStory.PublishPermission.YES,
            status=SuccessStory.StoryStatus.READY,
            date=date(2026, 1, 10),
        )
        self.story2 = SuccessStory.objects.create(
            client_id=self.other_client,
            created_by_user_id=self.other_user,
            created_at=2000,
            updated_at=2500,
            refugee_origin="",
            refugee_duration="",
            diagnosis="Cerebral palsy",
            treatment_service="Physiotherapy",
            part1_background="Background 2",
            part2_challenge="Challenge 2",
            part3_introduction="Introduction 2",
            part4_action="Action 2",
            part5_impact="Impact 2",
            photo="",
            publish_permission=SuccessStory.PublishPermission.ANONYMOUS,
            status=SuccessStory.StoryStatus.WORK_IN_PROGRESS,
            date=date(2026, 2, 11),
        )

        self.api_client = APIClient()
        self.api_client.force_authenticate(user=self.user)


class SuccessStoryListTests(SuccessStoryViewsTestCase):
    def test_list_success_stories(self):
        url = reverse("success-story-list")
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["id"], str(self.story2.id))
        self.assertEqual(response.data[1]["id"], str(self.story1.id))

    def test_list_success_stories_filtered_by_client_id(self):
        url = reverse("success-story-list")
        response = self.api_client.get(url, {"client_id": str(self.client_obj.id)})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], str(self.story1.id))

    def test_create_success_story(self):
        url = reverse("success-story-list")
        data = {
            "client_id": str(self.client_obj.id),
            "written_by_name": "Ignored Name",
            "beneficiary_age": 99,
            "beneficiary_gender": "X",
            "hcr_status": "Ignored Status",
            "refugee_origin": "South Sudan",
            "refugee_duration": "2 years",
            "diagnosis": "Updated diagnosis",
            "treatment_service": "Community rehabilitation",
            "part1_background": "Part 1",
            "part2_challenge": "Part 2",
            "part3_introduction": "Part 3",
            "part4_action": "Part 4",
            "part5_impact": "Part 5",
            "photo": "data:image/png;base64,abc123",
            "publish_permission": SuccessStory.PublishPermission.NO,
            "status": SuccessStory.StoryStatus.WORK_IN_PROGRESS,
            "date": "2026-03-01",
        }
        response = self.api_client.post(url, data, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(SuccessStory.objects.count(), 3)

        created_story = SuccessStory.objects.get(id=response.data["id"])
        self.assertEqual(created_story.created_by_user_id, self.user)
        self.assertEqual(response.data["written_by_name"], "Story Author")
        self.assertEqual(response.data["beneficiary_gender"], Client.Gender.FEMALE)
        self.assertEqual(response.data["hcr_status"], "Refugee")

    def test_list_success_stories_unauthenticated(self):
        self.api_client.force_authenticate(user=None)
        url = reverse("success-story-list")

        self.assertEqual(self.api_client.get(url).status_code, 401)
        self.assertEqual(self.api_client.post(url, {}, format="json").status_code, 401)


class SuccessStoryDetailTests(SuccessStoryViewsTestCase):
    def test_get_success_story_detail(self):
        url = reverse("success-story-detail", kwargs={"pk": self.story1.id})
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], str(self.story1.id))
        self.assertEqual(response.data["written_by_name"], "Story Author")
        self.assertEqual(response.data["beneficiary_gender"], Client.Gender.FEMALE)
        self.assertEqual(response.data["hcr_status"], "Refugee")

    def test_get_nonexistent_success_story(self):
        url = reverse("success-story-detail", kwargs={"pk": uuid.uuid4()})
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 404)

    def test_update_success_story(self):
        previous_updated_at = self.story1.updated_at
        url = reverse("success-story-detail", kwargs={"pk": self.story1.id})
        data = {
            "refugee_origin": "Uganda",
            "refugee_duration": "4 years",
            "diagnosis": "Updated diagnosis",
            "treatment_service": "Updated treatment",
            "part1_background": "Updated part 1",
            "part2_challenge": "Updated part 2",
            "part3_introduction": "Updated part 3",
            "part4_action": "Updated part 4",
            "part5_impact": "Updated part 5",
            "photo": "",
            "publish_permission": SuccessStory.PublishPermission.ANONYMOUS,
            "status": SuccessStory.StoryStatus.WORK_IN_PROGRESS,
            "date": "2026-03-02",
        }
        response = self.api_client.put(url, data, format="json")

        self.assertEqual(response.status_code, 200)
        self.story1.refresh_from_db()
        self.assertEqual(self.story1.diagnosis, "Updated diagnosis")
        self.assertEqual(self.story1.publish_permission, SuccessStory.PublishPermission.ANONYMOUS)
        self.assertGreater(self.story1.updated_at, previous_updated_at)

    def test_detail_success_story_unauthenticated(self):
        self.api_client.force_authenticate(user=None)
        url = reverse("success-story-detail", kwargs={"pk": self.story1.id})

        self.assertEqual(self.api_client.get(url).status_code, 401)
        self.assertEqual(self.api_client.put(url, {}, format="json").status_code, 401)