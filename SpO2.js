import React,{useEffect,useState} from 'react';
import '../../App.css'
import o2 from '../../Assets/O2.svg'
import {app} from '../Firebase'
import { onValue, ref,getDatabase } from "firebase/database";

function SpO2(props) {
  const db = getDatabase(app);
  const [spo2Value,setSpo2Value] = useState();
  useEffect(() => {
    const query = ref(db, "spo2");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      setSpo2Value(data[props.ptId])
      //setSpo2Value(data['oGNXvo8VJ19w0R4YCtfQ'])
    });
  }, []);

  return (
    <div className="temp">
        <img className="tempVector" alt="" src={o2} />
        <p>{spo2Value}%</p>
    </div>
  )
}

export default SpO2