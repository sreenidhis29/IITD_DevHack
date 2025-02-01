import React,{useState,useEffect} from 'react';
import '../../App.css'
import home from '../../Assets/Home.svg'
import temp from '../../Assets/Temp.svg'
import {app} from '../Firebase'
import { onValue, ref,getDatabase } from "firebase/database";

function Temp(props) {
  const db = getDatabase(app);
  const [rTempValue,setrTempValue] = useState();
  const [bTempValue,setbTempValue] = useState();

  useEffect(() => {
    const query = ref(db, "rTemp");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      setrTempValue(data[props.ptId])
      //setrTempValue(data['oGNXvo8VJ19w0R4YCtfQ'])
    });

  }, []);

  useEffect(() => {
    const query = ref(db, "bTemp");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      setbTempValue(data[props.ptId])
      //setbTempValue(data['oGNXvo8VJ19w0R4YCtfQ'])
    });

  }, []);

  return (
    <div className="temp">
        <img className="tempVector" alt="" src={home}/>  
        <p>{rTempValue}<sup>o</sup>C</p>
        <img className="tempVector" alt="" src={temp} />
        <p>{bTempValue}<sup>o</sup>C</p>
  </div>
  )
}

export default Temp