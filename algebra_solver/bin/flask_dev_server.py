from geventwebsocket import WebSocketServer
from algebra_solver.app.flask import app

server = WebSocketServer(("", 5000), app)

if __name__ == '__main__':
    server.serve_forever()
