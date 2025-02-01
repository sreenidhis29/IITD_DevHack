import React,{useEffect,useState} from 'react';
import '../../App.css'
import heart from '../../Assets/heart.svg'
import {app} from '../Firebase'
import { onValue, ref,getDatabase } from "firebase/database";

function BPM(props) {
  const db = getDatabase(app);
  const [bpmValue,setBpmValue] = useState();
  useEffect(() => {
    const query = ref(db, "bpm");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      setBpmValue(data[props.ptId])
      //setBpmValue(data['oGNXvo8VJ19w0R4YCtfQ'])
      //setBpmValue(data['value'])
    });
  }, []);

  return (
    <div className="temp">
        <img className="tempVector" alt="" src={heart} />
        <p>{bpmValue}</p>
    </div>
  )
}

export default BPM