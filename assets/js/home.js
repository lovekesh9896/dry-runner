console.log("working");
$(document).ready(function(){
    var code = $('.codemirror-textarea')[0];
    var editor = CodeMirror.fromTextArea(code,{
        lineNumbers : true,
        mode:  "text/x-java",
        theme: "dracula"
    });
  
    
});