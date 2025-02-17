function setup() {
  createCanvas(400, 400);
  console.log("A* algorithm");

  list = new DoublyLinkedList();

  list.append(10);
  list.append(20);
  list.append(30);
  list.append(40);

  console.log("Original list:");
  list.display();

  let popped = list.pop();
  console.log("Popped node (last):", popped.data);
  console.log("List after popping last node:");
  list.display();

  popped = list.pop(1);
  console.log("Popped node (1st position):", popped.data);
  console.log("List after popping 1st node:");
  list.display();

  popped = list.pop(-1);
  console.log("Popped node (-1st position from end):", popped.data);
  console.log("List after popping -1st node:");
  list.display();
}

function draw() {
  background(220);
}
