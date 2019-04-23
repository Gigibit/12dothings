import os
import logging

from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import jsonify

project_dir = os.path.dirname(os.path.abspath(__file__))
database_file = "sqlite:///{}".format(os.path.join(project_dir, "whowant.sqlite3"))


app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///whowant.sqlite3'
socketio = SocketIO(app)

db       = SQLAlchemy(app)

@app.route('/register',methods=["POST"])
def register():
    return jsonify({
        'status': 200,
        'response': 'user_created'
    })

@app.route('/login', methods=["POST"])
def login():
    return jsonify({
        'status' : 200,
        'response': 'user_logged_in'
    })

@app.route('/auth/token',methods=["POST"])
def auth_token():
    return render_template('session.html')

def messageReceived(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('join', namespace="/messages")
def join(json):
    room = json['proposal']
    print(request.sid)
    join_room(room)


@socketio.on('unjoin', namespace="/messages")
def unjoin(json):
    leave_room(json['proposal'])


@socketio.on('add-message', namespace="/messages")
def add_message(json, methods=['GET', 'POST']):
    print('received message for: ' + json['proposal'])
    emit('message', json, broadcast=True, room=json['proposal'])

if __name__ == '__main__':
    socketio.run(app, debug=True)

    
class User(db.Model):
    email = db.Column(db.String(80), unique=True, nullable=False, primary_key=True)
    isLoggedIn = db.Column(db.Boolean, default=False, nullable=False)
    def __repr__(self):
        return "<Email: {}>".format(self.email)
