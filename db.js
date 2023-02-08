const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://xyz:123@cluster09.s3qnfvf.mongodb.net/notebook?retryWrites=true&w=majority"

mongoose.set('strictQuery', true);

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;