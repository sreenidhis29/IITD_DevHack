import React,{useEffect} from "react";
import { Chart,registerables  } from "chart.js";
import StreamingPlugin from "chartjs-plugin-streaming";
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-date-fns'
import './Monitor.css'

import {app} from '../Firebase'
import { onValue, ref,getDatabase } from "firebase/database";


Chart.register(StreamingPlugin);
Chart.register(...registerables);



function LineGraph(props) {
  const db = getDatabase(app);
  var ecgValue = 0;
  useEffect(() => {
    const query = ref(db, "ecg");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      //ecgValue = data['oGNXvo8VJ19w0R4YCtfQ']
      ecgValue = data[props.ptId]
      console.log(ecgValue)
    });
  }, []);
  
  const data={
    datasets: [
      {
        label: "ECG",
        backgroundColor: "rgba(28, 125, 240, 0.5)",
        borderColor: "rgb(23, 50, 120)",
        fill: false,
        cubicInterpolationMode: 'monotone',
        data: []
      }
    ]
  }
  
  const options={
    scales: {
      x: {
        type: "realtime",
        realtime: {
          duration: 40000,
          refresh:1000,
          frameRate:30,
          onRefresh: (chart) => {
            chart.data.datasets.forEach((dataset) => {
              dataset.data.push({
                x: Date.now(),
                y: ecgValue
              });
            });

            // update chart datasets keeping the current animation
            chart.update('quiet');
            //console.log(chart.data)
          }
        }
      },
      y:{
        display:true,
        max:700,
        min:0,
        beginAtZero:true
      }
    }
  }
  return (
      <Line 
      data={data}
      options={options}
    />
    
  )
}

export default LineGraph