import React from 'react'
import noData from '../../Assets/noData.svg'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import './Error.css'


function NoDataError() {
  let navigate = useNavigate()
  
  return (
    <div className='errorPage'>
      <img className="errorImg" alt="" src={noData} /> 
      <h4>Sorry, No patient data exists!</h4>
      <Button className="close" type='primary' onClick={()=>navigate("/home")}>Go Back</Button>
    </div>
  )
}

export default NoDataError