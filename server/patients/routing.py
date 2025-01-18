from django.urls import path
from patients.consumers import SensorConsumer

websocket_urlpatterns = [
    path("ws/sensor-data/", SensorConsumer.as_asgi()),
]
