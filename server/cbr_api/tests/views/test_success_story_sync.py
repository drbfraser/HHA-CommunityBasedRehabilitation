import uuid

from rest_framework.test import APITestCase, APIClient
from cbr_api.models import Client, SuccessStory, UserCBR, Zone


def empty_table():
    return {"created": [], "updated": [], "deleted": []}


def empty_changes():
    """A full watermelon `changes` skeleton with every synced table empty."""
    return {
        "users": empty_table(),
        "clients": empty_table(),
        "risks": empty_table(),
        "referrals": empty_table(),
        "surveys": empty_table(),
        "visits": empty_table(),
        "improvements": empty_table(),
        "alert": empty_table(),
        "patient_notes": empty_table(),
        "success_stories": empty_table(),
    }


class SuccessStorySyncTestCase(APITestCase):
    """Round-trip tests for success-story sync (push + pull)."""

    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create_user(
            username="syncuser",
            password="syncpass123",
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

    def _push(self, changes, last_pulled_at=0):
        return self.api_client.post(
            f"/api/sync/?last_pulled_at={last_pulled_at}&api_version=5.0.0",
            changes,
            format="json",
        )

    def _pull(self, last_pulled_at):
        return self.api_client.get(
            f"/api/sync/?last_pulled_at={last_pulled_at}&api_version=5.0.0"
        )

    def test_push_creates_story_and_stamps_author(self):
        story_id = str(uuid.uuid4())
        changes = empty_changes()
        changes["success_stories"]["created"] = [
            {
                "id": story_id,
                "client_id": str(self.client_obj.id),
                "title": "Pushed Story",
                "refugee_origin": "",
                "refugee_duration": "",
                "diagnosis": "",
                "treatment_service": "",
                "part1_background": "Background text",
                "part2_challenge": "",
                "part3_introduction": "",
                "part4_action": "",
                "part5_impact": "",
                "publish_permission": "NO",
                "status": "WIP",
                "date": "2024-01-15",
                "created_at": 1000,
                "updated_at": 1000,
            }
        ]

        response = self._push(changes)

        self.assertEqual(response.status_code, 201)
        story = SuccessStory.objects.get(pk=story_id)
        self.assertEqual(story.title, "Pushed Story")
        # author is stamped server-side from the request user
        self.assertEqual(story.created_by_user_id_id, self.user.pk)
        self.assertEqual(str(story.client_id_id), str(self.client_obj.pk))

    def test_pull_returns_created_story(self):
        story = SuccessStory.objects.create(
            id=uuid.uuid4(),
            client_id=self.client_obj,
            created_by_user_id=self.user,
            title="Server Story",
            date="2024-02-20",
            created_at=2000,
            updated_at=2000,
            server_created_at=5000,
        )

        response = self._pull(last_pulled_at=4000)

        self.assertEqual(response.status_code, 200)
        created = response.data["changes"]["success_stories"]["created"]
        ids = [s["id"] for s in created]
        self.assertIn(str(story.id), ids)

    def test_pull_excludes_already_synced_story(self):
        SuccessStory.objects.create(
            id=uuid.uuid4(),
            client_id=self.client_obj,
            created_by_user_id=self.user,
            title="Old Story",
            date="2024-01-01",
            created_at=1000,
            updated_at=1000,
            server_created_at=1000,
        )

        # client last pulled after the story was created on the server
        response = self._pull(last_pulled_at=2000)

        self.assertEqual(response.status_code, 200)
        created = response.data["changes"]["success_stories"]["created"]
        self.assertEqual(created, [])

    def test_push_then_pull_round_trip(self):
        story_id = str(uuid.uuid4())
        changes = empty_changes()
        changes["success_stories"]["created"] = [
            {
                "id": story_id,
                "client_id": str(self.client_obj.id),
                "title": "Round Trip",
                "refugee_origin": "",
                "refugee_duration": "",
                "diagnosis": "",
                "treatment_service": "",
                "part1_background": "",
                "part2_challenge": "",
                "part3_introduction": "",
                "part4_action": "",
                "part5_impact": "",
                "publish_permission": "NO",
                "status": "WIP",
                "date": "2024-03-10",
                "created_at": 3000,
                "updated_at": 3000,
            }
        ]
        # the push stamps server_created_at = last_pulled_at, so use a realistic
        # timestamp and then pull from before it
        self.assertEqual(self._push(changes, last_pulled_at=1000).status_code, 201)

        response = self._pull(last_pulled_at=500)
        created = response.data["changes"]["success_stories"]["created"]
        match = next(s for s in created if s["id"] == story_id)
        self.assertEqual(match["title"], "Round Trip")
        # no photo on this story, so the pulled photo field is empty
        self.assertIn("photo", match)
        self.assertFalse(match["photo"])

    def test_push_story_with_photo_saves_file(self):
        # 1x1 PNG
        png_b64 = (
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAA"
            "DUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        )
        story_id = str(uuid.uuid4())
        changes = empty_changes()
        changes["success_stories"]["created"] = [
            {
                "id": story_id,
                "client_id": str(self.client_obj.id),
                "title": "Story With Photo",
                "refugee_origin": "",
                "refugee_duration": "",
                "diagnosis": "",
                "treatment_service": "",
                "part1_background": "",
                "part2_challenge": "",
                "part3_introduction": "",
                "part4_action": "",
                "part5_impact": "",
                "publish_permission": "NO",
                "status": "WIP",
                "date": "2024-04-01",
                "photo": f"data:image/png;base64,{png_b64}",
                "created_at": 4000,
                "updated_at": 4000,
            }
        ]

        response = self._push(changes, last_pulled_at=1000)

        self.assertEqual(response.status_code, 201)
        story = SuccessStory.objects.get(pk=story_id)
        self.assertTrue(story.photo)
        self.assertTrue(story.photo.name.endswith(".png"))

        # the image endpoint serves the stored binary
        img_response = self.api_client.get(f"/api/successstories/photo/{story_id}")
        self.assertEqual(img_response.status_code, 200)
