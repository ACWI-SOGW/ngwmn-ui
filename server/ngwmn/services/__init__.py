from flask import jsonify

from ngwmn import app


class ServiceException(Exception):
    def __init__(self, message=None, status_code=503, payload=None):
        super(ServiceException, self).__init__()
        self.message = message or 'error in backing service'
        self.status_code = status_code
        self.payload = payload or {}

    def to_dict(self):
        return {
            **self.payload,
            'message': self.message
        }


@app.errorhandler(ServiceException)
def handle_service_exception(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
