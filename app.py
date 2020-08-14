from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import sys
import requests
from flask import Flask, render_template, request, Response, flash, session, redirect, url_for, jsonify, abort
from database.models import setup_db, Movies, drop_and_create_all
from auth.auth import AuthError, requires_auth, get_token_auth_header, verify_decode_jwt
from dotenv import load_dotenv
from routes.index import index
from routes.api import api
from routes.db import db
from flask_talisman import Talisman


# load the env variables
load_dotenv()

env = os.environ.get('ENV')

# Create flask app
app = Flask(__name__, static_url_path='',
            static_folder='web/static',
            template_folder='web/templates')

app.register_blueprint(index)
app.register_blueprint(api)
app.register_blueprint(db)


# Connect to the database
setup_db(app)


# droop all and create all
# drop_and_create_all()

# Setup CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add("Access-Control-Allow-Headers",
                         "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
    return response


# Error handle
@app.errorhandler(404)
def not_found(error):
    return render_template('errors/error.html', error=error), 404


@app.errorhandler(422)
def unprocessable(error):
    return render_template('errors/error.html', error=error), 422


@app.errorhandler(400)
def bad_request(error):
    return render_template('errors/error.html', error=error), 400


@app.errorhandler(401)
def unauthorized(error):
    return render_template('errors/error.html', error=error), 401


@app.errorhandler(500)
def server_error(error):
    return render_template('errors/error.html', error=error), 500


# Create the server
if __name__ == "__main__":
    app.debug = True
    app.run(port=5000)
