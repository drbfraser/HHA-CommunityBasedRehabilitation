import imghdr
import os
import base64
from datetime import datetime
from hashlib import blake2b
import time
import json
from typing import Optional
from django.core.files import File
from django.core.files.base import ContentFile

from cbr_api import models


def client_last_modified_datetime(request, pk, *args):
    return datetime.fromtimestamp(
        models.Client.objects.filter(id=pk).first().updated_at
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


def disability_string_to_array(data):
    for client_data in data:
        values = str.strip(client_data["disability"], "[]")
        client_data["disability"] = list(map(int, values.split(",")))


def destringify_disability(data):
    if data.get("clients"):
        created_data = data["clients"]["created"]
        updated_data = data["clients"]["updated"]
        disability_string_to_array(created_data)
        disability_string_to_array(updated_data)


def base64_to_data(data):
    format, imgstr = data.split(";base64,")
    ext = format.split("/")[-1]
    return ContentFile(base64.b64decode(imgstr), name="temp." + ext)


def decode_image(data):
    create_data = data.get("created")
    for client in create_data:
        if client["picture"]:
            client["picture"] = base64_to_data(client["picture"])
        else:
            client.pop("picture")
    # for updated, only convert base64 and convert to raw data if image was locally change, else pop out of data
    updated_data = data.get("updated")
    for client in updated_data:
        if "picture" in client["_changed"]:
            client["picture"] = base64_to_data(client["picture"])
        else:
            client.pop("picture")


def get_model_changes(request, model):

    pulledTime = request.GET.get("last_pulled_at", "")

    ## for each model(table) need to change object
    change = table()
    queryset = model.objects.all()

    ##filter against last pulled time
    if pulledTime != "null":
        if model == models.Client:
            create_set = queryset.filter(server_created_at__gt=pulledTime)
            updated_set = queryset.filter(
                server_created_at__lte=pulledTime, updated_at__gt=pulledTime
            )
            ## add to change
            change.created = create_set
            change.updated = updated_set
        else:
            create_set = queryset.filter(server_created_at__gt=pulledTime)
            change.created = create_set
    ##if first pull then just add everything to created in change
    else:
        change.created = queryset

    return change


def create_user_data(validated_data, sync_time):
    user_data = validated_data.get("users")
    created_data = user_data.pop("created")
    for data in created_data:
        record = models.UserCBR.objects.create(**data)
        record.created_at = data["created_at"]
        record.update_at = data["updated_at"]
        record.server_created_at = sync_time
        record.save()

    updated_data = user_data.pop("updated")
    for data in updated_data:
        data["updated_at"] = sync_time
        if data["password"]:
            user = models.UserCBR.objects.get(pk=data["id"])
            user.set_password(data["password"])
            user.save()
            # remove empty field for password, so it doesnt update existing password
            data.pop("password")
        models.UserCBR.objects.filter(pk=data["id"]).update(**data)


def create_client_data(validated_data, sync_time):
    client_data = validated_data.get("clients")
    created_data = client_data.pop("created")
    for data in created_data:
        disability_data = data.pop("disability")
        record = models.Client.objects.create(**data)
        record.created_at = data["created_at"]
        record.update_at = data["updated_at"]
        record.server_created_at = sync_time
        record.disability.set(disability_data)
        record.save()

    updated_data = client_data.pop("updated")
    for data in updated_data:
        data["updated_at"] = sync_time
        disability_data = data.pop("disability")
        new_client_picture: Optional[File] = data.get("picture")
        if new_client_picture:
            file_root, file_ext = os.path.splitext(new_client_picture.name)
            actual_image_type: Optional[str] = imghdr.what(new_client_picture.file)
            if actual_image_type and actual_image_type != file_ext.removeprefix("."):
                new_client_picture.name = f"{file_root}.{actual_image_type}"
            image_data = data.pop("picture")
        models.Client.objects.filter(pk=data["id"]).update(**data)
        # clears current disabiltiy and updates new disability data
        client = models.Client.objects.get(pk=data["id"])
        if new_client_picture:
            client.picture = image_data
            client.save()
        client.disability.clear()
        client.disability.set(disability_data)


def create_generic_data(table_name, model, validated_data, sync_time):
    table_data = validated_data.get(table_name)
    created_data = table_data.pop("created")
    for data in created_data:
        record = model.objects.create(**data)
        record.server_created_at = sync_time
        record.save()


def create_push_data(table_name, model, validated_data):
    table_data = validated_data.get(table_name)
    created_data = table_data.pop("created")
    for data in created_data:
        # remove disabiltiy first then later set it back
        if table_name == "clients":
            disability_data = data.pop("disability")
        record = model.objects.create(**data)
        record.id = data["id"]

        if table_name == "risks":
            record.timestamp = data["timestamp"]
        else:
            record.created_at = data["created_at"]
            record.update_at = data["updated_at"]

        if disability_data:
            record.disability.set(disability_data)
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
        elif table_name == "clients":
            disability_data = data.pop("disability")

        model.objects.filter(pk=data["id"]).update(**data)

        # clears current disabiltiy and updates new disability data
        if disability_data:
            client = model.objects.get(pk=data["id"])
            client.disability.clear()
            client.disability.set(disability_data)
