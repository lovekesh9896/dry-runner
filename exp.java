import java.io.*;
import java.util.*;
public class exp{
	
	public static PrintWriter writer; 
	
	public static int[] allindex(int input[],int x,int si,int arr[],int in){
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
		writer.println("Entered allindex");return allindex(input,x,si+1,arr,in);
		
		
	}
	
	public static int[] allIndexes(int input[], int x) {
		int arr[] = new int[input.length];
		writer.println("Entered allindex");return allindex(input,x,0,arr,0);
	}
	
	public static void main(String[] args) throws FileNotFoundException, UnsupportedEncodingException{
		writer = new PrintWriter("the-file-name.txt", "UTF-8");
		writer.println("entered Main function");
		Scanner s = new Scanner(System.in);
		int n = s.nextInt();
		int arr[] = new int[n];
		for(int i=0;i<n;i++){
			arr[i] = s.nextInt();
		}
		int m = s.nextInt();
		int ans[] = allIndexes(arr, m);
		for(int i=0;i<ans.length;i++){
			writer.print(ans[i] + " ");
		}
		
		writer.close();
	}
	
}