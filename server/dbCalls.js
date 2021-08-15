//neo4j setup
const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
'bolt://localhost:7687',
neo4j.auth.basic('neo4j', '123')
)
const session = driver.session();



//create account
exports.createAccount = async function dbCreateAccount(username,password,email){
    const data = await session.readTransaction(txc => txc.run(`match (u:user {username:'${username}'}) return u`))
    .then(result=>{

        if(result.records.length !== 0){
            console.log('error');
            return 'error'
        }     
        else{
            const tempData = session.writeTransaction(txc=>txc.run(`create (u:user {username: '${username}',password: '${password}',email: '${email}',userId: '${createId()}'}) return u`))
            .then(result=>{
                console.log('successfully created account');
                const obj = {token:createToken(),username:username};
                return obj; 
            })
            return tempData;
        }
    }).catch((e)=>{
        console.log(e)
    })
    return data;
}

exports.signIn = async function dbSignIn(username,password){
    const data = await session.readTransaction(txc => txc.run(`match (u:user {username:'${username}'}) return u.password`))
    .then(result=>{
      if(result.records[0]){
        if(result.records[0]._fields[0] === password){
          console.log('successfully signed in');
          const obj = {token:createToken(),username:username};
          return obj;
        }     
        else{
          console.log('password incorrect');
          return '401';
        }
      }
      else{
        console.log('no user data found');
        return '404';
      }
    }).catch((e)=>{
        console.log(e);
        return 'error';
    })
    return data;
}




function createToken(){
    return Math.floor(Math.random() * 100000);
}

function createId(){
    return Math.floor(Math.random() * 100000);
}