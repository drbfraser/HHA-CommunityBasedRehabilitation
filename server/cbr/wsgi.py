"""
WSGI config for cbr project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os
import socketio
import eventlet # concurrent networking library
import eventlet.wsgi

from django.core.wsgi import get_wsgi_application
from cbr.views import sio

eventlet.monkey_patch(socket=True, select=True) # replaces blocking function with async functions
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cbr.settings")

application = get_wsgi_application()
sio_application = socketio.WSGIApp(sio, application)

# # works locally but not when deployed with gunicorn
eventlet.wsgi.server(eventlet.listen(('', 8000)), sio_application) 
