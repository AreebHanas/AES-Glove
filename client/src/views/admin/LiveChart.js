import React, { useEffect, useState, useRef } from "react";
import ReactApexChart from 'react-apexcharts';
import {
  Container,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  classifyFlexValue01,
  classifyFlexValue02,
  classifyFlexValue03,
  classifyFlexValue04,
  classifyFlexValue05,
  classifyFlexValue06,
  classifyFlexValue07
} from '../../utils/flexClassifier';
import User from "components/Headers/User.js";

const LiveChart = ()=>{

  const SOCKET_URL = 'http://localhost:8080'; // 👈 or your backend URL

  const [socket, setSocket] = useState(null);
  const [dataLog, setDataLog] = useState([]);
  const { currentUser,user } = useSelector(state => state.user);
  const [data, setData] = useState([]);
  // adjust this values as per your need
  console.log(dataLog)
  // Flex classification logic (reuse from flexClassifier.js)
  const classifyFlex = [
    classifyFlexValue01,
    classifyFlexValue02,
    classifyFlexValue03,
    classifyFlexValue04,
    classifyFlexValue05,
    classifyFlexValue06,
    classifyFlexValue07,
  ];

  const categoryMapping = {
    "No Bend": 1,
    "Almost No Bend": 2,
    "Almost Full Bend": 3,
    "Full Bend": 4
  };

  // Flex graph (map directly from Flex keys)
  const flexSensorKeys = [
     "EF_Flex", "IF_Flex", "MF_Flex", "PF_Flex", "RF_Flex",
    "TF_Flex", "WF_Flex"
  ];
  const flexSensorNames = [
    "1st Finger", "2nd Finger", "3rd Finger", "4th Finger",
    "5th Finger", "6th Finger", "7th Finger"
  ];
  const flexClassifiers = [
    classifyFlexValue01, classifyFlexValue02, classifyFlexValue03, classifyFlexValue04,
    classifyFlexValue05, classifyFlexValue06, classifyFlexValue07
  ];
  const [flexSeries, setFlexSeries] = useState(
    flexSensorNames.map((name) => ({ name, data: [] }))
  );
  const flexOptions = {
    chart: {
      id: "realtime-flex",
      height: 350,
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: { speed: 1000 },
      },
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    colors: ["#FF0000", "#00FF00", "#0000FF", "#FFA500"],
    stroke: { curve: "smooth", width: [5, 5, 5, 5] },
    title: { text: "Flex angle", align: "left" },
    markers: { size: 0 },
    xaxis: { type: "numeric" },
    yaxis: {
      labels: {
        formatter: (value) => {
          const reverseMapping = {
            1: "No Bend",
            2: "Almost No Bend",
            3: "Almost Full Bend",
            4: "Full Bend",
          };
          return reverseMapping[value];
        },
      },
      min: 1,
      max: 4,
    },
    legend: {
      show: true,
      position: "top",
      onItemClick: { toggleDataSeries: true },
    },
  };

  // Pressure and EMG data
  const [pressureData, setPressureData] = useState([]);
  const [emgData, setEmgData] = useState([]);
   const XAXISRANGE = 5;

  // Pressure chart state
  const [pressureState, setPressureState] = useState({
    series: [{ name: 'Pressure', data: [] }],
    options: {
      chart: {
        id: 'realtime-pressure',
        height: 350,
        type: 'line',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: { speed: 1000 }
        },
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      title: { text: 'Pressure', align: 'left' },
      markers: { size: 0 },
      xaxis: {
        type: 'numeric',
        range: XAXISRANGE,
        floating:false,
        stepSize:1,
        min:0,
        mix:0
      },
      yaxis: { title: { text: 'Pressure' } },
      legend: { show: false },
    },
  });

  // EMG chart state
  const [emgState, setEmgState] = useState({
    series: [{ name: 'EMG', data: [] }],
    options: {
      chart: {
        id: 'realtime-emg',
        height: 350,
        type: 'line',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: { speed: 1000 }
        },
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      title: { text: 'EMG', align: 'left' },
      markers: { size: 0 },
      xaxis: {
        type: 'numeric',
        range: XAXISRANGE,
        floating:false,
        stepSize:1,
        min:0,
        mix:0
      },
      yaxis: { title: { text: 'EMG' } },
      legend: { show: false },
    },
  });

  // Range for X-axis
  // HR graph
  const [state, setState] = useState({
    series: [{
      name:"HR rate",
      data: data.slice()
    }],
    options: {
      chart: {
        id: 'realtime',
        height: 500,
        type: 'line',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'Hate Rate Value',
        align: 'left'
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: 'numeric',
        range: XAXISRANGE,
        floating:false,
        stepSize:1,
        min:0,
        mix:0
      },
      yaxis: {
        max: 100,
      },
      legend: {
        show: false
      },
    },
  });
  
  const wsRef = useRef(null);

  useEffect(() => {
  const ws = new WebSocket(SOCKET_URL); // Use your defined URL
  wsRef.current = ws;

  // Set your roomId here (can be dynamic or hardcoded)
  const roomId = currentUser.id; // Change as needed

  let currentTime = 0;
  const timer = setInterval(() => {
    currentTime += 1;
  }, 1000);

  ws.onopen = () => {
    console.log("Connected to WebSocket server");
    // Join the room after connection
    ws.send(JSON.stringify({ event: "join-room", roomId }));
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.event !== 'test-data') return;
    const { data } = message;
    // Flex sensors
    if (data.Flex) {
      setDataLog(prev => ([...prev, { ...data }]));
    }
    // Pressure
    if (Array.isArray(data.sensors) && data.sensors[2]?.Pressure !== undefined) {
      setPressureData(prev => {
        const updated = [...prev, { x: currentTime, y: Number(data.sensors[2].Pressure) }];
        setPressureState(ps => ({
          ...ps,
          series: [{ ...ps.series[0], data: updated }]
        }));
        return updated;
      });
    }
    // EMG
    if (Array.isArray(data.sensors) && data.sensors[1]?.EMG !== undefined) {
      setEmgData(prev => {
        const updated = [...prev, { x: currentTime, y: Number(data.sensors[1].EMG) }];
        setEmgState(es => ({
          ...es,
          series: [{ ...es.series[0], data: updated }]
        }));
        return updated;
      });
    }
    // HR (keep your original HR logic)
    const hr = Array.isArray(data.sensors) && data.sensors[0]?.HR;
    if (hr !== undefined) {
      setData((prev) => {
        const updated = [...prev, { x: currentTime, y: hr }];
        setState((prevState) => ({
          ...prevState,
          series: [{ ...prevState.series[0], data: updated }]
        }));
        return updated;
      });
    }
  };

  ws.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
  };

  return () => {
    clearInterval(timer);
    ws.close();
  };
}, []);

  // Update flex graph from socket dataLog
  useEffect(() => {
    if (!dataLog.length) return;
    const last = dataLog[dataLog.length - 1];
    const flex = last?.Flex;
    if (!flex) return;
    setFlexSeries((prev) =>
      flexSensorKeys.map((key, idx) => ({
        name: flexSensorNames[idx],
        data: [
          ...(prev[idx]?.data || []),
          {
            x: prev[idx]?.data?.length ? prev[idx].data[prev[idx].data.length - 1].x + 1 : 1,
            y: categoryMapping[
              classifyFlex[idx](flex[key])
            ],
          },
        ].slice(-XAXISRANGE),
      }))
    );
  }, [dataLog]);



    return (
      <>
      {
        user.userRole === "admin" ?<Header />: <User />
      }
        <Container className="mt-7" fluid>
          <div id="chart" className="">
            <ReactApexChart options={state.options} series={state.series} type="line" height={350} />
          </div>
          <div id="flex-chart">
            <ReactApexChart options={flexOptions} series={flexSeries} type="line" height={350} />
          </div>
          <div id="pressure-chart">
            <ReactApexChart options={pressureState.options} series={pressureState.series} type="line" height={350} />
          </div>
          <div id="emg-chart">
            <ReactApexChart options={emgState.options} series={emgState.series} type="line" height={350} />
          </div>
        </Container>
      </>
    );

}

export default LiveChart;
