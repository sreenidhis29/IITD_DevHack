import  React,{useState,useEffect} from 'react'
import {Form, InputGroup, FormControl,Button,Modal} from 'react-bootstrap'
import { app } from '../Firebase'
import {collection,where, query, onSnapshot, getFirestore} from "firebase/firestore"
import { FaSearch,FaUserPlus,FaThList } from 'react-icons/fa';
import { RiLoginCircleFill } from "react-icons/ri";
import { IconContext } from "react-icons";
import axios from 'axios';
import { onValue, ref,getDatabase } from "firebase/database";
import Logo from '../../Assets/logo.svg'
import PatientDetails from './PatientDetails'
import PatientCard from './PatientCard';
import {doc, getDoc} from "firebase/firestore"
import {   useNavigate} from 'react-router-dom';
import './Dashboard.css'

function Dashboard(props) {
  const db = getFirestore(app)
  const [greeting, setGreeting] = useState("");
  const [alert, setAlert] = useState(false);
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const currentDate = new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const dName = localStorage.getItem("dName")
  const dId = localStorage.getItem("dId")
  const [totalCount,setTotal] = useState(0)
  var docSnap={}
  const [showList, setShowList] = useState(false);
  const [alertList,setAlertList] = useState(false)
  const [patients , setPatients] = useState([]);
  const[isHome,setIsHome] = useState(true)
  const rtdb = getDatabase(app);
  const[alertPatients,setAlertPatients] = useState([])
  let navigate = useNavigate()
 
  useEffect(() => {
    const query = ref(rtdb, "alert");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      let tmp = []
      Object.entries(data).forEach(
        (obj)=>{
          if (obj[1] === true){
            tmp.push(obj[0])
          }
        }
      )
      setAlertPatients(tmp)
    });
  }, []);

  
  const handleModal = () => {
    setShow(!show)
    console.log(show)
  }

  const handleLogout = () => {
    setAlert(true);
  }
  
  const showAllPtList =()=>{
    setShowList(true)
    setIsHome(false)
  }

  const showAlertList =()=>{
    setAlertList(true)
    setIsHome(false)
  }

  const handleSearch = async(e) => {
    e.preventDefault();
    e.stopPropagation();
    const docRef = doc(db, "patients", searchTerm);
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
            console.log(tmpData)
            navigate(`/${searchTerm}`)
        } else {
          navigate("/error")
            console.log("Document does not exist")
        }
    
    } catch(error) {
        console.log(error)
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    const q = query(collection(db, 'patients'),where("dId", "==",dId))
    onSnapshot(q, (querySnapshot) => {
      setPatients(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
      setTotal(querySnapshot.size)
    })
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateGreeting = () => {
      const currentTime = new Date().getHours();
      if (currentTime < 12) {
        setGreeting("Good morning!");
      } else if (currentTime < 18) {
        setGreeting("Good afternoon!");
      } else {
        setGreeting("Good evening!");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 3600000); // update greeting every hour
    return () => clearInterval(interval);
  }, []);
  
  const handleClose = () => setAlert(false);


  return (
    <div className='Dashboard'>
      <Modal show={alert} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Log out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={()=>navigate('/')}>
            Yes, I'm Sure
          </Button>
        </Modal.Footer>
      </Modal>
      
    <div className='top'>
      <div className='head'>
        <img className='logo' src={Logo} alt="logo"/>
        <h2 className='main' style={{display:"inline-block"}}><b>Health Connect</b></h2>
        {isHome?
        <h5 style={{display:"inline-block",alignSelf:"center "}}>Dashboard</h5>
        : 
        <>
        {alertList?
        <h5 style={{display:"inline-block",alignSelf:"center "}}>Patients in need of consultation&nbsp;&nbsp;
        <Button variant="primary"  onClick={()=>{setIsHome(true)
                                                 setAlertList(false)}}>
        Go Back
        </Button>
        </h5>:
        <h5 style={{display:"inline-block",alignSelf:"center "}}>Registered Patients&nbsp;&nbsp;
        <Button variant="primary"  onClick={()=>{setIsHome(true)
                                                 setShowList(false)
                                                  }}>
        Go Back
        </Button>
        </h5>

        }
        </>
        }
      </div>

      <Form onSubmit={handleSearch}>
        <InputGroup>
          <FormControl
            type="text"
            placeholder="Patient ID"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
          />
            <Button type="submit" ><FaSearch/></Button>
        </InputGroup>
      </Form>
      <IconContext.Provider value={{ color: "#173278", className: "logout",size	:"2.5em" }}>
        <RiLoginCircleFill alt="logout" onClick={handleLogout}/>
      </IconContext.Provider>
    </div>
    {showList|| alertList? 
    
    <div className="ptList">
      {alertList?
        <>
        {patients.map((patient) =>{
          if(alertPatients.includes(patient.id))
          return <PatientCard key={patient.id} pId={patient.id} data={patient.data}  alert={true}/>
        })}
        </>:
        <>
        {patients.map((patient) =>
          <PatientCard key={patient.id} pId={patient.id} data={patient.data}  />
        )}
        </>
      }
    </div>
      
      :
      <div className='contentPane'>
      <div className="leftPane">
        <div className='greeting'>
          <div className="time">
            <h3>{greeting}</h3>
            <h5> {time} | {currentDate}</h5>
          </div>
          <div className="vl"></div>
          <div className="doctor">
            <h3>Dr. {dName}</h3>
          </div>
        </div>

        <div className='observation'>
          <div className="totalCount">
            <h1>{totalCount}</h1>
            <p>Patient(s) under observation</p>
          </div>
          <div className="patients row g-2">
          <Button variant="primary" onClick={handleModal}>
            <FaUserPlus/> Add Patient
          </Button>
          <Button variant="primary" onClick={showAllPtList}>
            <FaThList/>&nbsp; Show All
          </Button>
          </div>
          
          {show && <PatientDetails show={show} handleModal={handleModal} update={false}/>}
        </div>

        <div className='assistance'>
          <div>
          <h1>{alertPatients.length}</h1>
          <p>Patient(s) are in need of assistance</p>
          </div>
          <Button variant="danger" onClick={showAlertList}>
            <FaThList/> Details
          </Button>
        </div>
      </div>
      <div className="rightPane">
        <h4><b>Recent Patients</b></h4>
        {patients.slice(0,3).map((patient) =>
        <PatientCard key={patient.id} pId={patient.id} data={patient.data}/>
        )}
      </div>
    </div>
    }
    </div>
  )
}
export default Dashboard