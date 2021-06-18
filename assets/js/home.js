let codemirror;

$(document).ready(function () {
	var editorDefaultValue;
	if (localStorage.getItem("lastCode") != null) {
		editorDefaultValue = localStorage.getItem("lastCode");
	} else {
		editorDefaultValue = `public class exp {
	public static void main(String[] args){
		System.out.print("hello world!");
	}
}
`;
	}

	myCodeMirror = CodeMirror(document.body, {
		lineNumbers: true,
		value: editorDefaultValue,
		mode: "text/x-java",
		theme: "dracula",
		indentUnit: 4,
		matchBrackets: true,
		autoCloseTags: true,
		indentWithTabs: true,
		autoCloseBrackets: true,
		extraKeys: {
			"Ctrl-Q": function (cm) {
				cm.foldCode(cm.getCursor());
			},
		},
		foldGutter: true,
		gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
	});

	themes(myCodeMirror);
	customInput();
	// when submit button is clicked it will send a ajax request to the server

	$("#submit-button").click(function (event) {
		console.log("Submit button pressed");
		var data = myCodeMirror.getValue();
		var customInput = $("#custom-input-textarea").val();
		console.log(customInput);
		localStorage.setItem("lastCode", data);
		sendAJAX(data, customInput);
	});
});

function copyText(jsonData) {
	let selBox = document.createElement("textarea");
	selBox.style.position = "fixed";
	selBox.style.left = "0";
	selBox.style.top = "0";
	selBox.style.opacity = "0";
	selBox.value = JSON.stringify(jsonData);
	document.body.appendChild(selBox);
	selBox.focus();
	selBox.select();
	document.execCommand("copy");
	document.body.removeChild(selBox);
}

let sendAJAX = function (data, customInput) {
	$.ajax({
		type: "POST",
		url: "/submit-code",
		data: {
			data1: data,
			customInput: customInput,
		},
		success: function (data) {
			$("#output-div").css("display", "initial");
			console.log(data);
			abc = data;
			copyText(abc.data);

			if (data.message == "success") {
				window.alert(
					"Your code is processed and the output is pasted to clipboard. A new website will open now and just paste your clipboard to input feild. It will create the tree for you"
				);
			} else {
				window.alert(
					"Your code has some syntax error or runtime error. please fix that fist please. You error is copied to you clipboard"
				);
			}
			if (window.confirm) {
				window.open("https://vanya.jp.net/vtree/");
			}
		},
		error: function () {
			console.log("Error in recieveing data");
		},
	});
};

let customInput = function () {
	$("#custom-input").click(function () {
		$("#custom-input").text((i, t) =>
			t == "Hide" ? "Custom Input" : "Hide"
		);
		$("#custom-input-textarea").slideToggle();
		$("#custom-input-textarea").focus();
	});
};

function changeTheme(theme) {
	console.log(theme);
	$("#theme-changer").val(theme);
	myCodeMirror.setOption("theme", theme);
	localStorage.setItem("theme", theme);
}

let themes = function () {
	let selector = document.getElementById("theme-changer");
	if (localStorage.getItem("theme") != null) {
		myCodeMirror.setOption("theme", localStorage.getItem("theme"));
		$(selector).val(localStorage.getItem("theme"));
	}

	$("#theme-changer").change(function (e) {
		changeTheme($("#theme-changer").find(":selected").text());
	});
};
