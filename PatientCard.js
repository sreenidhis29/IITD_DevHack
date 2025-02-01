import React, { useState ,useEffect } from 'react'
import { Button } from 'react-bootstrap'
import {doc, getDoc,getFirestore} from "firebase/firestore"
import {FaBinoculars,FaCopy,FaCheckSquare} from 'react-icons/fa'
import { IconContext } from "react-icons";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { set, ref,getDatabase } from "firebase/database";
import { useNavigate } from 'react-router-dom';

import { app } from '../Firebase'
import './PatientCard.css'

function PatientCard(props) {
  const db = getFirestore(app)
  const rtdb = getDatabase(app)
  const [copied,setCopied] = useState(false)
  var docSnap = {}
  let navigate = useNavigate()
  

  const handleMonitor =async(e)=>{
    e.preventDefault();
    e.stopPropagation();
    const docRef = doc(db, "patients", props.pId);
      try {
        docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
            let tmpData = {}
            tmpData['name']=docSnap.data().name
            tmpData['age']=docSnap.data().age
            tmpData['pNo']=docSnap.data().pNo
            tmpData['height']=docSnap.data().height
            tmpData['weight']=docSnap.data().weight
            tmpData['bGroup']=docSnap.data().bGroup
            localStorage.setItem("ptData",JSON.stringify(docSnap.data()));
            navigate(`/${props.pId}`)
            // props.setPtId(props.pId)
        } else {
            console.log("Document does not exist")
        }
    
    } catch(error) {
        console.log(error)
    }
  }

  const handleResolved =  ()=>{
    const query = ref(rtdb, `alert/${props.pId}`);
    set(query,false);
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false)
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className='ptCard'>
      <div>
        <h6>{props.data.name}</h6>  
        <p>{props.data.age} years old.</p>
      </div>
      <div className='info'>
      <IconContext.Provider value={{ color: "#fff",size	:"1.5em" }}>
      <h6>{props.pId} &nbsp;
        <CopyToClipboard className='copy' text={props.pId}
          onCopy={() => setCopied(true)}>
            {copied?<FaCheckSquare/>:<FaCopy/>}
          
        </CopyToClipboard>
        </h6>
      </IconContext.Provider>
        
        <div className="btns">
        <IconContext.Provider value={{ size	:"1.1em"}}>
          <Button variant="danger" size="sm" onClick={handleMonitor}>
            <FaBinoculars/> Monitor
          </Button>
          {props.alert &&

            <Button variant="success" size="sm" onClick={handleResolved}>
            <FaCheckSquare/> Resolved
            </Button>

          }
          
        </IconContext.Provider>
        </div>
        
      </div>
      
    </div>
  )
}

export default PatientCard