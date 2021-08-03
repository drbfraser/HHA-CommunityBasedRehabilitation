import os
from datetime import datetime
from hashlib import blake2b

from django.core.files import File

from cbr_api import models


def client_last_modified_datetime(request, pk, *args):
    return datetime.fromtimestamp(
        models.Client.objects.filter(id=pk).first().modified_date
    )


def client_picture_last_modified_datetime(request, pk, *args):
    client_picture = models.Client.objects.filter(id=pk).first().picture
    if (
        client_picture.name is None
        or len(client_picture.name) == 0
        or not os.path.exists(client_picture.path)
    ):
        return None

    timestamp = os.path.getmtime(client_picture.path)
    return datetime.fromtimestamp(timestamp)


def client_image_etag(request, pk, *args):
    client_picture = models.Client.objects.filter(id=pk).first().picture
    if (
        client_picture.name is None
        or len(client_picture.name) == 0
        or not os.path.exists(client_picture.path)
    ):
        return "none"

    return hash_client_image(client_picture.file, close_after=True)


def hash_client_image(image: File, close_after: bool):
    picture_hash = blake2b(digest_size=32)
    try:
        image.open()
        for chunk in image.chunks(chunk_size=8192):
            picture_hash.update(chunk)
        return picture_hash.hexdigest()
    except ValueError:
        return "none"
    finally:
        if close_after:
            image.close()
