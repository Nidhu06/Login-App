
const express = require("express");
const app = express(); //initialize express
const bodyParser = require("body-parser"); //body parsing middleware
const mongodb = require("mongodb"); //MongoDB driver
const accessToUser = require('./routes/user'); 
const accessToAdmin = require('./routes/admin');     
const verification = require('./routes/verification');
const mongoClient = mongodb.MongoClient;
require('dotenv').config()
app.use(bodyParser.json());

const url = "mongodb+srv://Nidhu06:Munn@0631@cluster0.ld8wh.mongodb.net/loginapp?retryWrites=true&w=majority";

mongoClient.connect(
    url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err, db) => {
        if(err) throw err;
        console.log("Database Connected!");
        db.close();
    }
);

app.use('/', verification);
app.use('/admin', accessToAdmin,accessToUser);
app.use('/user', accessToUser);

let port = process.env.PORT || 3000;

app.listen(port, console.log("Server is live 🙌"));