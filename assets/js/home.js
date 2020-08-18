console.log("working");
$(document).ready(function(){

    var editorDefaultValue;
    if(localStorage.getItem('lastCode') != null){
        editorDefaultValue = localStorage.getItem('lastCode');
    }else{
        editorDefaultValue = 
`public static void print(){
    /* write your code here */
    System.out.println('Hello World!');
}`
    }
    

    var myCodeMirror = CodeMirror(document.body, {
        lineNumbers : true,
        value : editorDefaultValue,
        mode:  "text/x-java",
        theme: "dracula",
        indentUnit : 4,
        matchBrackets: true,
        autoCloseTags: true,
        indentWithTabs: true,
        autoCloseBrackets: true,
        extraKeys: {"Ctrl-Q": function(cm) { cm.foldCode(cm.getCursor()); }},
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
      });

      themes(myCodeMirror);
      customInput();
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
        $('#submit-button').html('<span class="material-icons">done</span>');
        $('#submit-button').addClass('onSubmit');
        
        console.log("Submit button pressed");
        var data = myCodeMirror.getValue();
        var customInput = $('#custom-input-textarea').val();
        console.log(customInput);
        localStorage.setItem('lastCode', data);
        sendAJAX(data,customInput);
    });
    
});

let sendAJAX = function(data, customInput){
    $.ajax({
        type : 'POST',
        url  : '/submit-code',
        data : {
            data1 : data,
            customInput : customInput
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

let themes = function(myCodeMirror){
    var themeButtons = document.getElementsByClassName('theme-buttons');
    if(localStorage.getItem('theme') != null){
        myCodeMirror.setOption('theme', localStorage.getItem('theme'));
    }
    if(localStorage.getItem('highlight') != null){
        $(themeButtons[localStorage.getItem('highlight')]).addClass('highlight');
    }else{
        $(themeButtons[0]).addClass('highlight');
    }
    
    for(let i=0;i<themeButtons.length;i++){
        $(themeButtons[i]).click(function(){
            for(let j=0;j<themeButtons.length;j++){
                $(themeButtons[j]).removeClass('highlight');
            }
            $(themeButtons[i]).addClass('highlight');
            if(i==0){
                myCodeMirror.setOption('theme', 'dracula');
                localStorage.setItem('theme','dracula');
            }
            if(i==1){
                myCodeMirror.setOption('theme', 'duotone-light');
                localStorage.setItem('theme','duotone-light');
            }
            if(i==2){
                myCodeMirror.setOption('theme', 'blackboard');
                localStorage.setItem('theme','blackboard');
            }
            localStorage.setItem('highlight' , i);
        });
        
    }
}

let customInput = function(){
    $('#custom-input').click(function(){
        $('#custom-input').text((i, t) => t == 'Hide' ? 'Custom Input' : 'Hide');
        $('#custom-input-textarea').slideToggle();
        $('#custom-input-textarea').focus();
    });
}


