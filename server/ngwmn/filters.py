"""
Jinja2 filters. Must be imported (via ngwmn.__init__) for them to register
via the `app.template_filter` decorator.
"""

from urllib.parse import urljoin, urlparse, ParseResult

from . import app


@app.template_filter('asset_url')
def asset_url_filter(asset_src):
    """
    Filter that produces the URL for this project's static assets.

    :param str asset_src: Static asset location, relative to STATIC_ROOT.
    :return: complete URL, including STATIC_ROOT and hashed file name
    :rtype: str
    """
    manifest = app.config.get('ASSET_MANIFEST')
    asset_path = manifest[asset_src] if manifest else asset_src
    return urljoin(app.config.get('STATIC_ROOT'), asset_path)


@app.template_filter('https_url')
def https_url(url):
    """
    Returns the HTTPS version of a URL.

    :param str url: absolute URL
    :return: URL, with the protocol set as HTTPS
    """
    parsed = urlparse(url)
    if not parsed.netloc:
        parsed = urlparse(f'//{url}')
    return ParseResult('https', parsed.netloc, parsed.path, *parsed[3:]).geturl()
