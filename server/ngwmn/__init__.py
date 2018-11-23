"""
Initialize the NGWMN UI application
"""
from flask import Flask, render_template


__version__ = '0.3.0dev'

app = Flask(__name__.split()[0], instance_relative_config=True)

# load configurations
app.config.from_object('config')
try:
    app.config.from_pyfile('config.py')
except FileNotFoundError:
    pass


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
