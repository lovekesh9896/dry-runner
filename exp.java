import java.io.*;

public class exp{

    public static PrintWriter writer; 
riter = new PrintWriter("the-file-name.txt", "UTF-8");
writer.println("entered Main function");
 
 public static int[] allindex(int input[],int x,int si,int arr[],int in) throws FileNotFoundException, UnsupportedEncodingException{
 if(si==input.length){
 if(in!=si){
 int arr2[] = new int[in];
 for(int i=0;i<in;i++){
 arr2[i] = arr[i];
 }
 return arr2;
 }
 return arr;
 }
 if(input[si]==x){
 arr[in] = si;
 in++;
 }
 int arr3[] = allindex(input,x,si+1,arr,in);
 return arr3;
 
 }

	public static int[] allIndexes(int input[], int x) {
		int arr[] = new int[input.length];
 writer.println("Entered allindex");return allindex(input,x,0,arr,0);
	}
	
	public static void main(String[] argd){
		Scaner s = new Scaner(System.in);
		int n = s.nextInt();
		int arr[] = new int[n];
		for(int i=0;i<n;i++){
			arr[i] = s.nextInt();
		}
		int m = s.nextInt();
		int ans[] = allIndexes(arr, m);
		for(int i=0;i<ans.length;i++){
			writer.print(arr[i] + " ");
		}
	
writer.close();
}
	
}