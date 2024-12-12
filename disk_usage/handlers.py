import json
import os
import psutil

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado

class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        path = "/home/jovyan"
        if not os.path.isdir(path):
            path = "/"
        total, used, free, percentage = psutil.disk_usage(path)
        self.finish(json.dumps({
            "disk_total": total,
            "disk_used": used,
            "disk_free": free,
            "disk_percentage": percentage,
        }))


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "disk-usage", "get")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
