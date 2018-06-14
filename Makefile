#
# Entrypoint Makefile for National Ground Water Monitoring Network User Interface
#

default: build

help:
	@echo  'NGWMN UI Makefile targets:'
	@echo  '  build (default) - Produce the build artifact for each project'
	@echo  '  env - Create a local development environment'
	@echo  '  watch - Run local development servers'
	@echo  '  test - Run all project tests'
	@echo  '  clean - Remove all build artifacts'
	@echo  '  cleanenv - Remove all environment artifacts'

include assets/Makefile
include server/Makefile

.PHONY: help env test clean cleanenv coverage

MAKEPID:= $(shell echo $$PPID)

env: env-assets env-server
test: test-assets test-server
clean: clean-assets clean-server
cleanenv: cleanenv-assets cleanenv-server
build: env build-assets build-server
watch:
	(make watch-server & \
	 make watch-assets & \
	 wait) || kill -TERM $(MAKEPID)
coverage:
	mkdir -p ./server/coverage
	find ./assets/coverage/ -mindepth 2 -iname '*.info' -exec cp {} ./server/coverage \;
	coveralls-lcov -v -n ./server/coverage/lcov.info > ./server/coverage/coverage.json
	cd server && env/bin/coveralls --merge=./coverage/coverage.json