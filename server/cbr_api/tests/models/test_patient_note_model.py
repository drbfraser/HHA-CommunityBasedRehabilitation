import uuid
from django.test import TestCase
from django.db import IntegrityError
from cbr_api.models import Client, PatientNote, UserCBR, Zone
from cbr_api.tests.helpers import create_client


class PatientNoteModelTests(TestCase):
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

    def test_create_patient_note(self):
        note = PatientNote.objects.create(
            client=self.client_obj,
            created_by=self.user,
            note="Patient is doing well.",
        )
        self.assertIsNotNone(note.id)
        self.assertIsInstance(note.id, uuid.UUID)
        self.assertEqual(note.client, self.client_obj)
        self.assertEqual(note.created_by, self.user)
        self.assertEqual(note.note, "Patient is doing well.")

    def test_uuid_auto_generated(self):
        note1 = PatientNote.objects.create(
            client=self.client_obj, created_by=self.user, note="Note 1"
        )
        note2 = PatientNote.objects.create(
            client=self.client_obj, created_by=self.user, note="Note 2"
        )
        self.assertNotEqual(note1.id, note2.id)

    def test_created_at_auto_set(self):
        note = PatientNote.objects.create(
            client=self.client_obj, created_by=self.user, note="Timestamp test"
        )
        self.assertGreater(note.created_at, 0)

    def test_ordering_newest_first(self):
        note_old = PatientNote.objects.create(
            client=self.client_obj,
            created_by=self.user,
            note="Old note",
            created_at=1000,
        )
        note_new = PatientNote.objects.create(
            client=self.client_obj,
            created_by=self.user,
            note="New note",
            created_at=2000,
        )
        notes = list(PatientNote.objects.all())
        self.assertEqual(notes[0], note_new)
        self.assertEqual(notes[1], note_old)

    def test_client_cascade_deletes_notes(self):
        PatientNote.objects.create(
            client=self.client_obj, created_by=self.user, note="Will be deleted"
        )
        self.assertEqual(PatientNote.objects.count(), 1)
        self.client_obj.delete()
        self.assertEqual(PatientNote.objects.count(), 0)

    def test_created_by_protect_prevents_user_deletion(self):
        PatientNote.objects.create(
            client=self.client_obj, created_by=self.user, note="Protects user"
        )
        with self.assertRaises(Exception):
            self.user.delete()

    def test_client_related_name(self):
        PatientNote.objects.create(
            client=self.client_obj, created_by=self.user, note="Via related name"
        )
        self.assertEqual(self.client_obj.notes.count(), 1)
        self.assertEqual(self.client_obj.notes.first().note, "Via related name")

    def test_user_related_name(self):
        PatientNote.objects.create(
            client=self.client_obj, created_by=self.user, note="Via user related name"
        )
        self.assertEqual(self.user.patient_notes.count(), 1)

    def test_note_field_required(self):
        with self.assertRaises(IntegrityError):
            PatientNote.objects.create(
                client=self.client_obj, created_by=self.user, note=None
            )

    def test_client_field_required(self):
        with self.assertRaises(IntegrityError):
            PatientNote.objects.create(
                client=None, created_by=self.user, note="No client"
            )

    def test_created_by_field_required(self):
        with self.assertRaises(IntegrityError):
            PatientNote.objects.create(
                client=self.client_obj, created_by=None, note="No author"
            )

