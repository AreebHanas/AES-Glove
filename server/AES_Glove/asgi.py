"""
ASGI config for AES_Glove project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from AES_Glove.websocket import websocket_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AES_Glove.settings')

django_application = get_asgi_application()

async def application(scope, receive, send):
    if scope['type'] == 'http':
        # Handle HTTP requests with the default Django application
        await django_application(scope, receive, send)
    elif scope['type'] == 'websocket':
        # Handle WebSocket connections with your custom logic
        await websocket_application(scope, receive, send)
    else:
        raise NotImplementedError(f"Unknown scope type {scope['type']}")