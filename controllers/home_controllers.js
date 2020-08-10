module.exports.home = function(req, res){

    var editorDefaultValue = 
`public static void print(){
    /* write your code here */
    System.out.println('Hello World!');
}`

    return res.render("home", {
        title : "hi babay",
        editorDefaultValue : editorDefaultValue,
    });
    
}