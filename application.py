import os

from flask import Flask, render_template, request, url_for, redirect, session
from flask_socketio import SocketIO, emit
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'super secret key'
# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
socketio = SocketIO(app)

# Dictionary with channels and their messages.
channels = {}

@app.route("/")
def index():
    if session and session["current_channel"]:
        return redirect(url_for("browse_to_channel", channel=session["current_channel"]))
    
    return render_template("index.html", channels=channels.keys())


@socketio.on("create channel")
def create_channel(data):
    channel = data["channel"]
    if channel not in channels:
        channels[channel] = []
        emit('channels changed', channel, broadcast=True)

@app.route("/channel/<string:channel>")
def browse_to_channel(channel):
    session["current_channel"] = channel
    
    channel_messages = []
    if channels.get(channel): 
        channel_messages = channels.get(channel)
    
    channel_messages_datetime = tuple([(cm[0], cm[1], datetime.fromtimestamp(cm[2] / 1000)) for cm in channel_messages])
    return render_template("channel.html", channel=channel, messages=channel_messages_datetime)


@socketio.on("new message")
def new_message(data):
    message_info = (data["message"], data["user"], data["timestamp"])
    channel = data["channel"]
    channel_messages = channels.get(channel)
    if channel_messages is not None:
        channel_messages.append(message_info)
    emit("new message sent", {
                                "message": data["message"],
                                "user": data["user"],
                                "timestamp": data["timestamp"]
                             }, broadcast=True)


@socketio.on("delete message")
def delete_message(data):
    channel = session["current_channel"]
    channel_messages = channels.get(channel)
    for message in channel_messages:
        if data["message"] == message[0]:
            channel_messages.remove(message)
    emit("message deleted", channel_messages, broadcast=True)

@app.route("/return")
def return_to_index():
    session["current_channel"] = None
    return redirect(url_for("index"))

