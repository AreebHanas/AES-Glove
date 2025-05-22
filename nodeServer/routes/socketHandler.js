const activeRooms = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId) => {
      console.log(`>>>>${socket.id} joined room: ${roomId}`);
      socket.join(roomId);

      // if (!activeRooms.has(roomId)) {
      //   startSendingRandomData(io, roomId);
      // }
    });

    socket.on('sencor-data',(roomId, data)=>{
      console.log(`Received data from ${socket.id} in room ${roomId}:`);
      io.to(roomId).emit('test-data', data);
    })
    
    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      console.log(`>>>>${socket.id} left room: ${roomId}`);
      cleanupRoomIfEmpty(io, roomId);
    });

    socket.on('disconnect', () => {
      console.log('>>>>User disconnected:', socket.id);
      setTimeout(() => {
        const rooms = io.sockets.adapter.rooms;
        for (const [roomId, _] of activeRooms) {
          cleanupRoomIfEmpty(io, roomId);
        }
      }, 1000);
    });
  });
}

// function startSendingRandomData(io, roomId) {
//   const intervalId = setInterval(() => {
//     const randomData = {
//       timestamp: new Date(),
//       value: Math.floor(Math.random() * 100),
//     };
//     io.to(roomId).emit('data', randomData);
//     console.log(`Sent to ${roomId}:`, randomData);
//   }, 2000);

//   activeRooms.set(roomId, intervalId);
// }

function cleanupRoomIfEmpty(io, roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  const isEmpty = !room || room.size === 0;

  if (isEmpty && activeRooms.has(roomId)) {
    clearInterval(activeRooms.get(roomId));
    activeRooms.delete(roomId);
    console.log(`Stopped sending to ${roomId} (room is empty)`);
  }
}

export default socketHandler;
