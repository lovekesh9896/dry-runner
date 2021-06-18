public class exp{
 
 public static void helper(int n){
     System.out.println();
     System.out.println("IN helper  "+n+ " ");
  if(n == 1){
   System.out.print(n + " ");
System.out.println();System.out.println("Exit helper ");
 return ;
  } 
  
  helper(n - 1);
 System.out.print(n+" ");
System.out.println();
System.out.println("Exit helper "); return ;
 } 



 
 public static void main(String[] args){System.out.println();System.out.println("IN main  "+args+ " ");
  helper(6);
 System.out.println("exit main");
} 
} 
