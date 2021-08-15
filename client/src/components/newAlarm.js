import {makeStyles} from '@material-ui/core';
import {React,Component,useState, useEffect,useContext, useCallback} from 'react';
import {Paper,TextField} from '@material-ui/core';
import { Button } from '@material-ui/core';
import {SocketContext} from './socket';

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
      position:'absolute',
      zIndex:0

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
  
export default function NewAlarm(props){
    const classes = useStyles();
    const [time,setTime] = useState(new Date());   //for parsing the user input of the alarm time
    const [activeAlarmTime,setActiveAlarmTime] = useState(); //to keep track of the current active alarm time
    const [alarmArmed,setAlarmArmed] = useState(props.alarmArmed);  //when alarm goes off(in dashboard component), tell this comp to reset
    const socket = useContext(SocketContext);

    useEffect(() => {
        setAlarmArmed(props.alarmArmed);
    }, [props.alarmArmed])


    const setAlarm = useCallback(()=>{

        document.getElementById("paper").style.boxShadow = '0px 0px 100px 2px pink';  //set highlight background
        
        const alarm = new Date(time.year,time.month-1,time.day,time.hour-4,time.minute);  //month is zero indexed, sub 4 from hour bc global time
        
        setActiveAlarmTime(alarm);  //save alarm info in state variable

        if(alarmArmed)    //alarm state
        {
            alert('alarm already set');
        } 
        else
        {
            socket.emit('create-alarm', {
                alarm: alarm,
                user: sessionStorage.getItem('username')
            }, message =>{
                console.log(message); //whether connection was successful,  
            })

            setAlarmArmed(true);
        }
    })

    function cancelAlarm(){
        setAlarmArmed(false);

        socket.emit('cancel-alarm', {
            alarm:activeAlarmTime,
            user:sessionStorage.getItem('username')
        },message=>{
            console.log('cancel alarm was: ',message);
        })

        document.getElementById("paper").style.boxShadow = '0px 0px 0px 0px';  //set highlight background
    }
        
    //for user changing date
    function handleTime(time){
        const newTime = time.split(/[-T:]/);
        setTime({year:newTime[0],day:newTime[2],month:newTime[1],hour:newTime[3],minute:newTime[4]});
    }

    function getActiveAlarm(){
        //load active alarm from sessionstorage or database
        return new Date();
    }
    
    return(
        <Paper id="paper" className={classes.paper}>
        <form onChange={(event)=>handleTime(event.target.value)} className={classes.container} noValidate>
        <TextField
            id="datetime-local"
            label="Time"
            type="datetime-local"
            defaultValue={getActiveAlarm}
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
        <Button onClick={()=>cancelAlarm()} variant='outlined' style={{marginLeft:'5vh'}} className={classes.button} size="small">cancel</Button>
        </div>
        </Paper>
    )
}