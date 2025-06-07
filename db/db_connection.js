const mongoose =require('mongoose')
require('dotenv').config();

const connectionString= process.env.connection_string

mongoose.connect(connectionString).then(res=>{
    console.log("mongoDB connected to wizzleServer");
    
}).catch(err=>{
    console.log("connection failed");
    console.log(err);
      
})

