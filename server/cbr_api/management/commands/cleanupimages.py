import os

from django.core.management import BaseCommand
from django.db import transaction

from cbr import settings
from cbr_api import models


class Command(BaseCommand):
    def handle(self, *args, **options):
        # Find clients that have non-existent files.
        with transaction.atomic():
            for client in models.Client.objects.exclude(picture__exact=""):
                if not os.path.exists(client.picture.path):
                    print(
                        f"deleting picture field with non-existent file ({client.picture.path}) "
                        f"for client with id {client.id}"
                    )
                    client.picture.delete()

        # Find pictures that have no clients associated with them.
        all_client_image_files = []
        images_dir = os.path.join(settings.MEDIA_ROOT, models.client_picture_upload_dir)
        for (dir_path, dir_names, filenames) in os.walk(images_dir):
            all_client_image_files.extend(filenames)

        orphaned_image_paths = []
        with transaction.atomic():
            for client_image_file_name in all_client_image_files:
                relative_dir = os.path.join(
                    models.client_picture_upload_dir, client_image_file_name
                )
                if not models.Client.objects.filter(
                    picture__exact=relative_dir
                ).exists():
                    orphaned_image_paths.append(
                        os.path.join(images_dir, client_image_file_name)
                    )

        if len(orphaned_image_paths) > 0:
            print(f"deleting these orphaned client image files: {orphaned_image_paths}")
            for path_to_orphaned_image in orphaned_image_paths:
                os.remove(path_to_orphaned_image)

        print("finished cleaning up client images")
