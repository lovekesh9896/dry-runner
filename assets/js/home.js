console.log("working");

$(document).ready(function(){

    var editorDefaultValue;
    if(localStorage.getItem('lastCode') != null){
        editorDefaultValue = localStorage.getItem('lastCode');
    }else{
        editorDefaultValue = 
`public class exp {
	public static void main(String[] args){
		System.out.print("hello world!");
	}	
}
`
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
        // $('#submit-button').html('<span class="material-icons">done</span>');
        // $('#submit-button').addClass('onSubmit');
        
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
            $('#output-div').css('display','initial');
            $('#output-div-span').text(data.data);
            createTemplate(data.data, 10, 10);
            console.log(data.data);
            let ul = document.createElement('ul')
            createLi(data.data, ul);
            // tryQueue();
        },
        error : function(){
            console.log("Error in recieveing data");
        }
    });
}

let createTemplate = function(data,top,left){
    console.log("entred");
    if(data.childCount <= 0){
        console.log("returned");
        return;
    }
    let a = `<div><span style="margin-left:${left}px">${data.name}</span></div>`;
    $('#output-div-span').append(a);
    let tempString;
    let nonempty = new Queue(); 
    nonempty.enqueue(data);
    var c = 10;
		while(nonempty.size() != 0 ) {
            // c--;
            tempString = `<div style=margin-top:${top}px>`
            let a = nonempty.size();
            for(let i=0;i<a;i++) {
                left = 0;
                let temp = nonempty.dequeue();
                let b = temp.childCount;
                for(let j=0;j<b;j++) {
                    nonempty.enqueue(temp.children[j]);
				}
                tempString = `${tempString} <span style="margin-left:${left}px">${temp.name} (${temp.vars})</span>`
                left = left + 10;
			}
            tempString = tempString + '</div>';
            $('#output-div-span').append(tempString);
            top = top +10;
            tempString = '';
		}
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

$('#cross-output-div').click(function(){
    $('#output-div').css('display','none');
});

// //////////////////// Test ////////////////////////////////////
let createLi = function(data, mainUl){
    var value = $(e.target).val();
    var span = $(e.target).parent();
    var ulList = span.next()[0];
    // console.log(ulList);
    if (typeof ulList !== "undefined" && ulList.tagName == "UL") {
      $(ulList).append(
        `<li><span class="tf-nc">${value}<input type="text"></span></li>`
      );
    } else {
      $(span).after(
        `<ul><li><span class="tf-nc">${value}<input type="text"></span></li></ul>`
      );
    }
}
