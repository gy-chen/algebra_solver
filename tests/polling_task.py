"""Websocket client for testing polling task api.

Don't know how to test websocket in pytest yet, so write this.

Start testing:
  1. start up algebra solver flask app
  2. start up celery worker
  3. run this script
"""
import asyncio
import json
import websockets
import logging
from urllib.request import urlopen, Request
from urllib.parse import urlencode

APP_BASE_PATH = 'http://127.0.0.1:5000'
WS_BASE_PATH = 'ws://127.0.0.1:5000'


def main():
    task = _create_task()
    test_polling_coroute = _test_polling(task)
    asyncio.run(test_polling_coroute)


def _create_task():
    create_task_path = APP_BASE_PATH + '/task/'
    content = 'x + 1 = 0'
    data = urlencode({'content': content}).encode()
    req = Request(create_task_path, data=data, method='POST')
    res = urlopen(req)
    return json.loads(res.read())['task']


async def _test_polling(task):
    polling_path = WS_BASE_PATH + '/task/polling/{}'.format(task['id'])
    async with websockets.connect(polling_path) as websocket:
        while True:
            task_text = await websocket.recv()
            received_task = json.loads(task_text)
            assert received_task['id'] == task['id']
            assert received_task['content'] == task['content']
            print(received_task)
            logging.debug(received_task)
            if received_task['state'] == 'DONE':
                assert received_task['result']['x'] == -1
                websocket.close()
                break


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    main()
