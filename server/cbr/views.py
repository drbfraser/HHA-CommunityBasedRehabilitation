import socketio
sio = socketio.Server(async_mode='eventlet', always_connect=True, cors_allowed_origins="*")

@sio.on('connection-bind')
def connection_bind(sid, data):
  print('[SocketIO Server] Connection Bound')

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