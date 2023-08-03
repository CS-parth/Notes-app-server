const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/Notes-db";

const connectToMongo = async ()=>{
    try{
        await mongoose.connect(mongoURI);
        console.log("connection stablished");
    }catch(error){
        console.log(error);
    }
}

// const connectToMongo = ()=>{
//     mongoose.connect(mongoURI)
//     .then(()=>console.log("first"))
//     .catch((err)=>console.log(err))
// }

module.exports = connectToMongo;