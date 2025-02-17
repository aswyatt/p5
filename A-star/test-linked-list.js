function testList() {
    list = new DoublyLinkedList();
    let popped;

    for (let n = 0; n < 5; n++) {
        list.append(n);
    }

    console.log("Original list:");
    list.display();

    popped = list.pop();
    console.log("\nPopped node (last):", popped.data);
    console.log("List after popping last node:");
    list.display();

    popped = list.pop(1);
    console.log("\nPopped node (1st position):", popped.data);
    console.log("List after popping 1st node:");
    list.display();

    let node = list.findNode(2);
    console.log("\nFound node with data 2:\n", node);

    list.insertAfter(10, node);
    console.log("\nList after inserting 10 after node with data 2:");
    list.display();

    list.insertAfter(20, node);
    console.log("\nList after inserting 20 after node with data 2:");
    list.display();

    list.insertBefore(-10, node);
    console.log("\nList after inserting -1 before node with data 2:");
    list.display();

    popped = list.pop(-1);
    console.log("\nPopped node (1st position from end):", popped.data);
    console.log("List after popping -1st node:");
    list.display();

    list.insertAfter(100, list.head);
    console.log("\nList after inserting 100 after head:");
    list.display();

    list.insertAfter(200, list.tail);
    console.log("\nList after inserting 200 after tail:");
    list.display();


    list.insertBefore(-100, list.head);
    console.log("\nList after inserting -100 before head:");
    list.display();

    list.insertBefore(-200, list.tail);
    console.log("\nList after inserting -200 before tail:");
    list.display();

    let N = list.length();
    console.log("\nPop node", N + 1, "times:");
    for (let n = 0; n <= N; n++) {
        list.pop()
        console.log(n+1+":", list.toString());
    }
}