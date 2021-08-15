import {makeStyles} from '@material-ui/core';
import {React,Component,useState, useEffect} from 'react';
import {Paper,TextField} from '@material-ui/core';
import {Dialog,DialogTitle} from '@material-ui/core';
import { Button } from '@material-ui/core';
import {Howl,Howler} from 'howler';
import PropTypes from 'prop-types';
import Modal from './modal';
import Socket from './socket';

const useStyles = makeStyles({
    paper: {
      backgroundColor:'#f3f3f3',
      width:'70vh',
      height:'40vh',
      display:'flex',
      alignItems:'center',
      flexDirection:'column',
      borderTopRightRadius:'100px',
      borderTopLeftRadius:'100px',
      borderBottomLeftRadius:'100px',
      borderBottomRightRadius:'100px',
      marginTop:'13vh',
      border: '10px solid',
      borderColor:'silver',

    },
    container:{
        margin:'5vh',
        marginTop:'4vh',
        display: 'flex',
    },
    textField: {
        marginLeft: '2vh',
        marginRight: '4vh',
        width: '22vh',
      },
    button:{
        height:'5vh',
        width:'8vh',
        marginTop:'5vh',
        borderRadius:'15vh'
    },
    switch:{
        marginLeft:'8vh'
    }

  });
  
export default function Alarm(props){
    const classes = useStyles();
    const [time,setTime] = useState(new Date());


    function alarmWentOff(){
        props.setOnTriggered();
        document.getElementById("paper").style.boxShadow = '0 0 0 0';
    }
    function setAlarm(){

        document.getElementById("paper").style.boxShadow = '0px 0px 100px 2px pink';  //set highlight background

        var alarm = new Date(parseInt(time.year),parseInt(time.month)-1,parseInt(time.day),parseInt(time.hour),parseInt(time.minute));  //parsed time from state
        var now = new Date();   //current time
        const diff = alarm.getTime() - now.getTime();  //difference in milliseconds
        
        setTimeout(()=>alarmWentOff(),diff) //trigger alarm in dashboard component
    }
        
    //for user changing date
    function handleTime(time){
        const newTime = time.split(/[-T:]/);
        setTime({year:newTime[0],day:newTime[2],month:newTime[1],hour:newTime[3],minute:newTime[4]});
    }
    
    return(
        <Paper id="paper" className={classes.paper}>
        <form onChange={(event)=>handleTime(event.target.value)} className={classes.container} noValidate>
        <TextField
            id="datetime-local"
            label="Time"
            type="datetime-local"
            defaultValue="2021-08-11T10:30"
            className={classes.textField}
            InputLabelProps={{
                shrink: true,
            }}
            />
        </form>
        <div style={{flexDirection:'column'}}>
        <Button onClick={()=>setAlarm()} variant='outlined' size='large' className={classes.button}>
            Set
        </Button>
        <Button variant='outlined' style={{marginLeft:'5vh'}} className={classes.button} size="small">delete</Button>
        </div>
        </Paper>
    )
}