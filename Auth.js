import React,{useState,useEffect} from 'react'
import logo from '../../Assets/logo-wyt.svg'
import imgDr from '../../Assets/AuthDr.svg'
import { app } from '../Firebase'
import {collection,addDoc,where, query, onSnapshot, getFirestore} from "firebase/firestore"
import { useNavigate } from 'react-router-dom'
import './Auth.css'

import { Form,Button } from 'react-bootstrap'

function Auth({setLoggedIn}) {
  let navigate = useNavigate()
  const [user, setUser] = useState([])
  const [password,setPassword] = useState("")
  const db = getFirestore(app)
  
  var [logIn,setLogIn] = useState(true)
  const authData = {}
 
  const changePage = () => {
    setLogIn(!logIn)
  }


  const handleRegister = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let formData = [...e.target]
    formData.forEach(element => {
      if(element.name !== "")
        authData[element.name] = element.value
    })
    try {
      await addDoc(collection(db, 'doctors'), authData)
      changePage()
    } catch (err) {
      alert(err)
    }
  }


  const handleLogin=(e)=>{
    e.preventDefault();
    e.stopPropagation();
    setPassword(e.target["password"].value)
    const q = query(collection(db, 'doctors'),where("email", "==",e.target["email"].value))
    onSnapshot(q, (querySnapshot) => {
      setUser(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  }
  useEffect(() => {
    if (user.length>0){
      user.map((counter) => {
        if(counter.data.password===password){
          localStorage.setItem("dId",counter.id)
          localStorage.setItem("dName",counter.data.name)
          navigate('/home')
          //setLoggedIn(true)
        }
        return null
      }  
      )
      
    }

   
  }, [user])
  
  
  return (
    <div className='auth'>
      <div className='left'>
        <img className="logo" src={logo} alt=""/>
        <h2>Distant Health Suite</h2>
        <img className="imgDr" src={imgDr} alt=""/>
      </div>

      <div className='right'>
        {logIn ? 
        <div className="logIn">
            <h3><b>Log in</b></h3>
            <Form onSubmit={(e)=>handleLogin(e)}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control name="email" type="email" placeholder="Enter email" defaultValue=""/>  
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" placeholder="Password" />
              </Form.Group>
              <Button className='btnAuth' variant="primary" type="submit">
                Log In
              </Button>
            </Form>
            <span>Don't have an account ?
              <button onClick={changePage}><b>Register Now.</b></button>
            </span>
        </div> 
        :
        <div className="register">
        <h3><b>Register</b></h3>
        <Form onSubmit={(e)=>handleRegister(e)}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" type="text" placeholder="Enter name" />  
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control name="email" type="email" placeholder="Enter email" />  
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control name='password' type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="cPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control name='cpassword' type="password" placeholder="Password" />
          </Form.Group>
          <Button className='btnAuth' variant="primary" type="submit">
            Register
          </Button>
        </Form>
        <span onClick={changePage}>
          Already have an account ?
          <button ><b>Log in.</b></button>
        </span>
        </div>
        }
      </div>
      <h6>v 0.1</h6>
    </div>
  )
}

export default Auth