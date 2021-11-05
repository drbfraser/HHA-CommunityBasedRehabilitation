import os
from datetime import datetime
from hashlib import blake2b
import time
import json
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


def current_milli_time():
    return int(time.time() * 1000)


class syncResp:
    def __init__(self):
        self.changes = {}
        self.timestamp = current_milli_time()


class table:
    def __init__(self):
        self.created = []
        self.updated = []
        self.deleted = []


def disability_array_to_string(data):
    for client_data in data:
        client_data["disability"] = json.dumps(client_data["disability"])


def stringify_disability(serialized_data):
    change_data = serialized_data.get("changes")
    if change_data:
        client_data = change_data.get("clients")
        if client_data:
            created_data = client_data.get("created")
            updated_data = client_data.get("updated")
            disability_array_to_string(created_data)
            disability_array_to_string(updated_data)


def get_model_changes(request, model):

    pulledTime = request.GET.get("last_pulled_at", "")

    ## for each model(table) need to change object
    change = table()
    queryset = model.objects.all()

    ##filter against last pulled time
    if pulledTime != "null":
        if model != models.ClientRisk:
            create_set = queryset.filter(created_at__gte=pulledTime, updated_at=0)
            updated_set = queryset.filter(updated_at__gte=pulledTime)
            ## add to change
            change.created = create_set
            change.updated = updated_set
        else:
            create_set = queryset.filter(timestamp__gte=pulledTime)
            change.created = create_set
    ##if first pull then just add everything to created in change
    else:
        change.created = queryset

    return change


def create_push_data(table_name, model, validated_data):
    table_data = validated_data.get(table_name)
    created_data = table_data.pop("created")
    for data in created_data:
        record = model.objects.create(**data)
        record.id = data["id"]
        record.created_at = data["created_at"]
        record.update_at = data["updated_at"]
        record.save()

    updated_data = table_data.pop("updated")
    for data in updated_data:
        data["updated_at"] = current_milli_time()
        if table_name == "users":
            if data["password"]:
                user = model.objects.get(pk=data["id"])
                user.set_password(data["password"])
                user.save()
            # remove empty field for password, so it doesnt update existing password
            data.pop("password")
        model.objects.filter(pk=data["id"]).update(**data)


def create_push_referral(table_name, model, validated_data, user):
    table_data = validated_data.get(table_name)
    created_data = table_data.pop("created")

    for data in created_data:
        data["user"] = models.UserCBR.objects.get(username=user)
        record = model.objects.create(**data)
        record.created_at = data["created_at"]
        record.update_at = data["updated_at"]
        record.save()

    updated_data = table_data.pop("updated")
    for data in updated_data:
        data["updated_at"] = current_milli_time()
        model.objects.filter(pk=data["id"]).update(**data)