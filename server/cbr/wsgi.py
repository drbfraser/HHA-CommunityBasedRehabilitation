"""
WSGI config for cbr project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os
import socketio
import eventlet  # concurrent networking library
import eventlet.wsgi

from django.core.wsgi import get_wsgi_application
from cbr.settings import DEBUG
from cbr.sockets import sio

# replaces blocking function with async functions
eventlet.monkey_patch(socket=True, select=True)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cbr.settings")

application = get_wsgi_application()
application = socketio.WSGIApp(sio, application)

print(eventlet.__version__)

if DEBUG:
    # SocketIO requires a WSGI server to run. By default, when running in debug mode, there is no WSGI
    # server running. We don't want to run Gunicorn locally because it doesn't support hot reloading.
    LISTEN_PORT = int(os.environ.get("LISTEN_PORT"))
    eventlet.wsgi.server(eventlet.listen(("", LISTEN_PORT)), application)
