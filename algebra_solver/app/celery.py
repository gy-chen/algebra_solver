from algebra_solver.app.flask import app as flask_app
from algebra_solver.web.extension import celery

flask_app.app_context().push()
app = celery.app
