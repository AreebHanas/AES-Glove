import React, { useEffect, useState, useRef } from "react";
import ReactApexChart from 'react-apexcharts';
import {
  Container,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const LiveChart = ()=>{

  const SOCKET_URL = 'http://localhost:8080'; // 👈 or your backend URL
  // const ROOM_ID = 'room2';

  const [socket, setSocket] = useState(null);
  const [dataLog, setDataLog] = useState([]);
  const { currentUser } = useSelector(state => state.user);
  console.log(currentUser)
  const [data, setData] = useState([]);
  // adjust this values as per your need
  // 1st flex
  const classifyFlex01 ={
    low: 25,
    medium: 50,
    high: 75,
  }
  // 2nd flex
  const classifyFlex02 ={
    low: 20,
    medium: 50,
    high: 70,
  }
  // 3rd flex
  const classifyFlex03 ={
    low: 35,
    medium: 70,
    high: 85,
  }
  // 4th flex
  const classifyFlex04 ={
    low: 40,
    medium: 70,
    high: 90,
  }

   // 1st flex
   const classifyFlexValue01 = (value) => {
    if (value < classifyFlex01.low) return "No Bend";
    if (value < classifyFlex01.medium) return "Almost No Bend";
    if (value < classifyFlex01.high) return "Almost Full Bend";
    return "Full Bend";
  };

  // 2nd flex
  const classifyFlexValue02 = (value) => {
    if (value < classifyFlex02.low) return "No Bend";
    if (value < classifyFlex02.medium) return  "Almost No Bend";
    if (value < classifyFlex02.high) return "Almost Full Bend";
    return "Full Bend";
  };

  // 3rd flex
  const classifyFlexValue03 = (value) => {
    if (value < classifyFlex03.low) return "No Bend";
    if (value < classifyFlex03.medium) return  "Almost No Bend";
    if (value < classifyFlex03.high) return "Almost Full Bend";
    return "Full Bend";
  };

  // 4st flex
  const classifyFlexValue04 = (value) => {
    if (value < classifyFlex04.low) return "No Bend";
    if (value < classifyFlex04.medium) return  "Almost No Bend";
    if (value < classifyFlex04.high) return "Almost Full Bend";
    return "Full Bend";
  };

  const categoryMapping = {
    "No Bend": 1,
    "Almost No Bend": 2,
    "Almost Full Bend": 3,
    "Full Bend": 4
  };

  const [flexData, setFlexData] = useState({
    flex01:{
      data:[].map(val=>categoryMapping[val]),
    },
    flex02:{
      data:[].map(val=>categoryMapping[val]),
    },
    flex03:{
      data:[].map(val=>categoryMapping[val]),
    },
    flex04:{
      data:[].map(val=>categoryMapping[val]),
    },
  })
  

  let time = 0;
  const wsRef = useRef(null);

  // Range for X-axis
  const XAXISRANGE = 5;
  // Flex graph
  const [flexState, setFlexState] = useState({
    series: [{
      name:"1st Finger",
      data: flexData.flex01.data.slice(),
    },{
      name:"2nd Finger",
      data: flexData.flex02.data.slice(),
    },{
      name:"3rd Finger",
      data: flexData.flex03.data.slice(),
    },{
      name:"4th Finger",
      data: flexData.flex04.data.slice(),
    },
  ],
    options: {
      chart: {
        id: 'realtime',
        height: 350,
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
      colors: ["#FF0000", "#00FF00", "#0000FF", "#FFA500"],
      stroke: {
        curve: 'smooth',
        width: [5,5,5,5]
      },
      title: {
        text: 'Flex angle',
        align: 'left'
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: 'numeric',
      },
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
        position: 'top',
        onItemClick: {
          toggleDataSeries: true
        },
      },
    },
  });

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
  

  // useEffect(()=>{
  //   wsRef.current = new WebSocket(URL);

  //   const ws = wsRef.current;

  //   const timer = setInterval(() => {
  //     time = time + 1
  //   }, 1000);

  //   // Handle connection event
  //   ws.onopen = () => {
  //       console.log("Connected to WebSocket server");
  //     };

    
  //   // WebSocket message received
  //   ws.onmessage = (event) => {
  //       const message = JSON.parse(event.data);
  //       console.log("Received data:", message);
  
  //       if (message?.sensor_value?.sensors[1].HR) {
  //         const sensorValue = message.sensor_value.sensors[1].HR;
  
  //         setData((prevData) => {
  //           const updatedData = [...prevData];
  //           updatedData.push({
  //             x: time,
  //             y: sensorValue,
  //           });
  
  //           // Update the series with new data
  //           setState((prevState) => ({
  //             ...prevState,
  //             series: [
  //               {
  //                 data: updatedData,
  //               },
  //             ],
  //           }));
  
  //           return updatedData;
  //         });
  //       }
  //       const flex = message?.sensor_value?.sensors;
  //       if (flex && flex[0]){
  //           const flexValues = message[0];
  //           setFlexData((prev) => {
  //             const updatedFlexData = {
  //               flex01: {
  //                 data: [
  //                   ...(prev.flex01?.data || []),
  //                   { x: time, y: categoryMapping[classifyFlexValue01(flexValues.IF_Flex, "flex01")] },
  //                 ],
  //               },
  //               flex02: {
  //                 data: [
  //                   ...(prev.flex02?.data || []),
  //                   { x: time, y: categoryMapping[classifyFlexValue02(flexValues.MF_Flex, "flex02")] },
  //                 ],
  //               },
  //               flex03: {
  //                 data: [
  //                   ...(prev.flex03?.data || []),
  //                   { x: time, y: categoryMapping[classifyFlexValue03(flexValues.PF_Flex, "flex03")] },
  //                 ],
  //               },
  //               flex04: {
  //                 data: [
  //                   ...(prev.flex04?.data || []),
  //                   { x: time, y: categoryMapping[classifyFlexValue04(flexValues.RF_Flex, "flex04")] },
  //                 ],
  //               },
  //             };
          
  //             // Update `flexState` while preserving visibility state
  //             setFlexState((prevState) => {
  //               const updatedSeries = prevState.series.map((series, index) => {
  //                 const seriesKey = `flex0${index + 1}`;
  //                 return {
  //                   ...series,
  //                   data: updatedFlexData[seriesKey]?.data || series.data,
  //                 };
  //               });
          
  //               return {
  //                 ...prevState,
  //                 series: updatedSeries,
  //                 options: {
  //                   ...prevState.options,
  //                   chart: {
  //                     ...prevState.options.chart,
  //                     events: {
  //                       legendClick: (chartContext, seriesIndex) => {
  //                         const visibility = chartContext.w.globals.collapsedSeriesIndices.includes(seriesIndex);
  //                         if (visibility) {
  //                           chartContext.toggleSeries(chartContext.w.globals.seriesNames[seriesIndex]);
  //                         }
  //                       },
  //                     },
  //                   },
  //                 },
  //               };
  //             });
          
  //             return updatedFlexData;
  //           });
  //       }       
  //     };
  
  //   // WebSocket connection closed
  //   ws.onclose = (event) => {
  //       console.log("WebSocket connection closed:", event);
  //     };
  
  //     // Handle WebSocket errors
  //     ws.onerror = (error) => {
  //       console.error("WebSocket error:", error);
  //     };
  
  //     // Cleanup on component unmount
  //     return () => {
  //       ws.close();
  //       clearInterval(timer);
  //       console.log("WebSocket connection closed on unmount");
  //     };

  // },[])

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
    });
    setSocket(newSocket);

    // Join room after connecting
    newSocket.on('connect', () => {
      // console.log('Connected:', newSocket.id);
      newSocket.emit('join-room', currentUser.id);
    });

    // Handle data from backend
    newSocket.on('data', (incomingData) => {
      // console.log('Data received:', incomingData);
      setDataLog((prev) => [...prev, incomingData]);
    });

    // Cleanup on unmount
    return () => {
      newSocket.emit('leave-room', currentUser.id);
      newSocket.disconnect();
    };
  }, []);

    return (
      <>
        <Header />
        <Container className="mt-3" fluid>
          <div id="chart" className="mt-5">
            <ReactApexChart options={state.options} series={state.series} type="line" height={350} />
          </div>
          <div id="html-dist">
            <ReactApexChart options={flexState.options} series={flexState.series} type="line" height={350} />
          </div>
        </Container>
      </>
    );

}

export default LiveChart;
