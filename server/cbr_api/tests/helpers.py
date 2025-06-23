from cbr_api.models import Client, UserCBR, Zone
import uuid


def create_client(user, first, last, gender, contact, zone):
    return Client.objects.create(
        id=uuid.uuid4(),
        user_id=user,
        created_at=0,
        first_name=first,
        last_name=last,
        phone_number=contact,
        zone=zone,
        gender=gender,
        birth_date=0,
        longitude=0.0,
        latitude=0.0,
        village="",
    )
