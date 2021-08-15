const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({
  extended: true,
  limit:'50mb'
}))
const Server = require('./serverSocket');
Server.connect();

const dbCalls = require('./dbCalls');
const dbCreateAccount = dbCalls.createAccount;
const dbSignIn = dbCalls.signIn;



function begin(){
  function checkTime()
  {
    const t = new Date();
    t.setSeconds(0);
    t.setMilliseconds(0);
    console.log(t);
  }
  setInterval(checkTime,5000);
}





  
//create account
app.post('/createaccount', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const data = await dbCreateAccount(username,password,email);
  console.log('returned : ',data);
  res.send(data);
});

//sign in
app.post('/signin', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const data = await dbSignIn(username,password);
  console.log('returned: ',data);
  res.send(data);
});


app.listen(5000, () => console.log('Server is running on http://localhost:5000'));