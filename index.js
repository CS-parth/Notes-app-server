const  connectToMongo = require('./db')
const express = require('express');
const path = require('path');
const parser = require('body-parser');
// for running the server
connectToMongo();
const port = 8000;
const app = express();
//Middlewares
app.use(express.json());
// availaible routes
app.use("/api/auth", require('./routes/auth.js')); 
app.use("/api/notes", require('./routes/notes.js')); 

app.listen(port,()=>{
    console.log(`Listening the server at ${port} port`);
});