FROM python:3.7.2-slim-stretch

WORKDIR /app
COPY / /app

RUN pip3 install --no-cache-dir -e .

EXPOSE 8000
CMD gunicorn -b 0.0.0.0:8000 -k "geventwebsocket.gunicorn.workers.GeventWebSocketWorker" algebra_solver.app.flask:app