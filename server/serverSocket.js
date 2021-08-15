const { Socket } = require('dgram');

class ServerSocket{
    constructor(){
        this.server = require('http').createServer();
        this.io = require('socket.io')(this.server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
                allowedHeaders: ["my-custom-header"],
                credentials: true
            }
        });
        this.userTokens = {};  //keep track of current logged in users( should be in database ideally)
        this.server.listen(5001, ()=>{console.log('socket listening on port 5001')});
        this.pendingAlarms = [];
    }

    connect(){
        this.io.on('connection', (socket) => {
            
            //authenticate user token and socket
            socket.on('auth' ,(data)=>{
                
                if(data.user in this.userTokens){   //user has not changed login sessions, likely just refreshed the page
                    console.log('found user');
                    if(this.userTokens[data.user].token === data.token){ //token is the client token given after login
                        this.userTokens[data.user].socketId = socket.id;   //update socket id
                        this.userTokens[data.user].socket = socket;
                    }
                    else{  //when user logs in again, the token will be different
                        console.log('token has changed');
                        this.userTokens[data.user].token = data.token;    
                        this.userTokens[data.user].socketId = socket.id;
                        this.userTokens[data.user].socket = socket;
                    }
                }
                else{   //new user
                    console.log('creating user');    
                    this.userTokens[data.user] = {token:data.token,socketId:socket.id,socket:socket};
                }
            })

            //client submits alarm
            socket.on('create-alarm', (data, cb)=>{
                const match = this.findMatchingAlarm(data.alarm, data.user);  //search for matching alarm
                if(!match) this.createAlarm(data.alarm,data.user);
                cb(`alarm set, match: ${match}`); //callback function
            })

            socket.on('cancel-alarm',(data,cb)=>{
                const result = this.cancelAlarm(data.alarm, data.user);   //alarm time and username
                cb(result);  //callback function 
            })

            socket.on('send-message',(user,message,room)=>{
                if(room !== ''){
                    socket.to(room).emit('get-message',message,user);
                }
                else{
                    console.log('room is empty!');
                }
            })
        });
    }

    //searches for a matching alarm, if found it pushes the users name, otherwise returns false
    findMatchingAlarm(alarm, user){   
        for (let i = 0; i < this.pendingAlarms.length; i++) {
            if(this.pendingAlarms[i].alarm === alarm && this.pendingAlarms[i].users.length<2)
            {
                console.log('found matching user!');
                this.pendingAlarms[i].users.push(user);
                return true;
            }
        }
        return false;
    }

    //create alarm
    createAlarm(alarm,user){  //user is just username
        const alarmId = this.createAlarmId();  //alarm id will tell us which alarm it is that needs to be called 
        this.pendingAlarms.push({alarm:alarm,users:[user],alarmId:alarmId});  //match not found, create new pending alarm with id
        const now = new Date();
        now.setHours(now.getHours()-4);
        const newAlarm = new Date(alarm); //alarm object has 'expired' sorta, a new one needs to be created with the same time
        const diff = newAlarm.getTime() - now.getTime();
        console.log('time set: ',newAlarm,'time now: ',now);
        console.log('alarm will go off in: ',diff);

        var that = this;
        setTimeout(function(){
            that.alarmTrigger(alarmId);
        },diff);
    }

    //cancel alarm
    cancelAlarm(alarm,user){
        for (let i = 0; i < this.pendingAlarms.length; i++) {

            const currentAlarm = this.pendingAlarms[i];

            if(currentAlarm.alarm === alarm && currentAlarm.users.includes(user)){

                //if they were the only user with this alarm then the entire alarm should be removed, 
                //otherwise only their name should be removed from the alarm

                if(currentAlarm.users.length === 1)
                {
                    console.log('removing alarm: ',currentAlarm.alarmId);
                    this.pendingAlarms.splice(i,1); //remove the entire alarm because this user was the only one
                }
                else if(currentAlarm.users.length === 2)
                {
                    console.log(`removing user ${user} from alarm ${currentAlarm.alarmId}`);

                    const userIndex = currentAlarm.users.indexOf(user);
                    currentAlarm.users.splice(userIndex,1);   //remove only the user from the alarm
                }
                return 'success'
            }
        }
        return 'unsuccessful'
    }
    createAlarmId(){
        return Math.floor(Math.random() * 100000);
    }

    alarmTrigger(id){

        console.log('alarm has fired');
        for (let i = 0; i < this.pendingAlarms.length; i++) {

            const element = this.pendingAlarms[i];

            if(element.alarmId === id){   //this is the alarm object that has gone off

                switch(element.users.length){

                    case 0:
                        console.log('no users with this alarm');
                        break;

                    case 1:
                        console.log('found only one user: ',this.userTokens[element.users[0]].socketId);
                        const sock = this.userTokens[element.users[0]].socket;
                        sock.emit('foo','alarm has gone off');
                        //handle when only one user is left in the alarm
                        break;

                    case 2:
                        console.log(`connecting users ${element.users[0]} and ${element.users[1]}`);
                        const sock1 = this.userTokens[element.users[0]].socket;
                        const sock2 = this.userTokens[element.users[1]].socket;
                        const roomId1 = this.userTokens[element.users[0]].socketId;
                        const roomId2 = this.userTokens[element.users[1]].socketId;

                        sock1.emit('triggered',roomId2);
                        sock2.emit('triggered',roomId1);
                        break;

                    default:
                        break;
                }


            }           
        }
    }

}
const Server = new ServerSocket();
module.exports = Server;