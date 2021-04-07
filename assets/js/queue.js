class Queue { 
    // Array is used to implement a Queue 
    constructor() 
    { 
        this.items = []; 
    } 
    enqueue(element) {     
    // adding element to the queue 
        this.items.push(element); 
    } 
    dequeue() { 
        if(this.isEmpty()) 
            return "Underflow"; 
        return this.items.shift(); 
    } 
    front() { 
        if(this.isEmpty()) 
            return "No elements in Queue"; 
        return this.items[0]; 
    } 
    size(){
        return this.items.length;
    }
    isEmpty() { 
        return this.items.length == 0; 
    } 
    printQueue() { 
        var str = ""; 
        for(var i = 0; i < this.items.length; i++) 
            str += this.items[i] +" "; 
        return str; 
    } 
} 

// export default Queue;