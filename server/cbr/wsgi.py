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

eventlet.monkey_patch(socket=True, select=True)
async_mode = 'eventlet'  # access to the long-polling and WebSocket transports
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cbr.settings")

application = get_wsgi_application()
sio = socketio.Server(async_mode=None, cors_allowed_origins="*")
application = socketio.WSGIApp(sio, application)

@sio.on('connect')
def connect(sid, data):
    print('\n[SocketIO Server] User connected with socketID {}.\n'.format(sid))
    sio.emit('alert', {'sid': sid, 'data': '[SocketIO Server] User Connected.'})
    pass


@sio.on('disconnect')
def disconnect(sid):
    print("[SocketIO Server] User {} has disconnected.".format(sid))
    pass


@sio.on('newAlert')
def newAlert(sid, data):
    print("\n[SocketIO Server]: Received a new alert '{} from {}\n".format(data, sid))
    sio.emit('pushAlert', {'data': '[SocketIO Server] pushAlert test message'})
    pass

eventlet.wsgi.server(eventlet.listen(('', 8000)), application).serve_forever()
