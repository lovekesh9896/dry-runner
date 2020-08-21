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
        console.log("////////////////////////////////////////////////////////");
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
var indexes = [];
var extractFunctionNames = function(data){
    for(let i=0;i<dicType.length;i++){
        var toSearch = " "+dicType[i]+" ";
        var a = data.indexOf(toSearch);
        while(a != -1){
            var line ="";
            if(data.indexOf("(",a) != -1 && data.indexOf("(",a) < data.indexOf(";",a) && data.indexOf("(",a) < data.indexOf("{",a) && data.indexOf("(",a) < data.indexOf("=",a)){
                var vars = data.slice(data.indexOf("(",a)+1, data.indexOf(")",a)).split(",");
                var tempData = data.slice(a+toSearch.length, data.indexOf("(",a)).trim();
                var name = {};
                    name.name = tempData;
                    name.type = toSearch;
                    name.varCount = vars.length;
                    functionNames.push(name);
                var b = data.indexOf("{",a);
                line = 'System.out.println("Entered ' + tempData + '"+" " ';
                for(let j=0;j<vars.length;j++){
                    var z = vars[j].trim().split(" ");
                    if(z[1].indexOf('[]') != -1){
                        z[1] = z[1].replace("[]","");
                        z[1] = "Arrays.toString(" + z[1]+ ")";
                    }
                    line = line +'+(' +  z[1] + ')+" "';
                }
                line = line + ');'
                
                data = data.slice(0,b+1) + line + data.slice(b+1);
                indexes.push(a);
                a = data.indexOf(toSearch,a+line.length+1);
            }else{
                a = data.indexOf(toSearch,a+1);
            }
            
        }
    }

    console.log("line 87",functionNames);
    return data;
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
                var varCount = data.slice(data.indexOf("(",a), data.indexOf(")",a)).split(",");
                console.log(varCount);
                var line = 'System.out.println("Entered ' +
                        toSearch;
                        
                for(let j=0;j<varCount.length;j++){
                    line = line +' "+(' +  varCount[i] + ')';
                }
                line = line + '));';

                        
                
                data = data.slice(0,a) + line + data.slice(a);
            }
            a = data.indexOf(z+toSearch, a+line.length+1+toSearch.length);
        }
    }
    for(let i=0;i<functionNames.length;i++){
        var name = functionNames[i];
        var toSearch = name.name;
        var z = " = ";
        var a = data.indexOf(z+toSearch);
        while(a != -1){
            var varCount = data.slice(data.indexOf("(",a)+1, data.indexOf(")",a)).split(",");
            console.log(varCount);
            var line = 'System.out.println("Entered ' +
                        toSearch + 
                        ' "+(';
                for(let j=0;j<varCount.length;j++){
                    line = line + varCount[i]+ " ";
                }
                line = line + '));';

            var b = a;
            var c = 5;
            while(data.charAt(b) != '}' && data.charAt(b) != ';'){
                b--;
            }
            data = data.slice(0,b+1) + line + data.slice(b+1);
            a = data.indexOf(z+toSearch, a+line.length+1+toSearch.length);

        }
    }
    return data;
}

var closing = function(data){
    var c = 0;
    var arr = [];
    for(let i=0;i<indexes.length-1;i++){
        let a = indexes[i+1]+c;
        let b = data.indexOf("return",indexes[i]+c);

        while(b < a && b != -1){
            let line = 'System.out.println("exit ' + functionNames[i].name + '");';
            console.log(line);
            data = data.slice(0,b) + line + data.slice(b);
            b = data.indexOf("return", b+line.length +1);
            c += line.length;
            a += line.length;
        }
        
    }
    
    return data;
}

var createFile = function(data, customInput){
    // .replace(/System.out/g, 'writer')
    data = data.replace(/  +/g, ' ').replace(" {", "{").replace(" (","(");
    extractClassNames(data);
    console.log("extract classes done");
    data = extractFunctionNames(data);
    console.log("extract function done");

    data = closing(data);
    console.log("closing done",data);
    
    // data = addFunctionComments(data);
    // to add throws error statement
    // var a = data.indexOf('String[] args');
    // var b = data.indexOf(')', a);
    // var line = " throws FileNotFoundException, UnsupportedEncodingException";
    // data = data.slice(0,b+1) + line + data.slice(b+1);
    // b = data.indexOf('{',a);
    // var z = '\nwriter = new PrintWriter("the-file-name.txt", "UTF-8");';
    // data = data.slice(0,b+1) + z + data.slice(b+1);
    // to add writer.close statement
    var indexOfCloseBracket = data.lastIndexOf('}', data.lastIndexOf('}')-2);
    data = data.slice(0, indexOfCloseBracket) + '\System.out.println("exit main");\n' + data.slice(indexOfCloseBracket);
    // to add the import statement
    // if(data.search('import java.io.*')==-1){
    //     var importStatement = 'import java.io.*;\nimport java.util.*;\n'
    //     data = importStatement + data.slice(0);
    // }

    // to add printWriter
    // var printWriterStatement = '\n    public static PrintWriter writer; \n';
    // var indexOfPublicClassStatement = data.search('public class exp{');
    // data = data.slice(0, indexOfPublicClassStatement+18) + printWriterStatement + data.slice(indexOfPublicClassStatement+19);
    console.log("line 179", indexes);
    fs.writeFile('exp.java', data, function(err){
        if(err){
            console.log("error from line 151",err);
            return;
        }
        executeFile(customInput);
    });
}

var executeFile = function(customInput){
    var firstCommand = child.spawnSync('javac', ['exp.java']);
    console.log(String(firstCommand.stderr));
    if(firstCommand.status == 0){
        var secondCommand = child.spawnSync('java', ['exp'], {input: customInput});
        if(secondCommand.status == 0){
            var json = String(secondCommand.stdout);
            createJson(json);
            console.log("all done");
            fs.unlinkSync('exp.java');
            fs.unlinkSync('exp.class');

        }else{
            console.log(String(secondCommand.stderr));
            return;
        }
        
        
    }else{
        console.log(String(firstCommand.stderr));
        return;
    }
    
}

var createJson = function(data){
    console.log(data);
}
