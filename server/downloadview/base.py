"""
Taken from https://github.com/jazzband/django-downloadview/blob/2.1.1/django_downloadview/views/base.py#L168
with BaseDownloadView altered to inherit APIView instead of View to allow for authentication.
"""

from django_downloadview import DownloadMixin
from rest_framework.views import APIView


class AuthenticatedBaseDownloadView(DownloadMixin, APIView):
    """A base :class:`DownloadMixin` that implements :meth:`get`."""

    def get_file(self):
        raise NotImplementedError()

    def get(self, request, *args, **kwargs):
        """Handle GET requests: stream a file."""
        return self.render_to_response()
