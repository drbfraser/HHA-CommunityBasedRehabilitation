"""
ASGI config for cbr project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cbr.settings")

import socketio
from django.core.asgi import get_asgi_application

from cbr.sockets import sio

django_application = get_asgi_application()
application = socketio.ASGIApp(sio, django_application)
