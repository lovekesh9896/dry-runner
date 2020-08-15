const express = require('express'); // runnig our app on express
const path = require('path');
const app = express();
const port = 8000;
const fs = require('fs');
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({extended : false}));

app.use(express.static(__dirname + "/assets"));

app.use('/', require('./routes')); // telling app to use routes


app.listen(port, function(err){
    if(err){
        console.log("Error in starting the server",err);
        return;
    }
    console.log("App is started on port ",port);
});