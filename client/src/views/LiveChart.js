import React, { useEffect, useState, useRef } from "react";
import ReactApexChart from 'react-apexcharts';


const LiveChart = ()=>{

const URL = "ws://127.0.0.1:8000/ws/sensor-data/"


  const [data, setData] = useState([]);
  let time = 0;
  const wsRef = useRef(null);

  // Range for X-axis
  const XAXISRANGE = 10;

  const [state, setState] = useState({
    series: [{
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
        curve: 'smooth'
      },
      title: {
        text: 'Dynamic Updating Chart',
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
        max: 100
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
  
        if (message.sensor_value) {
          const sensorValue = message.sensor_value;
  
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
      <div>
        <div id="chart">
          <ReactApexChart options={state.options} series={state.series} type="line" height={350} />
        </div>
        <div id="html-dist"></div>
      </div>
    );

}

export default LiveChart;