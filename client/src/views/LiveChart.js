import React, { useEffect, useState, useRef } from "react";
import ReactApexChart from 'react-apexcharts';
import {
  Container,
} from "reactstrap";
import Header from "components/Headers/Header.js";

const LiveChart = ()=>{

const URL = "ws://127.0.0.1:8000/ws/sensor-data/"

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
    low: 15,
    medium: 35,
    high: 65,
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
    if (value < classifyFlex01.low) return 'low';
    if (value < classifyFlex01.medium) return 'medium';
    if (value < classifyFlex01.high) return 'high';
    return 'very high';
  };

  // 2nd flex
  const classifyFlexValue02 = (value) => {
    if (value < classifyFlex02.low) return 'low';
    if (value < classifyFlex02.medium) return 'medium';
    if (value < classifyFlex02.high) return 'high';
    return 'very high';
  };

  // 3rd flex
  const classifyFlexValue03 = (value) => {
    if (value < classifyFlex03.low) return 'low';
    if (value < classifyFlex03.medium) return 'medium';
    if (value < classifyFlex03.high) return 'high';
    return 'very high';
  };

  // 4st flex
  const classifyFlexValue04 = (value) => {
    if (value < classifyFlex04.low) return 'low';
    if (value < classifyFlex04.medium) return 'medium';
    if (value < classifyFlex04.high) return 'high';
    return 'very high';
  };

  const categoryMapping = {
    "low": 1,
    "medium": 2,
    "high": 3,
    "very high": 4
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
        range: XAXISRANGE,
        floating:false,
        stepSize:1,
        mix:0
      },
      yaxis: {
        labels: {
          formatter: (value) => {
            const reverseMapping = {
              1: 'low',
              2: 'medium',
              3: 'high',
              4: 'very high'
            };
            return reverseMapping[value];
          }
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
  

  useEffect(()=>{
    wsRef.current = new WebSocket(URL);

    const ws = wsRef.current;

    const timer = setInterval(() => {
      time = time + 1
    }, 1000);

    // Handle connection event
    ws.onopen = () => {
        console.log("Connected to WebSocket server");
      };

    
    // WebSocket message received
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received data:", message);
  
        if (message.sensor_value.sensors[1].HR) {
          const sensorValue = message.sensor_value.sensors[1].HR;
  
          setData((prevData) => {
            const updatedData = [...prevData];
            updatedData.push({
              x: time,
              y: sensorValue,
            });
  
            // Update the series with new data
            setState((prevState) => ({
              ...prevState,
              series: [
                {
                  data: updatedData,
                },
              ],
            }));
  
            return updatedData;
          });
        }

        if (message.sensor_value.sensors[1].flex){

          const flexValues = message.sensor_value.sensors[1].flex;
          setFlexData((prev)=>(
            {
              flex01: [...prev.flex01.data, { x: time, y: classifyFlexValue01(flexValues[0]) }].slice(-50),
              flex02: [...prev.flex02.data, { x: time, y: classifyFlexValue02(flexValues[0]) }].slice(-50),
              flex03: [...prev.flex03.data, { x: time, y: classifyFlexValue03(flexValues[0]) }].slice(-50),
              flex04: [...prev.flex04.data, { x: time, y: classifyFlexValue04(flexValues[0]) }].slice(-50),
            }))
            // Update the series with new data
          setFlexState((prevState) => ({
              ...prevState,
              series: [
                {...prevState.series[0],data:flexData.flex01.data},
                {...prevState.series[1],data:flexData.flex02.data},
                {...prevState.series[2],data:flexData.flex03.data},
                {...prevState.series[3],data:flexData.flex04.data},
              ],
            }));
          }
      };
  
    // WebSocket connection closed
    ws.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
      };
  
      // Handle WebSocket errors
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
  
      // Cleanup on component unmount
      return () => {
        ws.close();
        clearInterval(timer);
        console.log("WebSocket connection closed on unmount");
      };

  },[])

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