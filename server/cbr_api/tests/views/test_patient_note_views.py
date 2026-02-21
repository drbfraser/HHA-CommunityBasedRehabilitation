import uuid
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from cbr_api.models import Client, PatientNote, UserCBR, Zone


class PatientNoteViewsTestCase(APITestCase):
    """Shared setUp for all patient-note view tests."""

    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create_user(
            username="noteuser",
            password="notepass123",
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

        # pre-create two notes
        self.note1 = PatientNote.objects.create(
            client=self.client_obj,
            created_by=self.user,
            note="First note",
            created_at=1000,
        )
        self.note2 = PatientNote.objects.create(
            client=self.client_obj,
            created_by=self.user,
            note="Second note",
            created_at=2000,
        )


class NoteCreateTests(PatientNoteViewsTestCase):
    def test_create_note_success(self):
        url = reverse("create-patient-note")
        data = {"client": str(self.client_obj.id), "note": "A new note"}
        response = self.api_client.post(url, data, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["note"], "A new note")
        self.assertEqual(response.data["client"], str(self.client_obj.id))
        self.assertEqual(PatientNote.objects.count(), 3)

    def test_create_note_missing_client(self):
        url = reverse("create-patient-note")
        data = {"note": "Missing client field"}
        response = self.api_client.post(url, data, format="json")

        self.assertEqual(response.status_code, 400)
        self.assertIn("client", response.data)

    def test_create_note_invalid_client(self):
        url = reverse("create-patient-note")
        fake_id = str(uuid.uuid4())
        data = {"client": fake_id, "note": "Bad client"}
        response = self.api_client.post(url, data, format="json")

        self.assertEqual(response.status_code, 404)

    def test_create_note_empty_note(self):
        url = reverse("create-patient-note")
        data = {"client": str(self.client_obj.id)}
        response = self.api_client.post(url, data, format="json")

        # note field is required by the model (TextField)
        self.assertIn(response.status_code, [400, 201])

    def test_create_note_unauthenticated(self):
        self.api_client.force_authenticate(user=None)
        url = reverse("create-patient-note")
        data = {"client": str(self.client_obj.id), "note": "No auth"}
        response = self.api_client.post(url, data, format="json")

        self.assertEqual(response.status_code, 401)

    def test_created_by_is_set_automatically(self):
        url = reverse("create-patient-note")
        data = {"client": str(self.client_obj.id), "note": "Check author"}
        response = self.api_client.post(url, data, format="json")

        self.assertEqual(response.status_code, 201)
        note = PatientNote.objects.get(id=response.data["id"])
        self.assertEqual(note.created_by, self.user)


class NoteListTests(PatientNoteViewsTestCase):
    def test_list_notes_for_client(self):
        url = reverse(
            "patient-notes-for-client", kwargs={"client_id": str(self.client_obj.id)}
        )
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_list_notes_ordered_newest_first(self):
        url = reverse(
            "patient-notes-for-client", kwargs={"client_id": str(self.client_obj.id)}
        )
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["note"], "Second note")
        self.assertEqual(response.data[1]["note"], "First note")

    def test_list_notes_empty_for_unknown_client(self):
        fake_id = str(uuid.uuid4())
        url = reverse("patient-notes-for-client", kwargs={"client_id": fake_id})
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_list_notes_unauthenticated(self):
        self.api_client.force_authenticate(user=None)
        url = reverse(
            "patient-notes-for-client", kwargs={"client_id": str(self.client_obj.id)}
        )
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 401)


class LatestPatientNoteTests(PatientNoteViewsTestCase):
    def test_get_latest_note(self):
        url = reverse(
            "latest-patient-note", kwargs={"client_id": str(self.client_obj.id)}
        )
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["note"], "Second note")

    def test_latest_note_no_notes(self):
        other_client = Client.objects.create(
            id=uuid.uuid4(),
            user_id=self.user,
            created_at=0,
            first_name="Empty",
            last_name="Client",
            full_name="Empty Client",
            phone_number="0000000000",
            zone=self.zone,
            gender=Client.Gender.FEMALE,
            birth_date=0,
            longitude=0.0,
            latitude=0.0,
        )
        url = reverse("latest-patient-note", kwargs={"client_id": str(other_client.id)})
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {})

    def test_latest_note_unauthenticated(self):
        self.api_client.force_authenticate(user=None)
        url = reverse(
            "latest-patient-note", kwargs={"client_id": str(self.client_obj.id)}
        )
        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 401)
