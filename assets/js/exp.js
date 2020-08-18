// code for exp
var data = `class pair{
	int a;
	t b;
}`;
data = data.replace(/  +/g, ' ').replace(') {', "){").replace('> {', ">{").replace('< ',"<").replace(' >',">").replace('<', " <").replace("{", " {");
var words = data.split(" ");
var classes = {};
var i=0;
if(words[i]==="class"){
    classes.type = "class";
    i++;
    classes.name = words[i];
    var index = data.search(ans.name);
    if(data.indexOf("<", index) != -1 && data.indexOf("<", index) < data.indexOf("{", index)){
        classes.generic = "true";
    }else{
        classes.generic = "false";
    }
}
console.log(ans);
while(words[i] != "public"){
    i++;
}
i++;
if(words[i] == "class"){
    console.log("entred main class");
}

while(data[i] != "public" || data[i] != "static"){
    i++;
}


