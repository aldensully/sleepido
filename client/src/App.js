import {React,useState} from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import {CssBaseline,Typography} from '@material-ui/core';
import Dashboard from './components/dashboard';
import Login from './components/login';
import Store from './components/store';
import { SocketContext,socket } from './components/socket';

function getToken(){
  const token = sessionStorage.getItem('token');
  return token;
}
function saveToken(token){
  sessionStorage.setItem('token', token);
}
function App() {
  //const [token,setToken] = useState();
  const [token,setToken] = useState(getToken);

  if(!token) {
    return (
      <CssBaseline>
      <div style={{display:'flex',height:'100vh',background:'linear-gradient(180deg, #cebff5 30%, #8c79bd 90%)',
                  flexDirection:'column',alignItems:'center',}}>
        <Typography variant='h2' style={{marginTop:'8vh',color:'white'}}>SleepIdo</Typography>
      <div style={{marginTop:'10vh'}}>
        <Login onTokenSubmit={setToken}/>
      </div>
      </div>
      </CssBaseline>
    )
  }
  else{
    //saveToken(token);
    return (
      <SocketContext.Provider value={socket}>
      <Dashboard />
      </SocketContext.Provider>
    );
  }
}

export default App;
