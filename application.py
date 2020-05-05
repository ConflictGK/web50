import os

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("create channel")
def create_channel(data):
    channel = data["channel"]
    if channel not in channels:
        channels.append(channel)
        emit('channels changed', channel, broadcast=True)

@app.route("/channel")
def channel():
    print("channel info")