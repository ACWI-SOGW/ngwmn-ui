"""
Unit tests for Jinja2 filters.
"""

from ngwmn import filters


def test_asset_url_filter_manifest(app, mocker):
    mocker.patch.dict(app.config, {
        'STATIC_ROOT': 'root/path/',
        'ASSET_MANIFEST': {
            'src.css': 'dest.css'
        }
    })
    assert filters.asset_url_filter('src.css') == 'root/path/dest.css'


def test_asset_url_filter_no_manifest(app, mocker):
    mocker.patch.dict(app.config, {'STATIC_ROOT': 'root/path/'})
    assert filters.asset_url_filter('src.css') == 'root/path/src.css'

def test_https_url(app):
    with app.test_request_context('http://abc.com/mypage'):
        url = filters.https_url('https://page.com/image.png')
        assert url == 'https://page.com/image.png'
    with app.test_request_context('https://abc.com/mypage'):
        url = filters.https_url('https://page.com/image.png')
        assert url == 'https://page.com/image.png'
    with app.test_request_context('https://abc.com/mypage'):
        url = filters.https_url('page.com/image.png')
        assert url == 'https://page.com/image.png'
    with app.test_request_context('http://abc.com/mypage'):
        url = filters.https_url('page.com/image.png')
        assert url == 'https://page.com/image.png'
