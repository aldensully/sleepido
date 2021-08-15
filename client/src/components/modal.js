import {Paper, makeStyles, Button, TextField} from '@material-ui/core';
import { Typography, Theme } from '@material-ui/core';
import {React,useState, useContext, useEffect} from 'react';
import { SocketContext } from './socket';

const useStyles = makeStyles({
    root:{
        backdropFilter:'blur(3px)',
        height:'100vh',
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        position:'relative',
        zIndex:1
    },
    paper:{
        width:'70vh',
        height:'64vh',
        backgroundColor:'inherit',
        marginLeft:'0%',
        marginTop:'6vh',
        position:'relative',
    },
    dismissButton:{
        width:'90%',
        marginLeft:'5%',
        marginTop:'1vh',
        height:'15vh',
        backgroundColor:'#b6a3e3',
        '&:hover':{
            backgroundColor:'#c8b5f5'
        },
        color:'black',
    },
    sendButton:{
        backgroundColor:'#b6a3e3',
        width:'6vw',
        height:'3vw',
        fontSize:'1vw',
        borderRadius:0,
        '&:hover':{
            backgroundColor:'#c8b5f5'
        },
        border:'none'
    },
    button:{

    },
    topBar:{
        width:'100%',
        height:'4vh',
        backgroundColor:'#363a42',
        borderRadius:0,
        display:'flex',
    },
    topBarText:{
        fontSize:'1vw',
        padding:'0.5vw',
        color:'#bdbdbd'
    },
    chatbox:{
        backgroundColor:'#282c34',
        height:'55vh',
        width:'100%'
    },
    textfield:{
        width:'85%',
        height:'3vw',
        fontSize:'1vw',
        paddingLeft:'10px',
        backgroundColor:'#363a42',
        border:'none',
        color:'#bdbdbd'
    },
    bottomContainer:{
        display:'flex',
        flexDirection:'row',
        padding:0,
    },
    messagebox:{
        width:'fitcontent',
        height:'fit-content',
        backgroundColor:'#363a42'
    },
    messagetext:{
        color:'#bdbdbd'
    }
})

export default function Modal(props){
    const classes = useStyles();
    const [text,setText] = useState('');
    const partner = props.partner;
    const [dismissOpen,setDismissOpen] = useState(true);
    const [messageReceivedState,setMessageReceivedState] = useState(false);
    const [messageReceivedText,setMessageReceivedText] = useState();
    const socket = useContext(SocketContext);
    const [room,setRoom] = useState(props.room);


    useEffect(() => {
        socket.on('get-message', (message)=>{
            console.log('received message: ',message);
            setMessageReceivedText(message); 
            setMessageReceivedState(true);
        })
    }, [socket])


    function sendText(){
        socket.emit('send-message', sessionStorage.getItem('username'), text, room);   //when modal is closed this function is called
        setText('');
    }

    //props.setClose(text);  //raises state to 'dashboard'
    
    function dismiss(){
        setDismissOpen(false);
        props.stopAudio();
    }
    








    let dismissButton;
    if(dismissOpen){
        dismissButton = <Button variant='outlined' className={classes.dismissButton} onClick={()=>dismiss()}>
                        <Typography variant='h2'>Dismiss</Typography>
                        </Button>
    }
    let receivedMessage;
    if(messageReceivedState){
        receivedMessage = <div className={classes.messagebox}>
            <Typography className={classes.messagetext}>{messageReceivedText}</Typography>
        </div>
    }
    return(
        <Paper className={classes.paper} elevation={10}>
        
        <Paper className={classes.topBar}>
            <Typography className={classes.topBarText}>Chat - {partner}</Typography>
        </Paper>

        <div className={classes.chatbox}>
        {dismissButton}
        {receivedMessage}
        </div>

        <div className={classes.bottomContainer} >
            <input value={text} placeholder='Write a message..' autoFocus className={classes.textfield} onChange={e => setText(e.target.value)}></input>
        <button className={classes.sendButton} onClick={()=>sendText()}>Send</button>
        </div>
        </Paper>

    )
}
{/* <TextField className={classes.textbox}   inputProps={{style: {height:'1.5vw',margin:'0vh',fontSize:'2.5vh'}}}
variant='outlined' maxRows={4} margin="dense" multiline minRows={1} type='text' onChange={e => setText(e.target.value)}/> */}