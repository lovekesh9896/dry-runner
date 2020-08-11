
public class exp {

	public static void print(int i){
		if(i<1){
			return;
		}
		//for(int i=0;i<5;i++){
			System.out.println(i);
			print(i-1);
		//}
	}

	public static void main(String[] args) {
		System.out.println("Hello world!");
		print(10);
	}

}
