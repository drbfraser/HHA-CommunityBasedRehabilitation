import io
import os
import shutil
import tempfile
import uuid
from datetime import date
from unittest import mock

from django.core.files.base import ContentFile
from django.test import SimpleTestCase, TestCase, override_settings
from PIL import Image

from cbr_api import util
from cbr_api.image_limits import (
    RECORD_IMAGE_BUDGET,
    STORY_PHOTO_BUDGET,
    STORY_PHOTOS_TOTAL_MAX_BYTES,
    ImageTooLargeError,
    drop_oversized_images,
    fit_image,
)
from cbr_api.models import Client, Referral, SuccessStory, UserCBR, Visit, Zone
from cbr_api.tests.helpers import create_client, create_visit


def textured_image(width, height, mode="RGB"):
    """A detailed image (enlarged noise) that compresses poorly, like a busy photo."""
    channels = len(mode)
    small = Image.frombytes(
        mode,
        (width // 4, height // 4),
        os.urandom((width // 4) * (height // 4) * channels),
    )
    return small.resize((width, height), Image.Resampling.BICUBIC)


def encode(image, image_format="JPEG", **kwargs):
    output = io.BytesIO()
    image.save(output, image_format, **kwargs)
    return output.getvalue()


def big_jpeg(width=2000, height=1500):
    return encode(textured_image(width, height), quality=95)


def small_jpeg():
    return encode(Image.new("RGB", (100, 80), "red"), quality=80)


def dimensions(data):
    with Image.open(io.BytesIO(data)) as image:
        return image.size


class FitImageTests(SimpleTestCase):
    def test_image_within_budget_is_returned_unchanged(self):
        original = ContentFile(small_jpeg(), name="small.jpg")
        self.assertIs(fit_image(original, RECORD_IMAGE_BUDGET), original)

    def test_large_story_photo_fits_budget(self):
        data = big_jpeg()
        self.assertGreater(len(data), STORY_PHOTO_BUDGET.max_bytes)
        fitted = fit_image(ContentFile(data, name="big.jpg"), STORY_PHOTO_BUDGET)
        result = fitted.read()
        self.assertLessEqual(len(result), STORY_PHOTO_BUDGET.max_bytes)
        self.assertLessEqual(max(dimensions(result)), 1500)
        self.assertEqual(fitted.name, "temp.jpg")

    def test_large_record_photo_is_reduced_to_400px(self):
        fitted = fit_image(ContentFile(big_jpeg(), name="big.jpg"), RECORD_IMAGE_BUDGET)
        result = fitted.read()
        self.assertLessEqual(len(result), RECORD_IMAGE_BUDGET.max_bytes)
        self.assertEqual(max(dimensions(result)), 400)

    def test_exif_rotation_is_applied(self):
        exif = Image.Exif()
        exif[0x0112] = 6  # Orientation: rotate 90 degrees
        data = encode(textured_image(2000, 1000), quality=95, exif=exif.tobytes())
        fitted = fit_image(ContentFile(data, name="rotated.jpg"), RECORD_IMAGE_BUDGET)
        width, height = dimensions(fitted.read())
        self.assertGreater(height, width)

    def test_transparent_png_becomes_jpeg_on_white(self):
        image = textured_image(1600, 1600, mode="RGBA")
        image.paste((0, 0, 0, 0), (0, 0, 800, 1600))  # Left half fully transparent
        data = encode(image, "PNG")
        self.assertGreater(len(data), RECORD_IMAGE_BUDGET.max_bytes)
        fitted = fit_image(ContentFile(data, name="clear.png"), RECORD_IMAGE_BUDGET)
        with Image.open(io.BytesIO(fitted.read())) as result:
            self.assertEqual(result.format, "JPEG")
            self.assertTrue(
                all(c > 240 for c in result.convert("RGB").getpixel((10, 10)))
            )

    def test_small_non_image_is_kept(self):
        original = ContentFile(b"not an image", name="notes.jpg")
        self.assertIs(fit_image(original, RECORD_IMAGE_BUDGET), original)

    def test_large_non_image_is_rejected(self):
        data = os.urandom(RECORD_IMAGE_BUDGET.max_bytes + 1)
        with self.assertRaises(ImageTooLargeError):
            fit_image(ContentFile(data, name="junk.jpg"), RECORD_IMAGE_BUDGET)

    @mock.patch("PIL.Image.MAX_IMAGE_PIXELS", 1000)
    def test_image_over_pixel_limit_is_rejected(self):
        with self.assertRaises(ImageTooLargeError):
            fit_image(ContentFile(big_jpeg(), name="huge.jpg"), RECORD_IMAGE_BUDGET)

    def test_image_that_cannot_fit_is_rejected(self):
        with self.assertRaises(ImageTooLargeError):
            fit_image(
                ContentFile(big_jpeg(), name="big.jpg"),
                STORY_PHOTO_BUDGET,
                max_bytes=2000,
            )


class ImageBudgetModelTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.media_root = tempfile.mkdtemp()
        cls.media_override = override_settings(MEDIA_ROOT=cls.media_root)
        cls.media_override.enable()

    @classmethod
    def tearDownClass(cls):
        cls.media_override.disable()
        shutil.rmtree(cls.media_root, ignore_errors=True)
        super().tearDownClass()

    def setUp(self):
        self.zone = Zone.objects.create(zone_name="Test Zone")
        self.user = UserCBR.objects.create(
            username="imageuser", password="pw", is_superuser=False, zone=self.zone
        )
        self.client_obj = create_client(
            user=self.user,
            first="Image",
            last="Client",
            gender=Client.Gender.FEMALE,
            contact="604-555-0101",
            zone=self.zone,
        )

    def make_story(self, **photos):
        return SuccessStory.objects.create(
            client_id=self.client_obj,
            created_by_user_id=self.user,
            title="Story",
            date=date(2024, 1, 1),
            **photos,
        )

    def stored_bytes(self, field_file):
        field_file.open("rb")
        try:
            return field_file.read()
        finally:
            field_file.close()


class RecordImageModelTests(ImageBudgetModelTestCase):
    def test_new_client_picture_is_fitted(self):
        self.client_obj.picture = ContentFile(big_jpeg(), name="big.jpg")
        self.client_obj.save()
        data = self.stored_bytes(Client.objects.get(pk=self.client_obj.pk).picture)
        self.assertLessEqual(len(data), RECORD_IMAGE_BUDGET.max_bytes)
        self.assertEqual(max(dimensions(data)), 400)

    def test_small_picture_is_stored_unchanged(self):
        original = small_jpeg()
        self.client_obj.picture = ContentFile(original, name="small.jpg")
        self.client_obj.save()
        self.assertEqual(self.stored_bytes(self.client_obj.picture), original)

    def test_visit_picture_is_fitted(self):
        visit = create_visit(
            client=self.client_obj, user=self.user, zone=self.zone, created_at=0
        )
        visit.picture = ContentFile(big_jpeg(), name="big.jpg")
        visit.save()
        data = self.stored_bytes(Visit.objects.get(pk=visit.pk).picture)
        self.assertLessEqual(len(data), RECORD_IMAGE_BUDGET.max_bytes)

    def test_referral_picture_is_fitted_on_create(self):
        referral = Referral.objects.create(
            id=str(uuid.uuid4()),
            user_id=self.user,
            client_id=self.client_obj,
            date_referred=0,
            outcome="",
            picture=ContentFile(big_jpeg(), name="big.jpg"),
        )
        data = self.stored_bytes(Referral.objects.get(pk=referral.pk).picture)
        self.assertLessEqual(len(data), RECORD_IMAGE_BUDGET.max_bytes)

    def test_oversized_non_image_is_rejected(self):
        self.client_obj.picture = ContentFile(os.urandom(300 * 1024), name="junk.jpg")
        with self.assertRaises(ImageTooLargeError):
            self.client_obj.save()

    def test_oversized_non_image_is_dropped_during_sync(self):
        self.client_obj.picture = ContentFile(small_jpeg(), name="small.jpg")
        self.client_obj.save()
        stored_name = Client.objects.get(pk=self.client_obj.pk).picture.name

        client = Client.objects.get(pk=self.client_obj.pk)
        client.picture = ContentFile(os.urandom(300 * 1024), name="junk.jpg")
        with drop_oversized_images(), self.assertLogs(
            "cbr_api.image_limits", "WARNING"
        ):
            client.save()
        self.assertEqual(Client.objects.get(pk=client.pk).picture.name, stored_name)


class StoryPhotoModelTests(ImageBudgetModelTestCase):
    def test_new_story_photos_fit_per_photo_and_total_budgets(self):
        photos = {
            name: ContentFile(big_jpeg(), name=f"{name}.jpg")
            for name in SuccessStory.PHOTO_FIELDS
        }
        story = SuccessStory.objects.get(pk=self.make_story(**photos).pk)
        sizes = [
            len(self.stored_bytes(getattr(story, name))) for name in story.PHOTO_FIELDS
        ]
        self.assertTrue(
            all(size <= STORY_PHOTO_BUDGET.max_bytes for size in sizes), sizes
        )
        self.assertLessEqual(sum(sizes), STORY_PHOTOS_TOTAL_MAX_BYTES)

    def test_photo_without_room_left_is_rejected_or_dropped_during_sync(self):
        story = self.make_story(photo=ContentFile(big_jpeg(), name="photo.jpg"))
        stored = SuccessStory.objects.get(pk=story.pk).photo.size

        # Leave room for only 1 KB more than the stored photo.
        with mock.patch("cbr_api.models.STORY_PHOTOS_TOTAL_MAX_BYTES", stored + 1024):
            story = SuccessStory.objects.get(pk=story.pk)
            story.photo_2 = ContentFile(big_jpeg(), name="photo_2.jpg")
            with self.assertRaises(ImageTooLargeError):
                story.save()

            story = SuccessStory.objects.get(pk=story.pk)
            story.photo_2 = ContentFile(big_jpeg(), name="photo_2.jpg")
            with drop_oversized_images(), self.assertLogs(
                "cbr_api.image_limits", "WARNING"
            ):
                story.save()
        story = SuccessStory.objects.get(pk=story.pk)
        self.assertTrue(story.photo)
        self.assertFalse(story.photo_2)


class ReferralSyncUpdateTests(ImageBudgetModelTestCase):
    def test_updated_referral_picture_is_stored(self):
        referral = Referral.objects.create(
            id=str(uuid.uuid4()),
            user_id=self.user,
            client_id=self.client_obj,
            date_referred=0,
            outcome="",
        )
        validated_data = {
            "referrals": {
                "created": [],
                "updated": [
                    {
                        "id": referral.id,
                        "outcome": "Done",
                        "picture": ContentFile(big_jpeg(), name="temp.jpg"),
                    }
                ],
            }
        }
        util.create_referral_data(validated_data, self.user.username, sync_time=1234)

        referral = Referral.objects.get(pk=referral.pk)
        self.assertEqual(referral.outcome, "Done")
        self.assertTrue(referral.picture.name.endswith(f"referral-{referral.id}.jpg"))
        self.assertLessEqual(
            len(self.stored_bytes(referral.picture)), RECORD_IMAGE_BUDGET.max_bytes
        )
