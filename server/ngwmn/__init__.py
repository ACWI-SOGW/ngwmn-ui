"""
Initialize the NGWMN UI application
"""
import json

from flask import Flask, render_template


__version__ = '0.15.0'

app = Flask(__name__.split()[0], instance_relative_config=True)

# load configurations
app.config.from_object('config')
try:
    app.config.from_pyfile('config.py')
except FileNotFoundError:
    pass

# Load static assets manifest file, which maps source file names to the
# corresponding versioned/hashed file name.
manifest_path = app.config.get('ASSET_MANIFEST_PATH')
if manifest_path:
    with open(manifest_path, 'r') as f:
        app.config['ASSET_MANIFEST'] = json.loads(f.read())


@app.errorhandler(404)
@app.errorhandler(500)
def handle_service_exception(error):
    return render_template(
        'error.html',
        error={
            'message': error.description,
            'status_code': error.code,
            'status_code_str': error.name
        }
    ), error.code


from . import views # pylint: disable=C0413
from . import filters # pylint: disable=C0413
from . import services # pylint: disable=C0413
