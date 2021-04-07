    public class exp{
        
        public static int fibb(int n){
            System.out.println("Entered fibb"+" " +(n)+" ");
            if( n == 1 || n == 2){
                return 1;
            }
            int a = fibb(n-1);
            int m = fibb(n-2);
            
            return a+m;
            
        }
        
        public static void main(String[] args){
            System.out.println(fibb(5));
        System.out.println("exit main");
    }	
    }
