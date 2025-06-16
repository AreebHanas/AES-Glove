import { createContext, useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const SOCKET_URL = "ws://localhost:8080"; // Use ws:// for WebSocket
  const wsRef = useRef(null);
  const { processingExerciseId } = useSelector((state) => state.processingExercise);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    // Only create a WebSocket if processingExerciseId and user.id are set
    if (processingExerciseId && user && user.id) {
      wsRef.current = new window.WebSocket(SOCKET_URL);
      const ws = wsRef.current;
      const roomId = user.id;

      ws.onopen = () => {
        console.log("WebSocket connection established");
        ws.send(JSON.stringify({ event: "join-room", roomId }));
      };
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.event !== "test-data") return;
        const { data } = message;
        if (processingExerciseId && user.id) {
          ws.send(
            JSON.stringify({
              event: "save-sensor-data",
              roomId,
              exerciseId: processingExerciseId,
              storeData: data,
            })
          );
        }
      };
      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
        wsRef.current = null;
      };
    }
    // Cleanup: close socket on unmount or when processingExerciseId/user.id changes
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [processingExerciseId, user && user.id]);

  return (
    <WebSocketContext.Provider value={{ wsRef }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
