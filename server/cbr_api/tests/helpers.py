from cbr_api.models import Client
import uuid


def create_client(
    *,
    user,
    first,
    last,
    contact,
    zone,
    gender,
    created_at=0,
    birth_date=0,
    longitude=0.0,
    latitude=0.0,
    village="",
    **kwargs
):
    data = dict(
        id=uuid.uuid4(),
        user_id=user,
        created_at=created_at,
        first_name=first,
        last_name=last,
        phone_number=contact,
        zone=zone,
        gender=gender,
        birth_date=birth_date,
        longitude=longitude,
        latitude=latitude,
        village=village,
    )
    data.update(kwargs)
    return Client.objects.create(**data)
