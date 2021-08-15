import { io } from "socket.io-client";
import {createContext} from 'react';
export const socket = io('http://localhost:5001', {
            withCredentials: true,
            transportOptions:{
                polling:{
                    extraHeaders: {
                        "my-custom-header":"abcd"
                    }
                }
            }
        });
export const SocketContext = createContext();




// import { io } from "socket.io-client";
// import Dashboard from "./dashboard";

// class SocketClass{
//     constructor(){
//         this.socket = io('http://localhost:5001', {
//             withCredentials: true,
//             transportOptions:{
//                 polling:{
//                     extraHeaders: {
//                         "my-custom-header":"abcd"
//                     }
//                 }
//             }
//         });
//         this.outgoingMessage = '';
//         this.incomingMessage = '';
//         this.room = '';   //the other clients socketId. should prob change this to a custom room id 
//         this.alarmState = false;
//         this.received = false;
//         this.sent = false;
//     }
//     connect(){
//         this.socket.on("connect", ()=>{
//             console.log("client socket id: ",this.socket.id);
//         })
//         this.socket.emit('auth', {
//             user:sessionStorage.getItem('username'),
//             token:sessionStorage.getItem('token')
//         });
//     }

//     createAlarm(alarm){
//         this.socket.emit('create-alarm', {
//             alarm: alarm,
//             user: sessionStorage.getItem('username')
//         }, message =>{
//             console.log(message); //whether connection was successful,  
//         })
//     }

//     sendMessage(message, room){
//         try{
//             this.socket.emit('send-message', message, room); //send message to other user
//             this.sent = true;
//         }
//         catch(e){
//             alert(e.message);
//         }
        
//     }

//     getSocket(){
//         return this.socket;
//     }
//     setOutgoingMessage(message){
//         this.outgoingMessage = message;
//     }
//     getOutgoingMessage(){
//         return this.outgoingMessage;
//     }
//     getIncomingMessage(){
//         return this.incomingMessage;
//     }
//     getAlarmState(){
//         return this.alarmState;
//     }
//     setAlarmState(state){
//         this.alarmState = state;
//     }


// }
// const Socket = new SocketClass();
// export default Socket;