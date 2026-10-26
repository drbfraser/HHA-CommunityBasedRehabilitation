from unittest import mock

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase
from rest_framework import serializers

from cbr_api.serializers import ClientCreateSerializer, SuccessStorySerializer
from cbr_api.util import decode_image, validate_image_size

# A valid 1x1 PNG (70 bytes once decoded).
TINY_PNG_DATA_URL = (
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChw"
    "GA60e6kgAAAABJRU5ErkJggg=="
)


class ValidateImageSizeTests(SimpleTestCase):
    @mock.patch("cbr_api.util.MAX_IMAGE_BYTES", 100)
    def test_accepts_image_at_limit(self):
        validate_image_size(SimpleUploadedFile("photo.jpg", b"x" * 100))

    @mock.patch("cbr_api.util.MAX_IMAGE_BYTES", 100)
    def test_rejects_image_over_limit(self):
        with self.assertRaises(serializers.ValidationError):
            validate_image_size(SimpleUploadedFile("photo.jpg", b"x" * 101))


class ImageSizeLimitMixinTests(SimpleTestCase):
    def test_limit_added_to_client_picture(self):
        fields = ClientCreateSerializer().fields
        self.assertIn(validate_image_size, fields["picture"].validators)

    def test_limit_added_to_every_success_story_photo(self):
        fields = SuccessStorySerializer().fields
        for name in ["photo", "photo_2", "photo_3", "photo_4", "photo_5"]:
            self.assertIn(validate_image_size, fields[name].validators, name)


class DecodeImageSizeLimitTests(SimpleTestCase):
    def test_created_image_within_limit_is_decoded(self):
        data = {"created": [{"id": "a", "picture": TINY_PNG_DATA_URL}], "updated": []}
        decode_image(data)
        self.assertEqual(data["created"][0]["picture"].size, 70)

    @mock.patch("cbr_api.util.MAX_IMAGE_BYTES", 10)
    def test_created_image_over_limit_is_dropped(self):
        data = {"created": [{"id": "a", "picture": TINY_PNG_DATA_URL}], "updated": []}
        with self.assertLogs("cbr_api.util", level="WARNING"):
            decode_image(data)
        self.assertNotIn("picture", data["created"][0])

    @mock.patch("cbr_api.util.MAX_IMAGE_BYTES", 10)
    def test_updated_image_over_limit_keeps_existing_image(self):
        record = {"id": "a", "picture": TINY_PNG_DATA_URL, "_changed": "picture"}
        data = {"created": [], "updated": [record]}
        with self.assertLogs("cbr_api.util", level="WARNING"):
            decode_image(data)
        self.assertNotIn("picture", record)

    def test_updated_image_removed_is_cleared(self):
        record = {"id": "a", "picture": "", "_changed": "picture"}
        decode_image({"created": [], "updated": [record]})
        self.assertIsNone(record["picture"])

    def test_unchanged_image_is_left_alone(self):
        record = {"id": "a", "picture": TINY_PNG_DATA_URL, "_changed": "full_name"}
        decode_image({"created": [], "updated": [record]})
        self.assertNotIn("picture", record)
