import React, { useState } from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import { app } from '../Firebase'
import { useAlert } from 'react-alert'
import {addDoc, getFirestore, collection,updateDoc, doc} from "firebase/firestore"
import './PatientDetails.css'

function PatientDetails(props) {
  const alertSuccess = useAlert()
  const ptData = {}
  const db = getFirestore(app)
  const [weight,setWeight]=useState(0);
  const [height,setHeight]=useState(1);
  
  const addNewDocument = async (ptData) => {
    ptData["dId"] = localStorage.getItem("dId")
      try {
        const docRef = await addDoc(collection(db, 'patients'), ptData)
        console.log("data added...",docRef.id)
        navigator.clipboard.writeText(docRef.id)
        alertSuccess.show('Copied Patient ID to Clipboard!!')
      } catch (err) {
        alert(err)
      }
  }

  const updateDocument = async (ptData) => {
      try {
        await updateDoc(doc(db, 'patients',props.update.id), ptData)
        console.log("data updated...")
        
      } catch (err) {
        alert(err)
      }
  }


  const handlePatientData = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    let formData = [...e.target]
    formData.forEach(element => {
      
      if(element.name !== "")
        ptData[element.name] = element.value
    })

    props.update? updateDocument(ptData):addNewDocument(ptData)
    
    props.handleModal()
  }




  return (
      <Modal show={props.show} onHide={props.handleModal} backdrop="static" keyboard={false}>
        <Form onSubmit={(e)=>{handlePatientData(e)}}>
          <Modal.Header closeButton>
          <Modal.Title>
            <h3>
              <b>
                {
                  props.update?" Update Details" : " Add Patient"
                }
              </b>
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                defaultValue={props.update? props.update.name:""}
                name="name"
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="age">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="text"
                name="age"
                defaultValue={props.update? props.update.age:""}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="pNo">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="pNo"
                defaultValue={props.update? props.update.pNo:""}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="bGroup">
              <Form.Label>Blood Group</Form.Label>
              <Form.Select aria-label="BloodGroup Select" defaultValue={props.update? props.update.bGroup:""} name="bGroup">
              <option>select one</option>
              <option value="A+">A+</option>
              <option value="O+">O+</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
              <option value="A-">A-</option>
              <option value="O-">O-</option>
              <option value="B-">B-</option>
              <option value="AB-">AB-</option>
            </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="weight">
              <Form.Label>Weight(kg)</Form.Label>
              <Form.Control
                type="text"
                defaultValue={props.update? props.update.weight:""}
                name="weight"
                onChange={(e)=>setWeight(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="height">
              <Form.Label>Height(cm)</Form.Label>
              <Form.Control
                type="text"
                defaultValue={props.update? props.update.height:""}
                onChange={(e)=>setHeight(e.target.value)}
                name="height"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="bmi">
              <Form.Label>BMI</Form.Label>
              <Form.Control
                type="text"
                name="bmi"
                value={weight/((height*0.01)**2)}
                disabled
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="contact">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="contact"
                defaultValue={props.update? props.update.contact:""}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="history"
            >
              <Form.Label>Medical History</Form.Label>
              <Form.Control as="textarea" rows={4} name="history" defaultValue={props.update? props.update.history:""}/>
            </Form.Group>  
        
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleModal}>
            Close
          </Button>
          
          <Button variant="primary" type="submit">
            {
              props.update?"Update":"Add"
            }
            
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>
  )
}

export default PatientDetails