import json
from channels.generic.websocket import AsyncWebsocketConsumer

class SensorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the WebSocket connection
        await self.accept()

        # Assign a room name (group) for broadcasting
        self.room_name = "sensor_data"
        self.room_group_name = f"sensor_{self.room_name}"

        # Add this WebSocket connection to the group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Send a message indicating successful connection
        await self.send(text_data=json.dumps({
            "message": "Connected to sensor data group"
        }))

    async def disconnect(self, close_code):
        # Remove this WebSocket connection from the group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Receive data from the WebSocket
        data = json.loads(text_data)  # Parse the incoming message
        print(data)
        # Broadcast the received data to all clients in the group (if any connected)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'sensor_data_message',
                'data': data  # Data to send to all connected clients
            }
        )

    async def sensor_data_message(self, event):
        # Send the received data to WebSocket clients that are part of the group
        data = event['data']
        await self.send(text_data=json.dumps({
            'sensor_value': data['sensor_value']  # Adjust this based on your data structure
        }))
