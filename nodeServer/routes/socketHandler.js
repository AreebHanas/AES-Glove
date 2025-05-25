import { WebSocketServer } from 'ws';

const activeRooms = new Map(); // roomId => Set of sockets

const socketHandler = (server) => {
  const wss = new WebSocketServer({ server });

  console.log("WebSocket server attached to HTTP server");

  wss.on('connection', (ws) => {
    console.log("User connected");

    ws.roomId = null;

    ws.on('message', (message) => {
      try {
        const parsed = JSON.parse(message);
        const { event, roomId, data } = parsed;

        switch (event) {
          case 'join-room':
            ws.roomId = roomId;
            if (!activeRooms.has(roomId)) {
              activeRooms.set(roomId, new Set());
            }
            activeRooms.get(roomId).add(ws);
            console.log(`${roomId}: client joined`);
            break;

          case 'leave-room':
            if (ws.roomId && activeRooms.has(ws.roomId)) {
              activeRooms.get(ws.roomId).delete(ws);
              console.log(`${ws.roomId}: client left`);
              cleanupRoomIfEmpty(ws.roomId);
            }
            ws.roomId = null;
            break;

          case 'sencor-data':
            if (roomId && activeRooms.has(roomId)) {
              const roomSockets = activeRooms.get(roomId);
              for (const client of roomSockets) {
                if (client.readyState === ws.OPEN) {
                  client.send(JSON.stringify({ event: 'test-data', data }));
                }
              }
              console.log(`Broadcasted to ${roomId}:`, data);
            }
            break;

          default:
            console.warn("Unknown event type:", event);
        }
      } catch (err) {
        console.error("Invalid message format:", message);
      }
    });

    ws.on('close', () => {
      console.log("Client disconnected");
      if (ws.roomId && activeRooms.has(ws.roomId)) {
        activeRooms.get(ws.roomId).delete(ws);
        cleanupRoomIfEmpty(ws.roomId);
      }
    });
  });

  function cleanupRoomIfEmpty(roomId) {
    const room = activeRooms.get(roomId);
    if (!room || room.size === 0) {
      activeRooms.delete(roomId);
      console.log(`Room ${roomId} is now empty and removed`);
    }
  }
};

export default socketHandler;
