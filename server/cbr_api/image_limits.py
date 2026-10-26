"""
Keeps stored images small enough for the mobile app.

Phones keep a record's images as base64 inside the record's database row, and Android can only
read a row that fits in its 2 MB CursorWindow. A row that is too big cannot be read on any phone
that syncs it, which breaks that phone's sync. So every image is checked when it is saved (see
ImageBudgetMixin) and, if it is over budget, re-encoded as a smaller JPEG.

The budgets match what the apps produce (mobile/src/util/resizePhoto.ts and
web/src/util/resizePhoto.ts), so images from current apps are stored unchanged.
"""

import contextlib
import contextvars
import io
import logging
from dataclasses import dataclass
from typing import Optional

from django.core.files.base import ContentFile
from PIL import Image, ImageOps, UnidentifiedImageError
from rest_framework import serializers

logger = logging.getLogger(__name__)

# Refuse to decode images over this many pixels (Pillow raises DecompressionBombError), which
# bounds the memory used to process one image.
Image.MAX_IMAGE_PIXELS = 40_000_000


@dataclass(frozen=True)
class ImageBudget:
    max_bytes: int
    max_side: int
    quality: int  # JPEG quality, 1-95


# Client, visit and referral photos: one per row; the apps make them 400 px, ~30-45 KB.
RECORD_IMAGE_BUDGET = ImageBudget(max_bytes=200 * 1024, max_side=400, quality=75)
# Success story photos: up to 5 slots in one row; the apps make them at most 320 KB.
STORY_PHOTO_BUDGET = ImageBudget(max_bytes=320 * 1024, max_side=1500, quality=80)
# All of a story's photos together: ~1.73 MB as base64, leaving room for the story text.
STORY_PHOTOS_TOTAL_MAX_BYTES = 1300 * 1024

# Tried in order for an image over its budget: (fraction of max_side, JPEG quality).
STEP_DOWN = [(1, 75), (1, 70), (1, 65), (0.8, 75), (0.8, 65), (2 / 3, 65), (0.5, 60)]


class ImageTooLargeError(serializers.ValidationError):
    """An image could not be made to fit its budget (or is not a valid image)."""


_drop_oversized_images = contextvars.ContextVar("drop_oversized_images", default=False)


@contextlib.contextmanager
def drop_oversized_images():
    """
    While active, an image that cannot be fitted is dropped (and logged) instead of raising
    ImageTooLargeError. Used by sync: failing would fail the whole push, and the app would retry
    the same push forever.
    """
    token = _drop_oversized_images.set(True)
    try:
        yield
    finally:
        _drop_oversized_images.reset(token)


def dropping_oversized_images() -> bool:
    return _drop_oversized_images.get()


def _decode(data: bytes, budget: ImageBudget) -> Image.Image:
    try:
        image = Image.open(io.BytesIO(data))
        # JPEGs: decode at a reduced scale (still at least max_side), which is faster and uses
        # far less memory than decoding a full-resolution photo.
        image.draft("RGB", (budget.max_side, budget.max_side))
        image = ImageOps.exif_transpose(image)
        image.load()
    except (
        UnidentifiedImageError,
        Image.DecompressionBombError,
        OSError,
        ValueError,
    ) as e:
        raise ImageTooLargeError(f"Not a valid image or too large to process ({e}).")

    if image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    ):
        image = image.convert("RGBA")
        background = Image.new("RGB", image.size, "white")
        background.paste(image, mask=image.getchannel("A"))
        return background
    return image.convert("RGB")


def _encode(image: Image.Image, max_side: int, quality: int) -> bytes:
    resized = image.copy()
    resized.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    output = io.BytesIO()
    resized.save(output, "JPEG", quality=quality, optimize=True)
    return output.getvalue()


def fit_image(image_file, budget: ImageBudget, max_bytes: Optional[int] = None):
    """
    Returns image_file unchanged if it is within the budget (max_bytes, if given, overrides the
    budget's), or a new, smaller JPEG ContentFile named "temp.jpg".

    :raises ImageTooLargeError: if it cannot be made to fit, or is over budget and not an image.
    """
    limit = budget.max_bytes if max_bytes is None else max_bytes
    if image_file.size <= limit:
        return image_file

    image_file.seek(0)
    data = image_file.read()
    image_file.seek(0)
    image = _decode(data, budget)

    jpeg = _encode(image, budget.max_side, budget.quality)
    for side_fraction, quality in STEP_DOWN:
        if len(jpeg) <= limit:
            break
        jpeg = _encode(image, round(budget.max_side * side_fraction), quality)
    if len(jpeg) > limit:
        raise ImageTooLargeError(
            f"Image could not be reduced to {limit // 1024} KB (smallest was {len(jpeg) // 1024} KB)."
        )
    return ContentFile(jpeg, name="temp.jpg")


class ImageBudgetMixin:
    """
    Model mixin: before saving, fits every newly assigned image to its budget. Images that are
    already stored are not touched. Covers every way a record is saved (REST, sync, admin).

    Set IMAGE_BUDGETS on the model to {field name: ImageBudget}.
    """

    IMAGE_BUDGETS: dict = {}

    def save(self, *args, **kwargs):
        self.apply_image_budgets()
        super().save(*args, **kwargs)

    def _new_image_fields(self):
        """Names of image fields assigned a new (not yet stored) file."""
        return [
            name
            for name in self.IMAGE_BUDGETS
            if getattr(self, name) and not getattr(self, name)._committed
        ]

    def _drop_image(self, field_name, reason):
        """Discards a new image, keeping the stored one (if any)."""
        logger.warning(
            "Dropped %s of %s %s: %s",
            field_name,
            type(self).__name__,
            self.pk,
            reason,
        )
        stored = None
        if self.pk is not None:
            stored = (
                type(self)
                .objects.filter(pk=self.pk)
                .values_list(field_name, flat=True)
                .first()
            )
        setattr(self, field_name, stored or None)

    def apply_image_budgets(self):
        for name in self._new_image_fields():
            field_file = getattr(self, name)
            try:
                fitted = fit_image(field_file, self.IMAGE_BUDGETS[name])
            except ImageTooLargeError as e:
                if not dropping_oversized_images():
                    raise ImageTooLargeError({name: e.detail})
                self._drop_image(name, e.detail)
                continue
            if fitted is not field_file:
                setattr(self, name, fitted)
