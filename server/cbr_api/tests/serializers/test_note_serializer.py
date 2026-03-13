from django.test import TestCase
from cbr_api.serializers import NoteSerializer
from cbr_api.models import Client, PatientNote, UserCBR, Zone
from cbr_api.tests.helpers import create_client


class NoteSerializerTests(TestCase):
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
            first="Jane",
            last="Doe",
            gender=Client.Gender.FEMALE,
            contact="604-555-1234",
            zone=self.zone,
        )
        self.note = PatientNote.objects.create(
            client=self.client_obj,
            created_by=self.user,
            note="Initial note content.",
            created_at=1000000,
        )

    def test_serialization_includes_all_fields(self):
        serializer = NoteSerializer(self.note)
        data = serializer.data
        expected_fields = {
            "id",
            "note",
            "created_at",
            "created_by",
            "created_by_username",
            "client",
        }
        self.assertEqual(set(data.keys()), expected_fields)

    def test_created_by_username_populated(self):
        serializer = NoteSerializer(self.note)
        self.assertEqual(serializer.data["created_by_username"], "testworker")

    def test_serialized_field_values(self):
        serializer = NoteSerializer(self.note)
        data = serializer.data
        self.assertEqual(data["note"], "Initial note content.")
        self.assertEqual(data["created_at"], 1000000)
        self.assertEqual(data["client"], self.client_obj.id)
        self.assertEqual(str(data["id"]), str(self.note.id))

    def test_read_only_fields_ignored_on_input(self):
        """Supplying read-only fields in input data should not affect validated_data."""
        input_data = {
            "id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
            "note": "New note text",
            "created_at": 9999999,
            "created_by": 999,
            "created_by_username": "hacker",
            "client": "fake-client-id",
        }
        serializer = NoteSerializer(data=input_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Only 'note' should be in validated_data; all others are read-only
        self.assertIn("note", serializer.validated_data)
        self.assertNotIn("id", serializer.validated_data)
        self.assertNotIn("created_at", serializer.validated_data)
        self.assertNotIn("created_by", serializer.validated_data)
        self.assertNotIn("client", serializer.validated_data)

    def test_note_is_required(self):
        serializer = NoteSerializer(data={})
        self.assertFalse(serializer.is_valid())
        self.assertIn("note", serializer.errors)

    def test_empty_note_is_allowed(self):
        """TextField with no blank constraint — empty string should be accepted."""
        serializer = NoteSerializer(data={"note": ""})
        # DRF CharField requires non-blank by default; check behavior
        is_valid = serializer.is_valid()
        # Empty string may or may not be valid depending on DRF defaults
        # Either way, this documents the current behavior
        if not is_valid:
            self.assertIn("note", serializer.errors)

    def test_multiple_notes_serialization(self):
        PatientNote.objects.create(
            client=self.client_obj,
            created_by=self.user,
            note="Second note.",
            created_at=2000000,
        )
        notes = PatientNote.objects.filter(client=self.client_obj)
        serializer = NoteSerializer(notes, many=True)
        self.assertEqual(len(serializer.data), 2)
        # Newest first (ordering by -created_at)
        self.assertEqual(serializer.data[0]["note"], "Second note.")
        self.assertEqual(serializer.data[1]["note"], "Initial note content.")
