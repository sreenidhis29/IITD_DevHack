import React from 'react';
import LineGraph from "./LineGraph"
import './Monitor.css'

function Ecg(props) {
  return (
      <div className="ecg">
        <LineGraph ptId={props.ptId}/>
      </div>
  )
}
export default Ecg