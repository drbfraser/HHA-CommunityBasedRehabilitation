# This file is for testing a socket server using gunicorn
# To run: $gunicorn3 --threads 50 app:app

import socketio

sio = socketio.Server()
app = socketio.WSGIApp(sio)


@sio.event
def connect(sid, environ):
    print(sid, "connected")


@sio.event
def disconnect(sid):
    print(sid, "disconnected")


@sio.on("djangoSocketTest")
async def djangoSocketTest(sid, data):
    print("BE got new alert {} from {}".format(data, sid))
    pass


sio.emit("djangoSocketTest", {"data": "BE SOCKET TEST message"})
