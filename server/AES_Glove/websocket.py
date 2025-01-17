# websocket.py
async def websocket_application(scope, receive, send):
    while True:
        event = await receive()

        if event['type'] == 'websocket.connect':
            print("WebSocket connection established")
            await send({
                'type': 'websocket.accept'
            })

        if event['type'] == 'websocket.disconnect':
            print("WebSocket connection closed")
            break

        if event['type'] == 'websocket.receive':
            message = event.get('text', '')  # Get the received text message
            print(f"Received message: {message}")  # Print the received message
            if message == 'ping':
                await send({
                    'type': 'websocket.send',
                    'text': 'pong!'
                })
