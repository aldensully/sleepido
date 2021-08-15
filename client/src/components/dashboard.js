import {React,useState,useEffect, Component, useContext} from 'react';
import { CssBaseline,makeStyles, withStyles } from '@material-ui/core';
import AppBar from './appbar';
import Alarm from './alarm'; //old alarm
import NewAlarm from './newAlarm'; //new alarm
import {Button} from '@material-ui/core';
import Modal from './modal';
import boom from '../audio/snd.mp3';   //sound
import { SocketContext } from './socket';


const useStyles = makeStyles({
    root:{
        // background:'linear-gradient(180deg, #cebff5 30%, #8c79bd 90%)',
        background:'#1a1c21',
        height:'100vh',
        width:'100%',
        display:'flex',
        position:'absolute',
        flexDirection:'column',
        zIndex:0
    },
    column:{
        marginTop:'5vh',
        marginLeft:'30%'
    },
    addButton:{
        marginLeft:'15%', 
        borderRadius:'5px',
        backgroundColor:"white",
        opacity:0.9,
    }
})


//right now most of the data about the connection and message passing lives 
//in the parent component which is this dashboard, so even though the typing 
//and viewing of messages happens in the modal the data lives mostly in this component
export default function Dashboard(props) {
    const classes = useStyles();
    const [open,setOpen] = useState(false);
    const [room,setRoom] = useState();
    const [alarmArmed,setAlarmArmed] = useState(false); 
    const [partner,setPartner] = useState();
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.emit('auth', {    
            user:sessionStorage.getItem('username'),
            token:sessionStorage.getItem('token')
        });
        socket.on('triggered', (room)=>{
            setRoom(room);
            alarmTriggered();
        })
    }, [socket])



    //handling play/pause
    function alarmTriggered(){
        setOpen(true); //this opens the modal 
        document.getElementById('audio').play();
    }
    function closeModal(){
        //socket.emit('send-message', sessionStorage.getItem('username'), text, room);   //when modal is closed this function is called
        setOpen(false)
    }
    
    function stopAudio(){
        document.getElementById('audio').pause();
        document.getElementById('audio').currentTime = 0;
        //socket.setAlarmState(false); //turn alarmState off
    }


    //for rendering modal
    let dialog;
    if(open){
        dialog = <Modal room={room} setClose={closeModal} stopAudio={stopAudio}/>; 
    } else{
        dialog = null;
    }

    return(
        <CssBaseline>
            <div className={classes.root}>
                <AppBar/>
                <audio id='audio' src={boom}/>  
                <div className={classes.column}>
                <NewAlarm alarmState={alarmArmed} setOnTriggered={alarmTriggered}/>
                {dialog}
                </div>
            </div>
        </CssBaseline>
    )
}
