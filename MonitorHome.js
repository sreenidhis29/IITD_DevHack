import React,{useState} from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';
import { useNavigate,useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import {FaCopy,FaCheckSquare,FaUserEdit,FaFileContract} from 'react-icons/fa'
import { IconContext } from "react-icons";
import {CopyToClipboard} from 'react-copy-to-clipboard';



import './Monitor.css';
import Ecg from './Ecg';
import Temp from './Temp'
import BPM from './BPM';
import SpO2 from './SpO2';
import user from '../../Assets/User.svg'
import PatientDetails from '../Dashboard/PatientDetails';

function MonitorHome(props) {
  let navigate = useNavigate()
  const params = useParams()
  const ptData = JSON.parse(localStorage.getItem("ptData"))
  const [copied,setCopied] = useState(false)
  const [show, setShow] = useState(false)
  
  
  const handleBack = ()=>{
    localStorage.setItem("ptData",{})
    // props.setPtId(false)
  }

  const handleModal = () =>{
    setShow(!show)
  }

  const handleDownload = async() =>{
    // props.setLoading(true);
    await axios({
      url: "https://suite-server.onrender.com/patient/".concat("oGNXvo8VJ19w0R4YCtfQ"),
      method: 'GET',
      responseType: 'blob'
    })
      .then(res => {
        console.log(res)
        var blob = new Blob([res.data],{type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"})
        FileSaver.saveAs(blob, 'data.xlsx');
        // props.setLoading(false);
      })
      .catch(error => {
        console.error(error);
        // props.setLoading(false);
      });
  }

  return (
    
    <div className="body" >
      <div className="details">
        <img className="user" alt="" src={user} />  
        <h4>{ptData.name}</h4>
        <p>+91{ptData.pNo}</p>
        <p>Age : {ptData.age} yrs</p>
        <p>BloodGroup : {ptData.bGroup}</p>
        <p>Weight : {ptData.weight}kg</p>
        <p>Height : {ptData.height}cms</p>
        <Button variant='danger' size='sm' onClick={handleModal}><FaUserEdit/>&nbsp;Update details</Button>
        
        <Button variant="warning" size="sm"  onClick={handleDownload}>
            <FaFileContract/> Download
        </Button>
        
        {show && <PatientDetails show={show} handleModal={handleModal} update={{...ptData,"id":props.ptId}}/>}
      </div>
      
      <div className="status">
      
      <IconContext.Provider value={{ color: "#2f9e2f",size	:"1.2em" }}>
      <h5>Patient ID :{params.pId} &nbsp;
        <CopyToClipboard text={params.pId}
          onCopy={() => setCopied(true)}>
            {copied?<FaCheckSquare/>:<FaCopy/>}
        </CopyToClipboard>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </h5>
      </IconContext.Provider>

        <div className="patientStatus">
          <span className="circle"></span>
          <p>Health Suite Status</p>
        </div>
        {/* <Button className="close" type='primary' size='sm' onClick={handleBack}>Goto Dashboard</Button> */}
      </div>
      <div className="boxes">
        <Temp ptId={params.pId}/>
        <BPM ptId={params.pId}/>
        <SpO2 ptId={params.pId}/>
        <Ecg ptId={params.pId}/> 
        
      </div>
    </div>
  )
}

export default MonitorHome