from django.core.exceptions import ValidationError
from django.template.defaultfilters import filesizeformat
from django.utils.deconstruct import deconstructible


def client_picture_size_validator(value):
    limit = 5 * 1024 * 1024
    if value.size > limit:
        raise ValidationError(f"Picture can't exceed {filesizeformat(limit)}.")


@deconstructible
class FileSizeValidator:
    code = "invalid"

    def __init__(self, max_file_size: int):
        """
        :param max_file_size: Maximum file size in bytes.
        """
        self.max_file_size = max_file_size

    def __call__(self, value):
        if value.size > self.max_file_size:
            raise ValidationError(
                f"Picture can't exceed {filesizeformat(self.max_file_size)}.",
                code=self.code,
                params={"value": value},
            )

    def __eq__(self, other):
        return (
            isinstance(other, FileSizeValidator)
            and self.max_file_size == other.max_file_size
        )
