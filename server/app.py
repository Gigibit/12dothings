import os
import logging
import jwt
import re
import sys

from flask                  import Flask, render_template, request, url_for, redirect
from flask_mail             import Mail, Message
from flask_socketio         import SocketIO, join_room, leave_room, emit
from flask_cors             import CORS
from itsdangerous           import URLSafeTimedSerializer
from werkzeug.security      import generate_password_hash, check_password_hash
from werkzeug.utils         import secure_filename

from flask                  import jsonify
from pymongo                import MongoClient, GEOSPHERE
from pprint                 import pprint 
from bson.json_util         import dumps
from bson.son               import SON
from bson.objectid          import ObjectId

logging.basicConfig(level=logging.DEBUG)
sys.stdout.flush()
DEFAULT_USER_IMG = 'https://picsum.photos/id/237/200/300'
MONGO_USR = 'gigibit'
MONGO_PWD = '7AUUoXT9mpq4M0GB'
client = MongoClient('mongodb+srv://%s:%s@erica-39qdu.mongodb.net/test?retryWrites=true'%(MONGO_USR, MONGO_PWD))
db = client.whowant
db.proposals.create_index( [ ('position', GEOSPHERE) ], background=True)
db.users.create_index( [ ("phone", 1 ) ], unique = True )


MY_SECRET_FOR_EVER = 'Saraccccc'


app  = Flask(__name__, template_folder='./templates')
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
app.config.from_pyfile('config.cfg')

UPLOAD_FOLDER = 'static/images/'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
s = URLSafeTimedSerializer(MY_SECRET_FOR_EVER)

cors        = CORS(app, resources={r"/api/*": {"origins": "*"}})
socketio    = SocketIO(app)
mail        = Mail(app)



#project_dir = os.path.dirname(os.path.abspath(__file__))
#database_file = "sqlite:///{}".format(os.path.join(project_dir, "whowant.sqlite3"))
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///whowant.sqlite3'

#db       = SQLAlchemy(app)


'''
    email
'''

def send_email_confirmation(email):
    token = s.dumps(email, salt='social-conventions')
    msg = Message('confirm email', sender='gigibit@gigib.it', recipients=[email])
    link= url_for('confirm_email', token=token, _external=True)
    msg.body = 'your link is {}'.format(link)
    mail.send(msg)
    return token



'''
    ROUTING

'''

@app.route('/api/get-context', methods=['GET'])
def get_user_context():
    print('ok')
    access_token    = request.headers.get('auth-token',None)
    print('ok po')
    if access_token:
        user, id, email             = get_user(access_token)
        print('done token')
        if id and email:
            requests = db.proposals.find( { 'join_requests.user' : id } )
            if requests.count() > 0: 
                join_requests = []
                for join_request in requests:
                    try:
                        join_request['joined_requests'] = next(filter(lambda x: x['user'] == id,  join_request['join_requests']))
                        join_requests.append(slice_id(join_request))
                    except StopIteration:
                        join_request['joined_requests'] = []
                requests = join_requests
            return jsonify({
                'user_info'                  : slice_id(db.users.find_one( { 'email' : email}, { 'password' : 0 , 'token' : 0 } )),
                'own_proposals'              : slice_ids(db.proposals.find( { 'created_by': id })),
                'joined_proposals'           : slice_ids(db.proposals.find( {'users' : id },  { 'join_requests': 0} )),
                'requested_proposals'        : dumps(requests)
            })
        else:
            print('ok po niend id')
            return jsonify({'status' : 'ERROR', 'code': 'missing_id', 'status_code': 401 })
    else:
        print('ok po niend acc tkn')
        return jsonify({'status' : 'ERROR', 'code': 'missing_access_token', 'status_code': 401 })

@app.route('/api/get-proposals-by-user/<id>')
def get_proposal_by_user(id):
    return slice_ids(dumps(db.proposals.find({ 'users' : id })))

@app.route('/api/proposals', methods=['GET', 'POST'])
def proposals():
    if request.method == 'GET':
        if  request.args.get('longitude', None) and request.args.get('latitude', None):
            longitude = float(request.args['longitude'])
            latitude  = float(request.args['latitude']) 
            max_distance = request.args.get('md', 13321)
            query = {'position': 
                        {'$near': SON([(
                            '$geometry', SON([
                                    ('type', 'Point'), 
                                     ('coordinates', [longitude, latitude])
                                    ])
                                ), 
                            ('$maxDistance', int(max_distance))
                            ])
                        }
                    }
            return dumps([slice_id(x) for x in db.proposals.find(query)])
        else:    
            return dumps([slice_id(x) for x in db.proposals.find({})])

    elif request.method == 'POST':
        access_token = request.headers.get('auth-token', None)
        if access_token:
            proposal = request.get_json()
            proposal['created_by'] = decode(from_jwt(access_token)['id'])
            proposal['users'] = []
            proposal['join_requests'] = []
            result = db.proposals.insert_one(proposal)
            return jsonify({
                    'status': 'OK',
                    'code': 'proposal_created',
                    'status_code': 201,
                    'id' : str(result.inserted_id)
                })
        else:
            return jsonify({ 'status' : 'ERROR' ,'code' : 'user_not_verified', 'status_code' : 401 })


@app.route('/api/join-proposal/<id>', methods=["POST"])
def join(id):
    access_token = request.headers.get('auth-token', None)
    if access_token :
        jwt             = from_jwt(access_token)
        if jwt['id'] and jwt['email']:
            user_id = decode(jwt['id'])
            print(id)
            db.proposals.update_one( { '_id' : ObjectId(id) }, {
                '$addToSet':{
                    'join_requests' : {
                        'user'  : user_id,
                        'state' : 'PENDING'
                    }
                }
            })
            return jsonify({ 'status' : 'OK', 'status_code' : 200 })
        else:
            return jsonify({ 'status' : 'ERROR' ,'code' : 'unauthorized', 'status_code' : 401 })
    else:
        return jsonify({ 'status' : 'ERROR' ,'code' : 'unauthorized', 'status_code' : 401 })

@app.route('/api/proposal/<id>', methods=['GET', 'PUT', 'DELETE'])
def proposal(id):
    access_token    = request.headers.get('auth-token', None)
    if request.method == 'GET':
        if access_token:
            user, user_id, email             = get_user(access_token)        
            requested_proposal = db.proposals.find_one({'_id' : ObjectId(id) })
            if requested_proposal:
                try:
                    join_request = next(filter(lambda x: x['user'] == user_id,  requested_proposal['join_requests']))
                except:
                    join_request = None
                return jsonify({
                        'detail': slice_id(requested_proposal),
                        'join_status': join_request['state'] if join_request else 'NOT_REQUESTED'
                })
            else:
                return jsonify({ 'status' : 'ERROR' ,'code' : 'not_found', 'status_code' : 404 })
        else:
            return jsonify({ 'status' : 'ERROR' ,'code' : 'unauthorized', 'status_code' : 401 })
    elif request.method == 'DELETE':
        return dumps(db.proposals.delete_many({'_id' : ObjectId(id) }))



def login_user(check_user):
    pass

@app.route('/api/register', methods=['POST'])
def register():
    if request.method == 'POST':
        user = request.get_json()
        existing_user = db.users.find_one({ 'email': user['email']})
        if existing_user is None:
            hey = db.users.insert_one({
                'name' : user['name'],
                'surname' : user['surname'],
                'email': user['email'],
                'password': generate_password_hash(user['password']),
                'profile_img'  : user.get('img', DEFAULT_USER_IMG),
                'imgs' : [],
                'verified' : False,
                'logged': False,
                'token': send_email_confirmation(user['email'])
            })
            return jsonify({ 'status' : 'OK', 'status_code' : 200 })
        else:
            return jsonify({'status' : 'ERROR', 'code': 'user_already_registered', 'status_code' : 409})
        
    return jsonify({ 'status' : 'ERROR', 'status_code' : 400 })




'''
    AUTH

'''

@app.route('/resend/<token>')
def resend_token(token):
    email = s.loads(token, salt='social-conventions')
    db.users.update_one({'email' : email}, {"$set" : {'token': send_email_confirmation(email) } })
    return render_template('resent_email_validation.html')

@app.route('/confirm_email/<token>')
def confirm_email(token):
    try:
        email = s.loads(token, salt='social-conventions', max_age=900)
        db.users.update_one({'email' : email}, {"$set" : {'verified' : True} })
        return render_template('registration_complete.html', email=email)
    except Exception as e:
        print(e)
        return render_template('token_expired.html', token=token)

@app.route('/', methods=['GET'])
def test():
    send_email_confirmation(mail,'l.chougrad@gmail.com')
    return '<h1>hey menny!</h1>'

@app.route('/api/auth/token',methods=["POST"])
def auth_token():
    return render_template('session.html')


@app.route('/api/login', methods=['POST'])
def login():
    if request.method == 'POST':
        user = request.get_json()
        check_user = db.users.find_one({'email': user['email']})
        if check_user :
            if check_user['verified']:
                if check_password_hash(check_user['password'], user['password']):
                    result = db.users.update_one({'email': user['email']}, {'$set':{ 'logged': True }})
                    user_was = db.users.find_one({'email': user['email']})
                    user['id'] = encode(str(user_was['_id']))
                    token = to_jwt(user)
                    return jsonify({ 'status' : 'OK', 'access_token': token })
                else:
                    return jsonify({ 'status' : 'ERROR', 'code' : 'wrong_credentials', 'status_code' : 403 })
            else:
                return jsonify({ 'status' : 'ERROR' ,'code' : 'user_not_verified', 'status_code' : 401 })
        else:
            return jsonify({ 'status' : 'ERROR', 'code' : 'wrong_credentials', 'status_code' : 403 })

    return jsonify({ 'status' : 'ERROR', 'status_code' : 400 })


@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    print('entered')
    access_token = request.headers.get('auth-token', None)
    print('access_token taken')
    if access_token :
        print('there was an access_token')
        user, id, email = get_user(access_token)
        print('taken user')
        img = upload_file(id)
        if img:
            #TODO: check size of user's imgs
            db.users.update_one({'_id':ObjectId(id)}, {
                "$push":{
                    "imgs" : img
                }
            })
            return jsonify({ 'status' : 'OK', 'status_code': 200 })
        else:
            print('no img no party')
            return jsonify({ 'status' : 'ERROR' ,'code' : 'upload_file', 'status_code' : 409 })
    else :
        print('no token no party')
        return jsonify({ 'status' : 'ERROR' ,'code' : 'user_not_verified', 'status_code' : 401 })

'''
    SOCKETIO

'''

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

    


'''
UTILS
'''
def slice_id(p): 
    p['id'] = str(p['_id'])
    del p['_id']
    return p


def slice_ids(ps) : return [ slice_id(p) for p in ps ]


def to_jwt(payload):         return jwt.encode(payload, MY_SECRET_FOR_EVER , algorithm='HS256')
def from_jwt(encoded_jwt):   return jwt.decode(encoded_jwt, MY_SECRET_FOR_EVER, algorithms=['HS256'])



from Crypto.Cipher import XOR
import base64

def encode(plaintext):
  cipher = XOR.new(MY_SECRET_FOR_EVER)
  return str(base64.b64encode(cipher.encrypt(plaintext)), 'utf-8')

def decode(ciphertext):
  cipher = XOR.new(MY_SECRET_FOR_EVER)
  return str(cipher.decrypt(decode_base64(ciphertext)), 'utf-8')

def decode_base64(data, altchars=b'+/'):
    """Decode base64, padding being optional.

    :param data: Base64 data as an ASCII byte string
    :returns: The decoded byte string.

    """
    data = re.sub(rb'[^a-zA-Z0-9%s]+' % altchars, b'', bytes(data, 'utf-8'))  # normalize
    missing_padding = len(data) % 4
    if missing_padding:
        data += b'='* (4 - missing_padding)
    return base64.b64decode(data, altchars)


def get_user(access_token):
    jwt = from_jwt(access_token)
    id = jwt.get('id', None)
    return jwt, decode(id) if id else None, jwt.get('email',None)


def allowed_file(filename):
    filename, file_extension = os.path.splitext(filename)
    return file_extension[1:] in ALLOWED_EXTENSIONS

def upload_file(user_dir):
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            print('hey niente', file=sys.stdout)
            return False
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            print('hey niente', file=sys.stdout)
            return False
        if file and allowed_file(file.filename):
            print(file.filename, file=sys.stdout)
            filename = secure_filename(file.filename)
            path = os.path.join(app.config['UPLOAD_FOLDER'], user_dir, filename)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            file.save(path)
            print('saved %s'%os.path.dirname(path), file=sys.stdout)
            return url_for('static', filename=os.path.join('images',user_dir, filename), _external=True)
        print('hey' + str(allowed_file(file.filename)), file=sys.stderr)
    else:
        print('method not was allowed')
        return False





if __name__ == '__main__':
   # init_db()
   # socketio.run(app, debug=True)
   app.run(host='0.0.0.0', port=3001, debug=True)
