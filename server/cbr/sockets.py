import socketio
from cbr.settings import DEBUG, ALLOWED_HOSTS

# The maximum allowable number of clients that can connect to the socketIO concurrently.
# If this limit is reached, the next client that tries to connect will be disconnected.
MAX_SOCKET_CONNECTION_LIMIT = 50

# Set CORS propertly to ALLOWED_HOSTS from settings.py when not in debug mode
cors_allowed_origins = "*" if DEBUG else ["https://" + host for host in ALLOWED_HOSTS]
sio = socketio.Server(
    async_mode="eventlet",
    always_connect=True,
    cors_allowed_origins=cors_allowed_origins,
)

# Set a property in the socketIO server that represents the maximum allowable concurrent client connections
sio.maxConnections = MAX_SOCKET_CONNECTION_LIMIT
# Set a prooperty in the socketIO server to keep track of how many clients are currently connected
sio.numCurrentConnections = 0


@sio.on("connect")
def connect(sid, environ):
    sio.numCurrentConnections = sio.numCurrentConnections + 1
    sio.emit("alert", {"sid": sid, "data": "[SocketIO Server] User Connected."})
    print("[SocketIO Server] User connected with socketID {}.".format(sid))

    if sio.numCurrentConnections > sio.maxConnections:
        print(
            "[SocketIO Server] Connection limit reached, disconnecting user with socketID {}.\n".format(
                sid
            )
        )
        sio.disconnect(sid)


@sio.on("disconnect")
def disconnect(sid):
    sio.numCurrentConnections = sio.numCurrentConnections - 1
    print("[SocketIO Server] User {} has disconnected.".format(sid))


@sio.on("newAlert")
def newAlert(sid, data):
    print("[SocketIO Server]: Received a new alert '{} from {}".format(data, sid))
    sio.emit("pushAlert", {"data": "[SocketIO Server] pushAlert test message"})
