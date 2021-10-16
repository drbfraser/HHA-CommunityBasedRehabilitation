"""
WSGI config for cbr project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os
import socketio
import eventlet
import eventlet.wsgi

from django.core.wsgi import get_wsgi_application

async_mode = None
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cbr.settings")

application = get_wsgi_application()
sio = socketio.Server(async_mode=async_mode, cors_allowed_origins="*")
application = socketio.WSGIApp(sio, application) # forwards 'non-socket' traffic to application
thread = None

eventlet.wsgi.server(eventlet.listen(('', 8080)), application)

@sio.on('connect')
def connect(sid, data):
    print('connect ', sid)
    sio.emit('success', {'data': 'Connected'})
    sio.broadcast.emit('hello', 'world')
    pass


@sio.on('disconnect')
def disconnect(sid):
    print("disconnect from socket")
    pass


@sio.on('newAlert')
async def newAlert(sid, data):
    print("BE got new alert {} from {}".format(data, sid))
    sio.emit('djangoSocketTest', {'data': 'BE SOCKET TEST message'})
    pass
  

sio.broadcast.emit('djangoSocketTest', {'data': 'BE SOCKET TEST message'})
