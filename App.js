import React,{useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import MonitorHome from './Components/Monitoring/MonitorHome';
import Dashboard from './Components/Dashboard/Dashboard';
import Auth from './Components/Auth/Auth';
import NoDataError from './Components/Error/NoDataError';
import LoadingOverlay from 'react-loading-overlay';

import './App.css'
import { useParams } from 'react-router-dom';

function App() {
  const [isLoggedIn,setLoggedIn] = useState(false)
  const handleLog = () => setLoggedIn(!isLoggedIn);
  const [loading, setLoading] = useState(false);
  const [ptId,setPtId] = useState(false)
  const params = useParams()
  
  return (
    <div className='App'>
      <Dashboard alert = {params.alert} showall={params.show} handleLog={handleLog}/>
      {/*!isLoggedIn ?
       <Auth setLoggedIn={setLoggedIn}/>
       : 
       <>
       {ptId ?
        <>
        {
          ptId==="xxxxx"?
          <NoDataError setPtId={setPtId}/>:
          <LoadingOverlay
            className='loadingOverlay'
            active={loading}
            spinner
            text='Writing the datas into excel file...'
            >
          <MonitorHome ptId={ptId} setPtId={setPtId} loading={loading} setLoading={setLoading}/>
          </LoadingOverlay>
        }
        
        </>
        :
        <Dashboard handleLog={handleLog} setPtId={setPtId}/>}
       </>
      */} 
      {/* <Dashboard/>  */}
       {/* <MonitorHome ptId={ptId} setPtId={setPtId} loading={loading} setLoading={setLoading}/>  */}
      {/* <NoDataError/>  */}
    </div>
    
  )
}

export default App
