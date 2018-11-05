"""
Initialize the NGWMN UI application
"""
from flask import Flask


__version__ = '0.1.0'

app = Flask(__name__.split()[0], instance_relative_config=True)

# load configurations
app.config.from_object('config')
try:
    app.config.from_pyfile('config.py')
except FileNotFoundError:
    pass

from . import views  # pylint: disable=C0413
from . import filters  # pylint: disable=C0413
from . import services  # pylint: disable=C0413
