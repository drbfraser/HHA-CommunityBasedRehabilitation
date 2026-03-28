import uuid
from datetime import date

from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from cbr_api.models import Client, SuccessStory, UserCBR, Zone


class SuccessStoryViewsTestCase(APITestCase):
    """Shared setUp for all success-story view tests."""

    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create_user(
            username="storyuser",
            password="storypass123",
            zone=self.zone.id,
        )
        self.client_obj = Client.objects.create(
            id=uuid.uuid4(),
            user_id=self.user,
            created_at=0,
            first_name="Test",
            last_name="Client",
            full_name="Test Client",
            phone_number="1234567890",
            zone=self.zone,
            gender=Client.Gender.MALE,
            birth_date=0,
            longitude=0.0,
            latitude=0.0,
        )
        self.api_client = APIClient()
        self.api_client.force_authenticate(user=self.user)

        # pre-create two stories
        self.story1 = SuccessStory.objects.create(
            id=uuid.uuid4(),
            client_id=self.client_obj,
            created_by_user_id=self.user,
            title="First Story",
            date=date(2024, 1, 15),
            created_at=1000,
            updated_at=1000,
        )
        self.story2 = SuccessStory.objects.create(
            id=uuid.uuid4(),
            client_id=self.client_obj,
            created_by_user_id=self.user,
            title="Second Story",
            date=date(2024, 2, 20),
            created_at=2000,
            updated_at=2000,
        )


class SuccessStoryListTests(SuccessStoryViewsTestCase):
    def test_list_stories(self):
        url = reverse("success-story-list")
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_list_stories_filtered_by_client_id(self):
        # Create a second client with no stories
        other_client = Client.objects.create(
            id=uuid.uuid4(),
            user_id=self.user,
            created_at=0,
            first_name="Other",
            last_name="Client",
            full_name="Other Client",
            phone_number="0000000000",
            zone=self.zone,
            gender=Client.Gender.FEMALE,
            birth_date=0,
            longitude=0.0,
            latitude=0.0,
        )
        SuccessStory.objects.create(
            id=uuid.uuid4(),
            client_id=other_client,
            created_by_user_id=self.user,
            title="Other Client Story",
            date=date(2024, 3, 10),
            created_at=3000,
            updated_at=3000,
        )

        url = reverse("success-story-list")
        response = self.api_client.get(url, {"client_id": str(self.client_obj.id)})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        for story in response.data:
            self.assertEqual(story["client_id"], str(self.client_obj.id))

    def test_list_stories_empty(self):
        SuccessStory.objects.all().delete()
        url = reverse("success-story-list")
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_create_story_success(self):
        url = reverse("success-story-list")
        data = {
            "client_id": str(self.client_obj.id),
            "title": "New Story",
            "date": "2024-01-15",
        }
        response = self.api_client.post(url, data, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], "New Story")
        self.assertEqual(response.data["client_id"], str(self.client_obj.id))
        self.assertEqual(SuccessStory.objects.count(), 3)

    def test_create_story_missing_date(self):
        url = reverse("success-story-list")
        data = {
            "client_id": str(self.client_obj.id),
            "title": "No Date Story",
        }
        response = self.api_client.post(url, data, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("date", response.data)

    def test_create_story_missing_client_id(self):
        url = reverse("success-story-list")
        data = {
            "title": "No Client Story",
            "date": "2024-01-15",
        }
        response = self.api_client.post(url, data, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("client_id", response.data)

    def test_create_story_unauthenticated(self):
        self.api_client.force_authenticate(user=None)
        url = reverse("success-story-list")
        data = {
            "client_id": str(self.client_obj.id),
            "title": "No Auth Story",
            "date": "2024-01-15",
        }
        response = self.api_client.post(url, data, format="json")

        self.assertEqual(response.status_code, 401)

    def test_list_stories_unauthenticated(self):
        self.api_client.force_authenticate(user=None)
        url = reverse("success-story-list")
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 401)

    def test_created_by_user_set_automatically(self):
        url = reverse("success-story-list")
        data = {
            "client_id": str(self.client_obj.id),
            "title": "Check Author",
            "date": "2024-01-15",
        }
        response = self.api_client.post(url, data, format="json")

        self.assertEqual(response.status_code, 201)
        story = SuccessStory.objects.get(id=response.data["id"])
        self.assertEqual(story.created_by_user_id, self.user)


class SuccessStoryDetailTests(SuccessStoryViewsTestCase):
    def test_retrieve_story(self):
        url = reverse("success-story-detail", kwargs={"pk": str(self.story1.id)})
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "First Story")
        self.assertEqual(response.data["id"], str(self.story1.id))

    def test_retrieve_nonexistent_story(self):
        fake_id = str(uuid.uuid4())
        url = reverse("success-story-detail", kwargs={"pk": fake_id})
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 404)

    def test_update_story(self):
        url = reverse("success-story-detail", kwargs={"pk": str(self.story1.id)})
        data = {
            "title": "Updated Title",
            "date": "2024-06-01",
            "refugee_origin": "Updated Origin",
        }
        response = self.api_client.put(url, data, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "Updated Title")
        self.assertEqual(response.data["refugee_origin"], "Updated Origin")

    def test_update_story_unauthenticated(self):
        self.api_client.force_authenticate(user=None)
        url = reverse("success-story-detail", kwargs={"pk": str(self.story1.id)})
        data = {
            "title": "Should Fail",
            "date": "2024-06-01",
        }
        response = self.api_client.put(url, data, format="json")

        self.assertEqual(response.status_code, 401)

    def test_retrieve_story_unauthenticated(self):
        self.api_client.force_authenticate(user=None)
        url = reverse("success-story-detail", kwargs={"pk": str(self.story1.id)})
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 401)

    def test_update_cannot_change_client_id(self):
        other_client = Client.objects.create(
            id=uuid.uuid4(),
            user_id=self.user,
            created_at=0,
            first_name="Other",
            last_name="Client",
            full_name="Other Client",
            phone_number="0000000000",
            zone=self.zone,
            gender=Client.Gender.FEMALE,
            birth_date=0,
            longitude=0.0,
            latitude=0.0,
        )
        url = reverse("success-story-detail", kwargs={"pk": str(self.story1.id)})
        data = {
            "client_id": str(other_client.id),
            "title": "Try Change Client",
            "date": "2024-06-01",
        }
        response = self.api_client.put(url, data, format="json")

        self.assertEqual(response.status_code, 200)
        # client_id should remain unchanged because it is read-only on update
        self.assertEqual(response.data["client_id"], str(self.client_obj.id))

    def test_response_includes_computed_fields(self):
        url = reverse("success-story-detail", kwargs={"pk": str(self.story1.id)})
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertIn("written_by_name", response.data)
        self.assertIn("beneficiary_age", response.data)
        self.assertIn("beneficiary_gender", response.data)
        self.assertIn("hcr_status", response.data)
        self.assertIn("client_name", response.data)
