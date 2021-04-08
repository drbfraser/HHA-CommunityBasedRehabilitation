from django.core.exceptions import ValidationError


def validate_client_disabilities(disability, other_disability):
    if not disability and not other_disability:
        raise ValidationError("disability and other_disability cannot both be empty")
