import socketio
from cbr.settings import DEBUG, ALLOWED_HOSTS

# Set CORS propertly to ALLOWED_HOSTS from settings.py when not in debug mode
cors_allowed_origins = "*" if DEBUG else ["https://" + host for host in ALLOWED_HOSTS]
sio = socketio.Server(
    async_mode="eventlet",
    always_connect=True,
    cors_allowed_origins=cors_allowed_origins,
)


@sio.on("connect")
def connect(sid, environ):
    print("\n[SocketIO Server] User connected with socketID {}.\n".format(sid))
    sio.emit("alert", {"sid": sid, "data": "[SocketIO Server] User Connected."})


@sio.on("disconnect")
def disconnect(sid):
    print("[SocketIO Server] User {} has disconnected.".format(sid))


@sio.on("newAlert")
def newAlert(sid, data):
    print("\n[SocketIO Server]: Received a new alert '{} from {}\n".format(data, sid))
    sio.emit("pushAlert", {"data": "[SocketIO Server] pushAlert test message"})
