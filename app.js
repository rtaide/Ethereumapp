const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const transaction = require("./routes/routes");

app.use(express.urlencoded({extended:true}));

app.use(express.json({ limit: "50mb" }));

app.use(transaction);

mongoose.connect('mongodb://localhost:27017/ethereumapp',{
    useNewUrlParser:true,
    //useCreateIndex:true,                 
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connected")
}).catch(err=>{
    console.log("err0r while connecting")
})

app.listen(3000, () => {
    console.log("Listening on port 3000 " );
});