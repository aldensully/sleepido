import { React, useState} from 'react';
import PropTypes from 'prop-types';
import {Paper, Button, Input, TextField, makeStyles} from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles({
  input:{
    width:'35vh',
    marginTop:'-1vh'
  },
  paper:{
    padding:'4vh',
    width: 'fit-content'
  },
  buttonDiv:{
    marginTop:'3vh',
    marginLeft:'3vh',
    display:'flex',
    flexDirection:'row',
  },
  label:{
  }
})


export default function Login(props){
    const [username,setUserName] = useState();
    const [password,setPassword] = useState();
    const [email,setEmail] = useState();
    const classes = useStyles();


    async function handleCreateAccount(){
      let res = await axios.post('http://localhost:5000/createaccount',{
        username:username,
        password:password,
        email:email
      })
      console.log(res.data)
      if(res.data == 'error'){
        alert('username already taken');
      }
      else{
        alert('successfully created account');
        sessionStorage.setItem('username',res.data.username);
        sessionStorage.setItem('token',res.data.token);
        props.onTokenSubmit(res.data.token);
      }

    }

    async function handleSignIn(){
      
      let res = await axios.post('http://localhost:5000/signin',{
        username:username,
        password:password,
      })

      if(res.data == '404'){
        alert('user was not found');
      }
      else if(res.data == '401'){
        alert('incorrect username or password');
      }
      else{
        alert('successfully signed in');
        alert(res.data.username);
        sessionStorage.setItem('username',res.data.username);
        sessionStorage.setItem('token',res.data.token);
        props.onTokenSubmit(res.data.token);
      }
    }



    return(
      <Paper className={classes.paper}>
        <label className={classes.label}>
            <p>Username</p>
            <TextField margin='dense' variant="outlined" className={classes.input} type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label className={classes.label}>
            <p>Password</p>
            <TextField margin='dense' variant='outlined' className={classes.input} type="password" onChange={e => setPassword(e.target.value)}/>
        </label>
        <label className={classes.label}>
          <div style={{display:'flex',}}>
            <p>Email</p>
            <p style={{marginLeft:'2vh',marginTop:'1.8vh',fontSize:'1.2vh', color:'orange'}}>*only if creating account</p>
          </div>
            <TextField margin='dense' variant='outlined' className={classes.input} type="email" onChange={e => setEmail(e.target.value)}/>
        </label>
        <div className={classes.buttonDiv}>
            <Button onClick={()=>handleCreateAccount()} variant="outlined">Create Account</Button>
            <Button onClick={()=>handleSignIn()} variant="outlined" style={{marginLeft:'3vh'}}>Sign In</Button>
        </div>
      </Paper>
    )

}

