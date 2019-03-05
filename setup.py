from io import open

from setuptools import find_packages, setup

with open('algebra_solver/__init__.py', 'r') as f:
    for line in f:
        if line.startswith('__version__'):
            version = line.strip().split('=')[1].strip(' \'"')
            break
    else:
        version = '0.0.1'


REQUIRES = [
    'tensorflow',
    'flask',
    'celery',
    'redis',
    'gevent',
    'gevent-websocket',
    # TODO this is testing related package, find a place to put testing packages
    'websockets'
]

setup(
    name='algebra_solver',
    version=version,
    description='',
    author='GYCHEN',
    author_email='gy.chen@gms.nutc.edu.tw',
    url='https://github.com/gy-chen/algebra_solver',

    install_requires=REQUIRES,
    tests_require=['coverage', 'pytest'],

    packages=find_packages(),
)
