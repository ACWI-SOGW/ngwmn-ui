PYTHON := server/env/bin/python
PIP := server/env/bin/pip

.PHONY: env-server test-server clean-server cleanenv-server watch-server

build-server: build-assets
	@echo 'Building server...'
	cd server && ./env/bin/python setup.py bdist_wheel

clean-server:
	@echo 'Cleaning server...'
	rm -rf server/dist
	rm -rf server/build


#
# Development targets
#
test-server:
	server/env/bin/coverage run --omit=server/ngwmn/tests/*.py,env/* -m pytest server/ngwmn/
	server/env/bin/coverage xml

watch-server:
	$(PYTHON) server/run.py


#
# Environment configuration targets
#
env-server: server/env server/instance/config.py server-env-requirements

server/env:
	@echo 'Creating the virtualenv env'
	virtualenv --python=python3 --no-download server/env

server-env-requirements:
	@echo 'Installing requirements.txt'
	$(PIP) install -r server/requirements.txt -r server/requirements-dev.txt

server/instance/config.py:
	@echo 'Creating server/instance/config.py...'
	mkdir -p server/instance
	cp server/config.py.sample server/instance/config.py

cleanenv-server: clean-server
	@echo 'Cleaning graph-server environment...'
	rm -rf server/env
