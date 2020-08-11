const fs = require('fs');
const exec = require('child_process').exec;
module.exports.home = function(req, res){

    return res.render("home", {
        title : "hi babay",
        
    });
    
}

module.exports.submitCode = function(req, res){
        createFile(req.body.data1);
        if(req.xhr){
            return res.status(200).json({
                data : {
                    data : "this is empty data"
                },
                message : "data  is recieved by the server"
            });
        }
}

var createFile = function(data){
    fs.appendFile('exp.java', data, function (err) {
        if (err) throw err;
        console.log('Saved!');
        executeFile();
    });
}

var executeFile = function(){
    var firstCommand = "javac exp.java";
    exec(firstCommand, function(err, stdout, stderr){
        if(err){
            console.log("Error in compiling the java file", err);
            return;
        }else{
            console.log("compilation completed");
            var secondCommand = "java exp";
            exec(secondCommand, function(err, stdout, stderr){
                if(err){
                    console.log("Error in compiling the java file");
                    return;
                }
                console.log(stdout);
                console.log("File executed successfuly");
            });
        }
        
    });
}