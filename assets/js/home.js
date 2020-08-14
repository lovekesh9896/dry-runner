console.log("working");
$(document).ready(function(){

    var editorDefaultValue = 
`public class exp {
    
    public static void print(int i){
		if(i<1){
			return;
		}
		System.out.println(i);
		print(i-1);
		
	}
	
	public static void main(String[] args) throws FileNotFoundException, UnsupportedEncodingException {
		
		System.out.println("Hello world!");
		print(10);
	}

}
`

    var myCodeMirror = CodeMirror(document.body, {
        lineNumbers : true,
        value : editorDefaultValue,
        mode:  "text/x-java",
        theme: "dracula",
        // extraKeys: {"Ctrl-Q": function(cm) { cm.foldCode(cm.getCursor()); }},
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
      });
      // below is the dummy code in case i want to use my own textarea
    //   {
            // var code = $('.codemirror-textarea')[0];
            // var editor = CodeMirror.fromTextArea(code,{
            //     lineNumbers : true,
            //     value : 'this is just greta',
            //     mode:  "text/x-java",
            //     theme: "dracula",
            //     // extraKeys: {"Ctrl-Q": function(cm) { cm.foldCode(cm.getCursor()); }},
            //     foldGutter: true,
            //     gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
            // });
    //   }
    
    // when submit button is clicked it will send a ajax request to the server
    $('#submit-button').click(function(event){
        event.preventDefault();
        console.log("Submit button pressed");
        var data = myCodeMirror.getValue();
        sendAJAX(data);
    });
    
});

let sendAJAX = function(data){
    $.ajax({
        type : 'POST',
        url  : '/submit-code',
        data : {
            data1 : data,
        },
        success : function(data){
            $('#submit-button').css('background-color', 'green');
            $('#submit-button').css('color', 'white');
        },
        error : function(){
            console.log("Error in recieveing data");
        }
    });
}
