import { WebSocketServer } from 'ws';
import SensorData from '../models/sensorModel.js';

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
            
            // Save to DB
              const flexData = data.Flex || {};
              const sensorsArray = data.sensors || [];

              const sensorObj = {
                HR: sensorsArray.find(s => s.HR !== undefined)?.HR || null,
                SPO2: sensorsArray.find(s => s.SPO2 !== undefined)?.SPO2 || null,
                EMG: parseFloat(sensorsArray.find(s => s.EMG !== undefined)?.EMG || 0),
                Pressure: parseFloat(sensorsArray.find(s => s.Pressure !== undefined)?.Pressure || 0),
              };

              const newSensorRecord = new SensorData({
                userId: roomId, // assuming roomId is userId
                flex: flexData,
                sensors: sensorObj,
                status: data.Status || 'Active',
                battery: data.Battery || 'Unknown',
              });

              newSensorRecord.save()
              .then(() => {
                console.log(`Saved sensor data for user: ${roomId}`);
              })
              .catch((err) => {
                console.error("Failed to save sensor data:", err);
              });

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
