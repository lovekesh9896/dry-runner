const fs = require("fs"); // for saving java file
const child = require("child_process"); // for executing java code
const { v4: uuidv4 } = require("uuid");
// used to execute java file before any chnge is made
// using spawnsync because we don't want to execute exp.class before creation
let executeFileBefore = function (customInput) {
	let firstCommand = child.spawnSync("javac", ["exp.java"]);
	if (firstCommand.status == 0) {
		let secondCommand = child.spawnSync("java", ["exp"], {
			input: customInput,
		});
		if (secondCommand.status == 0) {
			console.log("all done before");
			return "200";
		} else {
			console.log(
				"error in second command",
				String(secondCommand.stderr)
			);
			return String(secondCommand.stderr);
		}
	} else {
		console.log("error in first command", String(firstCommand.stderr));
		return String(firstCommand.stderr);
	}
};

// checks file before any change is made to check that code entred by user is
// correct or not. First function that will be executed
let fileCheckBefore = function (javaCode, codeInput) {
	console.log(codeInput);
	let javaFile = fs.writeFileSync("exp.java", javaCode); // write java file
	let executeFileStatus = executeFileBefore(codeInput); // execute java file
	return executeFileStatus;
};

let executeFileAfter = function (customInput) {
	let firstCommand = child.spawnSync("javac", ["exp.java"]);
	if (firstCommand.status == 0) {
		let secondCommand = child.spawnSync("java", ["exp"], {
			input: customInput,
		});
		if (secondCommand.status == 0) {
			let json = String(secondCommand.stdout);
			console.log("line 37", json);
			let ans = createJson(json);
			// console.log(ans);
			console.log("all done after");
			// fs.unlinkSync('exp.java');
			fs.unlinkSync("exp.class");
			return ans;
		} else {
			console.log(
				"error in second command",
				String(secondCommand.stderr)
			);
			return String(secondCommand.stderr);
		}
	} else {
		console.log("error in first command", String(firstCommand.stderr));
		return String(firstCommand.stderr);
	}
};

// this function try to makes the code linear by reducing extra gaps, and calling
// other similar function that will update user original code
var addExtraPrintStatement = function (
	javaCode,
	functionNames,
	dicType,
	indexes
) {
	console.log("addExtraPrintStatement started");
	javaCode = javaCode
		.replace(/  +/g, " ")
		.replace(" {", "{")
		.replace(" (", "(");
	// extractClassNames(javaCode, dicType);
	// console.log("extract classes done");
	javaCode = extractFunctionNames(javaCode, functionNames, dicType, indexes);
	console.log("extract function done", javaCode);

	javaCode = addFunctionEndPrintStatement(javaCode, functionNames, indexes);

	// to add writer.close statement
	var indexOfCloseBracket = javaCode.lastIndexOf(
		"}",
		javaCode.lastIndexOf("}") - 2
	);
	javaCode =
		javaCode.slice(0, indexOfCloseBracket) +
		'System.out.println("exit main");\n' +
		javaCode.slice(indexOfCloseBracket);

	console.log("addExtraPrintStatement ended", javaCode);

	return javaCode;
};

// first function to call after user original code is checked for errors
// main logic starts from here
let startChangingAfter = function (javaCode, codeInput) {
	console.log("startChangingAfter started");
	// creating variables to store data types and function names
	let functionNames = [];
	let dicType = ["int", "String", "boolean", "void", "int[]"];
	let indexes = [];
	console.log("javacode till here is same");
	// updating the user code
	javaCode = addExtraPrintStatement(
		javaCode,
		functionNames,
		dicType,
		indexes
	);
	console.log("startchangingafter javacode", javaCode);

	let CreateFileAfter = fs.writeFileSync("exp.java", javaCode);
	var ans = executeFileAfter(codeInput);
	console.log("startChangingAfter ended");

	return ans;
	// console.log("ans from line 82",ans);
	// console.log("ans for line 196",ans);
};

module.exports.home = function (req, res) {
	return res.render("home", {
		title: "Dry Runner",
	});
};

module.exports.submitCode = function (req, res) {
	// checking the code for errors
	console.log("request recieved");
	// extractFunctionNames(req.body.data1);
	// let checkFile = fileCheckBefore(req.body.data1, req.body.customInput);
	// console.log(checkFile);
	// checkFile == 200
	if (true) {
		// if code without changes is correct
		// changing code
		let ans = startChangingAfter(req.body.data1, req.body.customInput);
		console.log("b", ans);
		return res.status(200).json({
			data: JSON.parse(ans),
			meaasge: "success",
		});
	} else {
		// code is invalid
		return res.status(200).json({
			data: checkFile,
			meaasge: "Error in Code",
		});
	}
};

var extractClassNames = function (data, dicType) {
	var a = data.indexOf("class");
	while (a != -1) {
		var b;
		if (
			data.indexOf("<", a) != -1 &&
			data.indexOf("<", a) < data.indexOf("{", a)
		) {
			b = data.indexOf("<", a);
		} else {
			b = data.indexOf("{", a);
		}
		var name = data.slice(a + 6, b).trim();
		if (name == "exp") {
			a = data.indexOf("class", b);
		} else {
			dicType.push(name);
			a = data.indexOf("class", b);
		}
	}
	console.log("line 40", dicType);
};

// program to implement stack data structure
class Stack {
	constructor() {
		this.items = [];
	}

	// add element to the stack
	push(element) {
		return this.items.push(element);
	}

	// remove element from the stack
	remove() {
		if (this.items.length > 0) {
			return this.items.pop();
		}
	}

	// view the last element
	peek() {
		return this.items[this.items.length - 1];
	}

	// check if the stack is empty
	isEmpty() {
		return this.items.length == 0;
	}

	// the size of the stack
	size() {
		return this.items.length;
	}

	// empty the stack
	clear() {
		this.items = [];
	}
}
let dict = [];
function addStatementInOneFunction(data, type, args) {
	let functionName = type.split(" ")[1];
	let returnType = type.split(" ")[0];
	let uuid = "";
	dict.push({
		key: uuid,
		value: functionName,
	});
	let printEnterStatement = "";
	let printArgs = `System.out.println();System.out.println("IN ${functionName} ${uuid} "+`;
	for (let i of args) {
		printArgs += i.split(" ")[1] + '+ " "+';
	}
	printArgs = printArgs.substring(0, printArgs.length - 1);
	printArgs += ");";
	let printExitSatement = `System.out.println("Exit ${functionName} ${uuid}");`;
	let stack = new Stack();
	let index = data.indexOf(type + "(");
	let firstIndexOfOpenBrac = data.indexOf("{", index + type.length);
	data =
		data.slice(0, firstIndexOfOpenBrac + 1) +
		printEnterStatement +
		printArgs +
		data.slice(firstIndexOfOpenBrac + 1);
	index = firstIndexOfOpenBrac;
	stack.push("{");
	index++;
	let word = "";
	let prev = index;
	while (!stack.isEmpty()) {
		let char = data.charAt(index);
		if (char == "{") {
			stack.push("{");
		} else if (char == "}") {
			stack.remove();
		} else if (char == " ") {
			if (word == "return") {
				data =
					data.slice(0, index - 7) +
					printExitSatement +
					data.slice(index - 7);
				index = index + printExitSatement.length;
			}
			prev = index;
			word = "";
		} else {
			word += char;
		}
		index++;
	}
	return data;
}

function printFunctionArgs(functionNamesSet, data) {
	console.log("printFunctionArgs started");
	for (let item of functionNamesSet) {
		let indexOfItem = data.indexOf(item);
		let indexOfOpenBrac = data.indexOf("(", indexOfItem);
		let indexOfCloseBrac = data.indexOf(")", indexOfItem);
		let argsStr = data.substring(indexOfOpenBrac + 1, indexOfCloseBrac);
		let arr = argsStr
			.split(",")
			.map(Function.prototype.call, String.prototype.trim);
		data = addStatementInOneFunction(data, item, arr);
	}
	console.log("data from printFunctionArgs", data);
	console.log(
		"printFunctionArgs ended, javacode containes all the statements here"
	);

	return data;
	// fs.writeFileSync("exp.java", data);
}

var extractFunctionNames = function (data, functionNames, dicType, indexes) {
	console.log("extractFunctionNames started");
	let reservedWords = [
		"abstract",
		"assert",
		"boolean",
		"break",
		"byte",
		"case",
		"catch",
		"char",
		"class",
		"const",
		"default",
		"do",
		"double",
		"else",
		"enum",
		"extends",
		"false",
		"final",
		"finally",
		"float",
		"for",
		"goto",
		"if",
		"implements",
		"import",
		"instanceof",
		"int",
		"interface",
		"long",
		"native",
		"new",
		"null",
		"package",
		"private",
		"protected",
		"public",
		"return",
		"short",
		"static",
		"strictfp",
		"super",
		"switch",
		"synchronized",
		"this",
		"throw",
		"throws",
		"transient",
		"true",
		"try",
		"void",
		"volatile",
		"while",
		"continue",
		"if",
		"for",
		"while",
		"else if",
	];
	data = data
		.replace(/  +/g, " ")
		.replace(/\t/g, " ")
		.replace(/}/g, "} ")
		.replace(/ \(/g, "(");
	let otherSymbols = ["(", " ", ")", ";", "="];

	function searchCharInSymbols(name) {
		for (let i in otherSymbols) {
			if (name.indexOf(otherSymbols[i]) != -1) {
				return false;
			}
		}
		return true;
	}
	const arr = new Set();
	const type = new Set();
	let index = data.indexOf("(");
	while (index != -1) {
		let indexOfSpace = data.lastIndexOf(" ", index);
		let indexOfDot = data.lastIndexOf(".", index);
		let indexOfColon = data.lastIndexOf(";", index);
		if (indexOfSpace > indexOfDot && indexOfSpace > indexOfColon) {
			let functionName = data.substring(indexOfSpace + 1, index).trim();
			let indexOfReturnType = data.lastIndexOf(" ", indexOfSpace - 1) + 1;
			let returnType = data.substring(indexOfReturnType, indexOfSpace);
			let indexOfNextColon = data.indexOf(";", index);
			let indexOfNextOpenCurlBrac = data.indexOf("{", index);

			if (
				!reservedWords.includes(functionName) &&
				searchCharInSymbols(functionName.trim()) &&
				searchCharInSymbols(returnType.trim()) &&
				data.charAt(indexOfReturnType - 2) != "=" &&
				indexOfNextOpenCurlBrac < indexOfNextColon
			) {
				arr.add(`${returnType} ${functionName.trim()}`);
			}
		}
		index = data.indexOf("(", index + 1);
	}
	console.log(arr, "javacode till jhere is same");
	data = printFunctionArgs(arr, data);
	// console.log("line 87", functionNames);
	console.log("extractFunctionNames ended", data);

	return data;
};

// var addFunctionComments = function(data){
//     for(let i=0;i<functionNames.length;i++){
//         var name = functionNames[i];
//         var toSearch = name.name;
//         var type = name.type;
//         var a;
//         var z = "";
//         if(type == "void"){
//             z = " ";
//         }else{
//             z = "return ";

//         }
//         a = data.indexOf(z+toSearch);
//         while(a != -1 ){
//             if(a == data.indexOf("void " + toSearch)+4){
//                 a = data.indexOf(z+toSearch, a+toSearch.length);
//                 continue;
//             }
//             if(data.indexOf(";",a) != -1 && data.indexOf(";",a) < data.indexOf("}",a)){
//                 var varCount = data.slice(data.indexOf("(",a), data.indexOf(")",a)).split(",");
//                 console.log(varCount);
//                 var line = 'System.out.println("Entered ' +
//                         toSearch;

//                 for(let j=0;j<varCount.length;j++){
//                     line = line +' "+(' +  varCount[i] + ')';
//                 }
//                 line = line + '));';

//                 data = data.slice(0,a) + line + data.slice(a);
//             }
//             a = data.indexOf(z+toSearch, a+line.length+1+toSearch.length);
//         }
//     }
//     for(let i=0;i<functionNames.length;i++){
//         var name = functionNames[i];
//         var toSearch = name.name;
//         var z = " = ";
//         var a = data.indexOf(z+toSearch);
//         while(a != -1){
//             var varCount = data.slice(data.indexOf("(",a)+1, data.indexOf(")",a)).split(",");
//             console.log(varCount);
//             var line = 'System.out.println("Entered ' +
//                         toSearch +
//                         ' "+(';
//                 for(let j=0;j<varCount.length;j++){
//                     line = line + varCount[i]+ " ";
//                 }
//                 line = line + '));';

//             var b = a;
//             var c = 5;
//             while(data.charAt(b) != '}' && data.charAt(b) != ';'){
//                 b--;
//             }
//             data = data.slice(0,b+1) + line + data.slice(b+1);
//             a = data.indexOf(z+toSearch, a+line.length+1+toSearch.length);

//         }
//     }
//     return data;
// }

var addFunctionEndPrintStatement = function (data, functionNames, indexes) {
	var c = 0;
	console.log("line 458 data", data);
	for (let i = 0; i < indexes.length - 1; i++) {
		let a = indexes[i + 1] + c;
		let b = data.indexOf("return", indexes[i] + c);
		// for(let j=0;j<functionNames.length;j++){
		//     if(functionNames[i].type = "void"){
		//         continue;
		//     }
		//     if(data.indexOf(functionNames[i].name, b) < data.indexOf(";", b))
		// }
		while (b < a && b != -1) {
			let line =
				'System.out.println("exit ' + functionNames[i].name + '");';
			data = data.slice(0, b) + line + data.slice(b);
			b = data.indexOf("return", b + line.length + 1);
			c += line.length;
			a += line.length;
		}
	}

	console.log("line 477", data);
	return data;
};

var createJson = function (data) {
	console.log(data);
	var arr = data.split("\n");
	// console.log(arr);
	var ans = {};
	var level = 0;
	for (var i = 0; i < arr.length; i++) {
		// console.log("inside i ",i);
		var elem = arr[i];
		if (elem == "") {
			// console.log("inside continue");
			continue;
		} else {
			// console.log("inside continue else");
			if (elem.indexOf("Exit") != -1 || elem.indexOf("IN") != -1) {
				// console.log("inside continue else continue-exit");

				var tempArr = elem.split(" ");
				if (tempArr[0] == "Exit") {
					// console.log("inside continue else exit");

					level--;
				} else {
					// console.log("inside continue else continue");

					if (level == 0) {
						// console.log("inside continue else continue-0");
						// console.log("level ",level);
						ans.name = tempArr[1];
						ans.vars = a;
						ans.childCount = 0;
						ans.children = [];
						level++;
						// console.log("ans is",ans);
					} else {
						// console.log("inside continue else continue-non zero");
						var zz = ans;
						// console.log("level ",level);
						for (let k = 0; k < level - 1; k++) {
							zz = zz.children[zz.childCount - 1];
						}

						var a = "(";
						for (let j = 2; j < tempArr.length; j++) {
							if (tempArr[j] != "") {
								a = a + tempArr[j] + ",";
							}
						}
						a = a + ")";
						var tempAns = {};
						tempAns.name = tempArr[1];
						tempAns.vars = a;
						tempAns.childCount = 0;
						tempAns.children = [];
						zz.childCount++;
						zz.children.push(tempAns);
						level++;
						// console.log("ans is ",JSON.stringify(ans, null, 4));
					}
				}
			}
		}
	}

	var ans1 = JSON.stringify(ans, null, 4);
	console.log(ans1);
	return ans1;
};

// var createTree = function (data) {
// 	console.log(data);
// 	var arr = data.split("\n");
// 	// console.log(arr);
// 	var ans = {};
// 	var level = 0;
// 	for (var i = 0; i < arr.length; i++) {
// 		// console.log("inside i ",i);
// 		var elem = arr[i];
// 		if (elem == "") {
// 			// console.log("inside continue");
// 			continue;
// 		} else {
// 			// console.log("inside continue else");
// 			if (elem.indexOf("exit") != -1 || elem.indexOf("Entered") != -1) {
// 				// console.log("inside continue else continue-exit");

// 				var tempArr = elem.split(" ");
// 				if (tempArr[0] == "exit") {
// 					// console.log("inside continue else exit");

// 					level--;
// 				} else {
// 					// console.log("inside continue else continue");

// 					if (level == 0) {
// 						// console.log("inside continue else continue-0");
// 						// console.log("level ",level);
// 						ans.name = tempArr[1];
// 						ans.vars = a;
// 						ans.childCount = 0;
// 						ans.children = [];
// 						level++;
// 						// console.log("ans is",ans);
// 					} else {
// 						// console.log("inside continue else continue-non zero");
// 						var zz = ans;
// 						// console.log("level ",level);
// 						for (let k = 0; k < level - 1; k++) {
// 							zz = zz.children[zz.childCount - 1];
// 						}

// 						var a = "(";
// 						for (let j = 2; j < tempArr.length; j++) {
// 							if (tempArr[j] != "") {
// 								a = a + tempArr[j] + ",";
// 							}
// 						}
// 						a = a + ")";
// 						var tempAns = {};
// 						tempAns.name = tempArr[1];
// 						tempAns.vars = a;
// 						tempAns.childCount = 0;
// 						tempAns.children = [];
// 						zz.childCount++;
// 						zz.children.push(tempAns);
// 						level++;
// 						// console.log("ans is ",JSON.stringify(ans, null, 4));
// 					}
// 				}
// 			}
// 		}
// 	}

// 	var ans1 = JSON.stringify(ans, null, 4);
// 	// console.log(ans1);
// 	return ans1;
// };
