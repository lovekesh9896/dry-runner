public class exp{
 
 public static int fibb(int n){
     System.out.println("Entered fibb 02c11c67-b276-4bc6-87bb-1bfe97d274bb");
     System.out.println("IN fibb 02c11c67-b276-4bc6-87bb-1bfe97d274bb "+n+ " ");
  if(n == 1 || n==2){
  System.out.println("Exit fibb 02c11c67-b276-4bc6-87bb-1bfe97d274bb"); return 1;
  } 
  int a= fibb(n-1);
  int b = fibb(n-2);
  
 System.out.println("Exit fibb 02c11c67-b276-4bc6-87bb-1bfe97d274bb"); return a+b;
 } 
 
 public static void main(String[] args){System.out.println("Entered main 9aa72ab7-a1c2-40c5-bb03-e85eb6465b07");System.out.println("IN main 9aa72ab7-a1c2-40c5-bb03-e85eb6465b07 "+args+ " ");
  System.out.print("hello world!");
  System.out.println(fibb(5));
 System.out.println("exit main");
}  
} 
