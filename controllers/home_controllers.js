const fs = require('fs');
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
    fs.appendFile('mynewfile1.java', data, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}