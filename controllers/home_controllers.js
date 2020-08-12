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
    data = data.replace(/System.out/g, 'writer').replace(/  +/g, ' ');
    var a = data.indexOf("void",0);
    // to update the void functions
    while(a != -1){
        if(a == data.indexOf('void main(String[] args)')){
            var b = data.indexOf('{', a);
            var z = '\nwriter = new PrintWriter("the-file-name.txt", "UTF-8");\nwriter.println("entered Main function");';
            var updated = data.slice(0,b+1) + z + data.slice(b+1);
            data = updated;
            a = data.indexOf("void",b+1);
            // to add writer.close statement
            var indexOfCloseBracket = data.lastIndexOf('}', data.lastIndexOf('}')-2);
            data = data.slice(0, indexOfCloseBracket) + '\nwriter.close();\n' + data.slice(indexOfCloseBracket);
        }else{
            var b = data.indexOf('{', a);
            var z = '\nwriter.println("entered new function and code is added");';
            var updated = data.slice(0,b+1) + z + data.slice(b+1);
            data = updated;
            a = data.indexOf("void",b+1);
        }
        
    }
    // to add the import statement
    if(data.search('import java.io.*')==-1){
        var importStatement = 'import java.io.*;\n'
        data = importStatement + data.slice(0);
    }
    
    // to add printWriter
    var printWriterStatement = '\n    public static PrintWriter writer; \n';
    var indexOfPublicClassStatement = data.search('public class exp {');
    data = data.slice(0, indexOfPublicClassStatement+18) + printWriterStatement + data.slice(indexOfPublicClassStatement+19);


    console.log(data);
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
                    console.log("Error in executing the java file",err);
                    return;
                }
                console.log(stdout);
                console.log("File executed successfuly");
                fs.unlinkSync('exp.java');
                fs.unlinkSync('exp.class');
                
            });
        }
        
    });
}