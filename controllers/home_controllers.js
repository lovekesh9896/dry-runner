// var result = text.match(new RegExp(number + '\\s(\\w+)'))[1];

const fs = require('fs');
const child = require('child_process');
module.exports.home = function(req, res){

    return res.render("home", {
        title : "hi babay",
        
    });
    
}

module.exports.submitCode = function(req, res){
        createFile(req.body.data1, req.body.customInput);
        if(req.xhr){
            return res.status(200).json({
                data : {
                    data : "this is empty data"
                },
                message : "data  is recieved by the server"
            });
        }
}
var functionNames = [];
var dicType = ["int" , "String" , "boolean" ,"void", "int[]"];
var extractClassNames = function(data){
    var a = data.indexOf('class');
    while(a != -1){
        var b;
        if(data.indexOf('<', a) != -1 && data.indexOf("<",a) < data.indexOf("{",a)){
            b = data.indexOf('<', a);
        }else{
            b = data.indexOf("{", a);
        }
        var name = data.slice(a+6, b).trim();
        if(name=="exp"){
            a = data.indexOf('class', b);
        }else{
            dicType.push(name);
            a = data.indexOf('class', b);
        }
        
    }
    console.log("line 40",dicType);
}

var extractFunctionNames = function(data){
    funclers wrrvwrv ervtv

    for(let i=0;i<dicType.length;i++){
        var toSearch = dicType[i];
        var a = data.indexOf(" "+toSearch);
        while(a != -1){
            console.log("a == ",a);
            console.log("line 53", data.indexOf("(",a), data.indexOf(";",a));
            if(data.indexOf("(",a) != -1 && data.indexOf("(",a) < data.indexOf(";",a) && data.indexOf("(",a) < data.indexOf("{",a)){
                var varCount = data.slice(data.indexOf("(",a), data.indexOf(")",a)).split(",").length;
                var tempData = data.slice(a+toSearch.length+1, data.indexOf("(",a)).trim();
                console.log("lien 55",tempData);
                console.log(toSearch);
                var name = {};
                name.name = tempData;
                name.type = toSearch;
                name.varCount = varCount;
                functionNames.push(name);
            }
            a = data.indexOf(" "+toSearch,a+1);
        }
    }
    console.log("line 68",functionNames);
}

var addFunctionComments = function(data){
    for(let i=0;i<functionNames.length;i++){
        var name = functionNames[i];
        var toSearch = name.name;
        var type = name.type;
        var a;
        var z = "";
        if(type == "void"){
            z = " ";
        }else{
            z = "return ";
            
        }
        a = data.indexOf(z+toSearch);
        while(a != -1 ){
            if(a == data.indexOf("void " + toSearch)+4){
                a = data.indexOf(z+toSearch, a+toSearch.length);
                continue;
            }
            if(data.indexOf(";",a) != -1 && data.indexOf(";",a) < data.indexOf("}",a)){
                var line = 'writer.println("Entered ' + toSearch + '");';
                
                data = data.slice(0,a) + line + data.slice(a);
            }
            a = data.indexOf(z+toSearch, a+line.length+1+toSearch.length);
        }
    }
    return data;
}

var createFile = function(data, customInput){
    
    data = data.replace(/System.out/g, 'writer').replace(/  +/g, ' ').replace(" {", "{");
    extractClassNames(data);
    extractFunctionNames(data);
    data = addFunctionComments(data);
    // to add throws error statement
    var a = data.indexOf('String[] args');
    var b = data.indexOf(')', a);
    var line = " throws FileNotFoundException, UnsupportedEncodingException";
    data = data.slice(0,b+1) + line + data.slice(b+1);
    b = data.indexOf('{',a);
    var z = '\nwriter = new PrintWriter("the-file-name.txt", "UTF-8");\nwriter.println("entered Main function");';
    data = data.slice(0,b+1) + z + data.slice(b+1);
    // to add writer.close statement
    var indexOfCloseBracket = data.lastIndexOf('}', data.lastIndexOf('}')-2);
    data = data.slice(0, indexOfCloseBracket) + '\nwriter.close();\n' + data.slice(indexOfCloseBracket);
    // to add the import statement
    if(data.search('import java.io.*')==-1){
        var importStatement = 'import java.io.*;\n'
        data = importStatement + data.slice(0);
    }

    // to add printWriter
    var printWriterStatement = '\n    public static PrintWriter writer; \n';
    var indexOfPublicClassStatement = data.search('public class exp{');
    data = data.slice(0, indexOfPublicClassStatement+18) + printWriterStatement + data.slice(indexOfPublicClassStatement+19);

    fs.writeFile('exp.java', data, function(err){
        if(err){
            console.log(err);
            return;
        }
        executeFile(customInput);
    });
}

var executeFile = function(customInput){
    var firstCommand = child.spawnSync('javac', ['exp.java']);
    console.log(String(firstCommand.stderr));
    var secondCommand = child.spawnSync('java', ['exp'], {input: customInput});
    console.log(firstCommand.status, secondCommand.status);
    // fs.unlinkSync('exp.java');
    // fs.unlinkSync('exp.class');
}
