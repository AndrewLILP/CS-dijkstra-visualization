function bubbleSort(arr) {
    let n = arr.length;
    
    let swapped = false;

    // R = O(n2) + O(n) => O(n2)
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

                swapped = true;
            }
        }

        if (!swapped) {
            // If no two elements were swapped, then break
            break;
        };
    }


    for(){

    }

    // O(n) time complexity
    // O(n2) time complexity
    // O(n3) time complexity
    
    return arr;
}

// Example usage:
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Sorted array:", bubbleSort(numbers));

//*********************** */
function quickSort(arr) {
    
    if (arr.length <= 1) {
        return arr; // Base case: arrays with 0 or 1 element are already sorted
    }

    const pivot = arr[arr.length - 1]; // Choosing the last element as the pivot
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]); // Elements smaller than pivot go to the left array
        } else {
            right.push(arr[i]); // Elements greater than or equal to pivot go to the right array
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
}

// Example usage:
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Sorted array:", quickSort(numbers));

//*********************** */
const dictionary = new Map();

// Add key-value pairs to the dictionary

dictionary.set("1", "carlos");
dictionary.set("2", "jane");
dictionary.set("5", "billy");
dictionary.set("9", "lily");
dictionary.set("7", "john");
dictionary.set("3", "rick");
dictionary.set("4", "nick");

console.log( dictionary.get("7") ); // john
console.log( dictionary.get("4") ); // nick

console.log( dictionary.has("5") ); // true

for (let [key, value] of dictionary) {
    console.log(key + " -> " + value);
}
//*********************** */


/*
 A dictionary is a collection of key-value pairs.
 Limitations of objects:

    - The keys are always strings.
    - no guarantee of order.
    - can't store complex data types efficiently.
*/
const dictionary = {};

dictionary["1"] = "carlos";
dictionary["2"] = "jane";
dictionary["5"] = "billy";
dictionary["9"] = "lily";
dictionary["7"] = "john";
dictionary["3"] = "rick";
dictionary["4"] = "nick";


console.log( dictionary["7"] ); // john
console.log( dictionary["4"] ); // nick
console.log( dictionary["5"] ); // billy

delete dictionary["5"];

console.log( dictionary["5"] ); // undefined

for(let key in dictionary) {
    console.log(key + " -> " + dictionary[key]);
}

//*********************** */


class Node {  
    constructor(data) {
      this.data = data;
      this.next = null;
    }
  }
  
  class LinkedList {
  
      constructor() {
          this.head = null;
      }
  
      append(data) {
  
          if (this.head === null) {
              this.head = new Node(data);
              return;
          }
  
          let current = this.head;
          while (current.next !== null) {
              current = current.next;
          }
  
          current.next = new Node(data);
      }
  
      delete(data) {
  
          if (this.head === null) {
              return;
          }
  
          if (this.head.data === data) {
              this.head = this.head.next;
              return;
          }
  
          let current = this.head;
          while (current.next !== null) {
              if (current.next.data === data) {
                  current.next = current.next.next;
                  return;
              }
              current = current.next;
          }
      }
  
      insertAfter(data, previousData) {
          
          let current = this.head;
          while (current !== null) {
              if (current.data === previousData) {
                  let newNode = new Node(data);
                  newNode.next = current.next;
                  current.next = newNode;
                  return;
              }
              current = current.next;
          }
      }
  
      print() {
          let current = this.head;
          let result = '';
          while (current !== null) {
              result += current.data + ' -> ';
              current = current.next;
          }
          console.log(result + 'null');
      }
  
  
  };
  
  let list = new LinkedList();
  list.append(10);    
  list.append(20);    
  list.append(30);
  list.delete(20);
  list.insertAfter(40, 10);
  list.print(); // 10 -> 20 -> 30 -> null

  //*********************** */



class Queue {

    constructor(){
      this.items = [];
    }
  
    enqueue(element){
      this.items.push(element); // Add to the back - O(1)
    }
  
    dequeue(){
      return this.items.shift(); // Remove from the front - O(n)
    }
  
    front(){
      return this.items[0]; // Peek at the front element - O(1)
    }
  
    isEmpty(){
      return this.items.length === 0; // O(1)
    }
  
    size(){
      return this.items.length; // O(1)
    }
  
    print(){
      console.log(this.items.join(" <- "));  // O(n)
    }
  }
  
  const queue = new Queue();
  
  queue.enqueue(10);
  queue.enqueue(20);
  queue.enqueue(30);
  
  queue.print();
  
  queue.dequeue();
  queue.print();
  console.log(queue.front());

  //*********************** */


/*
    Alternative to Avoid Performance Issue
    1. Use an Object with Indexes
       Instead of shifting elements, use an object with a frontIndex and rearIndex to 
       track the first and last elements.
*/

class Queue {

    constructor(){
        this.items = {};
        this.frontIndex = 0;
        this.rearIndex = 0;
    }

    enqueue(element){
        this.items[this.rearIndex] = element;  // Time Complexity - O(1)
        this.rearIndex++;
    }

    dequeue(){  // Time Complexity - O(1)
        if ( this.isEmpty() ) return null;

        const item = this.items[this.frontIndex];

        delete this.items[this.frontIndex];

        this.frontIndex++;

        return item;
    }

    isEmpty(){
        return this.rearIndex === this.frontIndex;
    }
}

const queue = new Queue();
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);

console.log( queue.dequeue() );


// splice(0,1) is as bad as shift() in terms of performance

//*********************** */



function factorial(n){

    if (n == 1) { // base case
        return 1;
    }

    return n * factorial(n-1); // recursion
}

// Time complexity is O(n)
// Space complexity is O(n)

console.log( factorial(7) );


function factorialIterative(n){
    
    let res = 1;
    
    for (let i = 1; i <= n; i++ ){ // 5! = 1 * 2 * 3 * 4 * 5 
        res = res * i;
    }
    
    return res;
}

// Time complexity is O(n)
// Space complexity is O(1)

console.log( factorialIterative(7) );

// Both have the same time complexity: O(n)
// factorial iterative has better space complexity: O(1) 
// factorial recursive has O(n) (stack memory usage)


function fibonacci(n){

    if ( n<=1 ){ // Base case
        return n;
    }

    return fibonacci(n-1) + fibonacci(n-2); // recursive case
}

// Time Complexity is O(2^n)

function fibonacciMemo(n, memo = {}){
    
    if (n in memo) {
        return memo[n]; // return cached result
    }
    
    if ( n<=1 ){ // Base case
        return n;
    }
    
    memo[n] = fibonacciMemo(n-1, memo) + fibonacciMemo(n-2, memo); // recursive case
    
    return memo[n];
}

// Time Complexity is O(n)

console.log( fibonacci(45) );
console.log( fibonacciMemo(45) ); // Fast!

function printFibonnaciSequence(n){
    for(let i=0; i<=n; i++){
        console.log(fibonacci(i))
    }
}

//printFibonnaciSequence(10)

/* When to Use Recursion?

  Recursion is useful for:

  Tree & Graph Traversal (e.g., DOM traversal, file systems)
  Divide and Conquer Algorithms (e.g., Merge Sort, Quick Sort)
  Backtracking Problems (e.g., Maze solving, Sudoku)
  Mathematical Computations (e.g., Factorial, Fibonacci)

*/

//*********************** */



let stack = [];

// Push elements onto the stack

stack.push(10);
stack.push(20);
stack.push(30);

stack.pop()

// peek at the top element (last added, without removing it)
console.log( stack[stack.length - 1] ) // peek

console.log(stack)

// check if the stack is empty
console.log(stack.length === 0) // 

/*
  Time Complexity

  push() -> O(1)
  pop() -> O(1)
  peek() -> O(1)

*/


// For better encapsulation and control, we can create a Stack class.

class Stack{

    constructor(){
        this.items = [];
    }

    // Push an element
    push(element){
        this.items.push(element);
    }

    // Pop (remove and return top element)
    pop(){
      if ( this.isEmpty() ){
        return "Stack is Empty";
      }

      return this.items.pop();
    }

    // Peek (get top element without removing)
    peek(){
       return this.isEmpty() ? "Stack is Empty": this.items[this.items.length - 1];
    }

    // Check if the stack is empty
    isEmpty(){
        return this.items.length === 0;
    }

    // Get stack size
    size(){
        return this.items.length;
    }

    // Print stack
    print(){
        console.log(this.items.join(" -> "));
    }

}

let stack = new Stack();

stack.push(5);
stack.push(10);
stack.push(15);
stack.push(20);
stack.push(25);

console.log( stack.pop() ) // 25
console.log( stack.peek() ) // 20
console.log( stack.isEmpty() ) // false

stack.print();

//  **************************

/* Dijkstra’s Algorithm: Shortest Path Algorithm

   Dijkstra’s Algorithm is a graph traversal algorithm used to find the shortest path from a source node to all other nodes in a weighted graph. 
   It guarantees the shortest path in graphs with non-negative weights.

      Graph Representation

       (A)
     1/ 3 \4
    (B)---(C)
     | \   | 
    2|  3  |1
     |    \|
    (D)---(E)
        1

*/

class PriorityQueue {
    constructor() {
      this.queue = [];
    }
  
    enqueue(node, priority) {
      this.queue.push({ node, priority });
      this.queue.sort((a, b) => a.priority - b.priority);
    }
  
    dequeue() {
      return this.queue.shift().node;
    }
  
    isEmpty() {

        //********************** */


    
class TreeNode {

    constructor(value){
        this.value = value;
        this.children = [];
    }

    addChild(child){
        this.children.push(child);
    }
}

// Tree Structure:
//        A
//       / \
//      B   C
//     / \
//    D   E

const root = new TreeNode("A");

const nodeB = new TreeNode("B");
const nodeC = new TreeNode("C");
const nodeD = new TreeNode("D");
const nodeE = new TreeNode("E");

root.addChild(nodeB);
root.addChild(nodeC);

nodeB.addChild(nodeD);
nodeB.addChild(nodeE);

//console.log(root);

// Tree Traversal
// Depth-First Search (DFS) - recursive

function dfs(node){

    if (!node) return;

    console.log(node.value);

    for (let child of node.children) {
        dfs(child);
    }
}

//dfs(root);

// Breadth-First Search (BFS) - iterative

function bfs(node){
    if (!node) return;

    let queue = [node];

    while (queue.length) {

        let current = queue.shift(); //Dequue
        console.log(current.value);
        queue.push(...current.children); //Enqueue
    }  
}

//bfs(root);


class BinaryTreeNode{

    constructor(value){
        this.value = value;
        this.left = null;
        this.right = null;

    }
}

// Binary Tree Structure:
//        1
//       / \
//      2   3
//     / \
//    4   5

const rootBT = new BinaryTreeNode(1);

rootBT.left = new BinaryTreeNode(2);
rootBT.right = new BinaryTreeNode(3);

rootBT.left.left = new BinaryTreeNode(4);
rootBT.left.right = new BinaryTreeNode(5);

console.log(rootBT);


// ************************


/*
  Sorting Problem
  ***************
  
  Create a data structure to represent the entries in a phone book. 
  Each entry should include information like name, phone number, and any additional relevant details. 
  Implement functions for adding, updating, and deleting entries in the phone book.

  Sorting Functionality:
  **********************

  Implement sorting functionality to allow users to sort the phone book entries based on different criteria. 
  Provide options for sorting by name, phone number, or any other relevant parameter.
  Use appropriate algorithms for sorting, ensuring efficiency in handling a potentially large number of entries.

  Documentation: Provide clear and concise documentation for your code, explaining the purpose of each function, the data structure used, and how to run the application. 
  Include examples demonstrating the sorting capabilities.

*/

class PhoneBook {

    constructor(){
        this.entries = [];
    }

    addEntry(name, phoneNumber, email) {

        const entry = {
            name,
            phoneNumber,
            email
        };
        
        this.entries.push(entry)

        // this.entries.push({ name, phoneNumber, email })
    }

    // Update an existing entry
    updateEntry(oldName, newName, newPhoneNumber, newEmail) {

        /*
        const entry = this.entries.find(entry => entry.name === oldName);

        if (!entry) {
            console.log('Entry not found');
            return;
        }

        if (newPhoneNumber) {
            entry.phoneNumber = newPhoneNumber;
        }
        if (newEmail) {
            entry.email = newEmail;
        }
        if (newName) {
            entry.name = newName;
        }
        console.log(entry)

        */

        const entry = this.entries.find(entry => entry.name === oldName);

        if (entry) {
            entry.name = newName || entry.name;
            entry.phoneNumber = newPhoneNumber || entry.phoneNumber;
            entry.email = newEmail || entry.email ;
            console.log(`Entry for ${oldName} updated successfully.`);
        } 
        else {
            console.log(`Entry for ${oldName} not found.`);
        }
    }

       // Delete an entry
    deleteEntry(name) {
        const index = this.entries.findIndex(entry => entry.name === name);
        if (index !== -1) {
            this.entries.splice(index, 1);
            console.log(`Entry deleted: ${name}`);
        } else {
            console.log(`Entry not found: ${name}`);
        }
    }

    // Sort entries by a given key (name, phoneNumber, email)
    sortEntries(criteria = 'name') {
        if (!['name', 'phoneNumber', 'email'].includes(criteria)) {
            console.log("Invalid sorting criteria. Use 'name', 'phoneNumber', or 'email'.");
            return;
        }
        this.entries.sort((a, b) => a[criteria].localeCompare(b[criteria]));
        console.log(`Sorted by ${criteria}:`, this.entries);
    }

    displayEntries(){
        console.log("Phone Book Entries: ", this.entries);
    }

}

const phoneBook = new PhoneBook();

phoneBook.addEntry("Alice", "123-456-7890", "alice@example.com");
phoneBook.addEntry("Bob", "987-654-3210", "bob@example.com");
phoneBook.addEntry("Charlie", "333-222-4444", "charlie@example.com");

phoneBook.updateEntry("Charlie");

phoneBook.displayEntries();

// ************************


class Person {

    constructor(name, birthdate){
        this.name = name;
        this.birthdate = birthdate;
        this.children = [];
    }

    addChild(child){
        this.children.push(child);
    }
}

class FamilyTree {

    constructor(){
       this.members = new Map();
    }

    // adds a new member to the map
    addMember(name, birthdate){

        if (this.members.has(name)) { 
            console.error("A person with this name already exists in the family tree"); 
        }
        else {
            const person = new Person(name, birthdate); 
            this.members.set(name, person);
        }       
    }

    // adds a child to a parent
    defineRelationship(parentName, childName){

        // check if the parent exists in the family tree (map)
        // if not, print an error message

        // check if the child exists in the family tree (map)
        // if not, print an error message

        // add the child to the parent's children list
        
        // check if the parent exists in the family tree(map)
        // if not, print an error message

        if (!this.members.has(parentName)) {
            console.error("This parent name does not exist")
        }
        else if (!this.members.has(childName)) {
            console.error("This child name does not exist")
        }
        else {
            const parent = this.members.get(parentName);
            const child = this.members.get(childName);
            parent.addChild(child);
        }
    }

    findDescendants(name){
    
        // check if the name exists in the family tree (map)
        // if not, print an error message
        // return an empty array if the name does not exist

        // get the person object from the map
        // get the children of the person

        // get the descendants of the children - repeat the process recursively/iteratively

        // return the descendants

        if (!this.members.has(name)) {
            console.error('The name does not exist');
            return [];
        }

        const descendants = [];  // To store all descendants
        let queue = [ this.members.get(name) ]
        while (queue.length > 0) {

            let current = queue.shift() 
        
            for (const child of current.children) {
                descendants.push(child.name);  
                queue.push(child);                       
            }
        }

        return descendants;  

       // Omer
       

    };

    findDescendants2(name){

        if(!this.members.has(name)){
            console.error(`${name} not found!`);
            return [];
        }

        const descendants = [];
        const queue = [...this.members.get(name).children]; 
        while (queue.length) {
            const current = queue.shift();
            descendants.push(current.name); 
            queue.push(...current.children); 
        }
        return descendants;
    };

    findDescendants3(name) {

        if (!this.members.has(name)) {
            console.error('The name does not exist');
            return [];
        }

        let queue = [{person: this.members.get(name), level:0}]; 
        const descendants = [];  

        // Comment
        while (queue.length > 0) {
            let {person, level} = queue.shift(); 

            for (const child of person.children) {
                descendants.push({ name: child.name, level: level + 1 });                  
                queue.push({person: child, level: level + 1});              
            }
        }

        return descendants;  
    }
}

const familyTree = new FamilyTree();

familyTree.addMember("Alice", "01/01/2000");
familyTree.addMember("Bob", "01/01/2001");
familyTree.addMember("Charlie", "01/01/2002");
familyTree.addMember("David", "01/01/2003");
familyTree.addMember("Eve", "01/01/2004");
familyTree.addMember("Frank", "01/01/2005");
familyTree.addMember("Grace", "01/01/2006");

familyTree.defineRelationship("Alice", "Bob");
familyTree.defineRelationship("Alice", "Charlie");
familyTree.defineRelationship("Bob", "David");
familyTree.defineRelationship("Bob", "Eve");
familyTree.defineRelationship("Charlie", "Frank");
familyTree.defineRelationship("David","Grace");


console.log("Descendants of Alice : ", familyTree.findDescendants("Alice")); // ["Bob", "Charlie", "David", "Eve", "Frank", "Grace"]
console.log("Descendants of Alice : ", familyTree.findDescendants3("Alice")); // ["Bob", "Charlie", "David", "Eve", "Frank", "Grace"]

console.log("Descendants of Bob : ", familyTree.findDescendants("Bob")); // ["David", "Eve", "Grace"]
console.log("Descendants of Bob : ", familyTree.findDescendants3("Bob")); // ["David", "Eve", "Grace"]

console.log("Descendants of David : ", familyTree.findDescendants("David")); // ["Grace"]
console.log("Descendants of David : ", familyTree.findDescendants3("David")); // ["Grace"]

console.log("Descendants of Frank : ", familyTree.findDescendants("Frank")); // ["Grace"]
console.log("Descendants of Frank : ", familyTree.findDescendants3("Frank")); // ["Grace"]


// ************************


class SocialNetwork {

    constructor() {
        this.graph = new Map();
    }

    /*
     *  Person constains the name of the person to add and the name is unique.
     */
    addPerson(person) {
        this.graph.set(person, []);
    }

    /*
     * Adds an individual to the network.
     */
    addPerson(person){
        if (this.graph.has(person)){ // if the person already exists 
            console.log(`${person} already exists.`);
            return false;
        }
        this.graph.set(person, new Set());

        return true;
    }

    /*
     * Establish a friendship between two individuals.
     */
    addFriendship(person1, person2) {

        if (person1 === person2) {
            console.log("Cannot add friendship with self.");
            return;
        }

        if (!this.graph.has(person1)){
            this.addPerson(person1);
        }

        if (!this.graph.has(person2)){
            this.addPerson(person2);
        }

        this.graph.get(person1).add(person2);
        this.graph.get(person2).add(person1);
    }

    // NOT (O1 AND O2) => NOT O1 OR NOT O2

    /*
     * Update details of an individual (rename in this case).
     */
    updatePerson(oldName, newName){
        const person = this.graph.get(oldName);
        if(!person){
            console.error(`${oldName} not found.`);
            return;
        }
        if(person){
            oldName === newName;
        }
    }

    updatePerson(oldName, newName) {
        if (this.graph.has(oldName)) {
            this.graph.set(newName, this.graph.get(oldName));

            // Check if the oldName is in the list of  friends of other people
            for (let [key, value] of this.graph) {
                if (value.has(oldName)) {
                    value.delete(oldName);
                    value.add(newName);
                }
            }

            this.graph.delete(oldName);
        } 
        else {
            console.log("Person does not exist");
        }
    }

    // Renaming a person
    updatePerson(oldName, newName) {

        if (!this.graph.has(oldName)) {
            console.log(`${oldName} does not exist in the network.`);
            return;
        }
        
        if (this.graph.has(newName)) {
            console.log(`${newName} already exists in the network.`);
            return;
        }
        
        const friends = this.graph.get(oldName);
        this.graph.delete(oldName);
        this.graph.set(newName, friends);
        
        // Update friends' connections
        for (const friend of friends) {
            this.graph.get(friend).delete(oldName);
            this.graph.get(friend).add(newName);
        }

        console.log(`${oldName} has been renamed to ${newName}.`);
    }

    /*
     * Calculate the degree of separation between two individuals.
     * Uses Breadth-First Search (BFS) to find the shortest path.
     */
    degreeOfSeparation(start, target){

    }

    getDegreeOfSeparation(startPerson, endPerson) {

        if (!this.graph.has(startPerson) || !this.graph.has(endPerson)) {
            console.log("One or both persons do not exist in the network.");
            return -1;
        }

        if (startPerson === endPerson) return 0;

        const queue = [[startPerson, 0]]; // [person, degree]
        const visited = new Set();
        visited.add(startPerson);

        while (queue.length > 0) {
            const [currentPerson, degree] = queue.shift();

            for (const friend of this.graph.get(currentPerson)) {
                if (friend === endPerson) {
                    return degree + 1;
                }
                if (!visited.has(friend)) {
                    visited.add(friend);
                    queue.push([friend, degree + 1]);
                }
            }
        }
      
        return -1; // No connection found
    }
}


const network = new SocialNetwork();

network.addPerson("Alice");
network.addPerson("Bob");
network.addPerson("Charlie");
network.addPerson("David");
network.addFriendship("Alice", "Bob");
network.addFriendship("Bob", "Charlie");
network.addFriendship("Charlie", "David");

console.log(network.getDegreeOfSeparation("Alice", "David")); // Output: 3
console.log(network.getDegreeOfSeparation("Alice", "Charlie")); // Output: 2
console.log(network.getDegreeOfSeparation("Alice", "Eve")); // Output: -1 (not in network)

