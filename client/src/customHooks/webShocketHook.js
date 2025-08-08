import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  classifyFlexValue01,
  classifyFlexValue02,
  classifyFlexValue03,
  classifyFlexValue04,
  classifyFlexValue05,
  classifyFlexValue06,
  classifyFlexValue07
} from '../utils/flexClassifier';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const SOCKET_URL = "ws://20.249.219.51/:8080";
  const roundsRef = useRef(0);
  const wsRef = useRef(null);
  const [rounds, setRounds] = useState(0);
  const { processingExerciseId, sensor } = useSelector((state) => state.processingExercise);
  const { user } = useSelector((state) => state.user);
  
  useEffect(() => {
    if (processingExerciseId && user && user.id) {
      wsRef.current = new window.WebSocket(SOCKET_URL);
      const ws = wsRef.current;
      const roomId = user.id;

      ws.onopen = () => {
        roundsRef.current = 0;
        setRounds(0);
        console.log("WebSocket connection established");
        ws.send(JSON.stringify({ event: "join-room", roomId }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.event !== "test-data") return;
        const { data } = message;

        const classifyAndCount = (value) => {
          if (value === 'Full Bend') {
            roundsRef.current++;
            setRounds(roundsRef.current);
          }
        };

        try {
          switch (sensor) {
            case "EF_Flex": classifyAndCount(classifyFlexValue01(data.Flex.EF_Flex)); break;
            case "IF_Flex": classifyAndCount(classifyFlexValue02(data.Flex.IF_Flex)); break;
            case "MF_Flex": classifyAndCount(classifyFlexValue03(data.Flex.MF_Flex)); break;
            case "PF_Flex": classifyAndCount(classifyFlexValue04(data.Flex.PF_Flex)); break;
            case "RF_Flex": classifyAndCount(classifyFlexValue05(data.Flex.RF_Flex)); break;
            case "TF_Flex": classifyAndCount(classifyFlexValue06(data.Flex.TF_Flex)); break;
            case "WF_Flex": classifyAndCount(classifyFlexValue07(data.Flex.WF_Flex)); break;
            default:
              console.log('Sensor value did not match any expected flex key:', sensor);
          }
        } catch (err) {
          console.error('Error in classification or counting:', err);
        }

        if (processingExerciseId && user.id) {
          ws.send(JSON.stringify({
            event: "save-sensor-data",
            roomId,
            exerciseId: processingExerciseId,
            storeData: data,
            completedRounds: roundsRef.current
          }));
        }

        // ws.data = { data, rounds: roundsRef.current };
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        wsRef.current = null;
      };
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [processingExerciseId, user && user.id, sensor]);

  return (
    <WebSocketContext.Provider value={{ wsRef, rounds }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
