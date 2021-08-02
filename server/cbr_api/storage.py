import os

import pathlib

from django.core.exceptions import SuspiciousFileOperation
from django.core.files.storage import FileSystemStorage
from django.core.files.utils import validate_file_name


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        # Most of this code was taken from Django's default implementation.
        dir_name, file_name = os.path.split(name)
        if ".." in pathlib.PurePath(dir_name).parts:
            raise SuspiciousFileOperation(
                "Detected path traversal attempt in '%s'" % dir_name
            )
        validate_file_name(file_name)
        file_root, file_ext = os.path.splitext(file_name)

        # Truncate original name if required, so the new filename does not
        # exceed the max_length.
        while max_length and len(name) > max_length:
            # file_ext includes the dot.
            name = os.path.join(dir_name, f"{file_root}{file_ext}")

            truncation = len(name) - max_length
            file_root = file_root[:-truncation]
            # Entire file_root was truncated in attempt to find an available filename.
            if not file_root:
                raise SuspiciousFileOperation(
                    'Storage can not find an available filename for "%s". '
                    "Please make sure that the corresponding file field "
                    'allows sufficient "max_length".' % name
                )
            name = os.path.join(dir_name, f"{file_root}{file_ext}")

        # If a file with the same name already exists, overwrite it.
        self.delete(name)

        return name
