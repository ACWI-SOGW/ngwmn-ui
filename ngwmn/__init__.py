"""
Initialize the NGWMN UI application
"""
from flask import Flask


__version__ = '0.1.0.dev'

app = Flask(__name__.split()[0], instance_relative_config=True)

# load configurations
app.config.from_object('config')
try:
    app.config.from_pyfile('config.py')
except FileNotFoundError:
    pass