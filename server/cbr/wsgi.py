"""
WSGI config for cbr project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os
import socketio

from django.core.wsgi import get_wsgi_application
from cbr_api.views import sio

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cbr.settings")

application = get_wsgi_application()
sio = socketio.Server()
application = socketio.WSGIApp(sio, application) # forwards 'non-socket' traffic to application
