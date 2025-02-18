// Implementation of a doubly linked list
// Note that methods do not perform error checking - it is down to the user to ensure supplied arguments and objects are valid.

// Doubly linked list node
class dLLNode {
  constructor(data, prev = null, next = null) {
    this.data = data;
    this.next = next;
    this.prev = prev;
  }
}

/* Doublylinked list implementation
  Only requires knowledge of head and tail; each node keeps track of prev and next node.
*/
class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  // Add a node to the end of the list
  append(data) {
    let newNode = new dLLNode(data, this.tail);
    if (this.tail) {
      this.tail.next = newNode;
    } else {
      this.head = newNode;
    }
    this.tail = newNode;
  }

  // Returns the length of the list by counting the number of nodes
  length() {
    let current = this.head;
    let count = 0;
    while (current !== null) {
      count++;
      current = current.next;
    }
    return count;
  }

  // Removes an element from the list and returning the node.
  // n is an optional index:
  //    n === null --> pop's the last element
  //    n >=0 --> pop's the nth element from the head
  //    n <0 --> pop's the nth element from the tail
  pop(n = null) {
    let current, count, next;

    // Determine direction of travel (either from head or start)
    if (n === null || n < 0) {
      current = this.tail;
      next = node => node.prev;
    } else {
      current = this.head;
      next = node => node.next;
    }

    n = Math.abs(n);
    count = 0;

    // Loop through until either head/tail is reached or n nodes have been traversed.
    while (current !== null && count < n) {
      current = next(current);
      count++;
    }

    // Check found node is valid (i.e. not head or tail)
    // If so, replace prev and next referencs of adjacent nodes, checking if they are head or tail.
    if (current) {
      if (current.prev) {
        current.prev.next = current.next;
      } else {
        this.head = current.next;
      }
      if (current.next) {
        current.next.prev = current.prev;
      } else {
        this.tail = current.prev;
      }
    }
    return current;
  }

  // Loop through list searching for first node that matches the input data.
  // Can either traverse forwards (from head, default), or backwards (from tail).
  findNode(data, forward = true) {
    let current, next;
    if (forward) {
      current = this.head;
      next = node => node.next;
    }
    {
      current = this.tail;
      next = node => node.prev;
    }
    while (current !== null) {
      if (current.data === data) {
        return current;
      }
      current = next(current);
    }
    return null;
  }

  // Insert data into a node after a given node.
  // If no node supplied, append to end of list
  insertAfter(newData, prevNode = this.tail) {
    if (prevNode === null) {
      this.append(newData);
      return;
    }

    let newNode = new dLLNode(newData, prevNode, prevNode.next);
    if (prevNode.next) {
      prevNode.next.prev = newNode;
    } else {
      this.tail = newNode;
    }
    prevNode.next = newNode;
  }

  // Insert data into a node before a given node.
  // If no node supplied, prepend to start of list
  insertBefore(newData, nextNode = this.head) {
    if (nextNode === null) {
      this.append(newData);
      return;
    }
    let newNode = new dLLNode(newData, nextNode.prev, nextNode);
    if (nextNode.prev) {
      nextNode.prev.next = newNode;
    } else {
      this.head = newNode;
    }
    nextNode.prev = newNode;
  }

  // Remove a given node from the list
  // Assumes node exists in list and simply uses it's prev/next references to update links
  removeNode(node) {
    let prev = node.prev;
    let next = node.next;
    if (prev) prev.next = next;
    else this.head = next;
    if (next) next.prev = prev;
    else this.tail = prev;
  }

  // Generate a string representing the list, output:
  // data[0] <> data[1] <> data[2] ...
  toString() {
    let current = this.head;
    let s = "";
    while (current !== null) {
      s += (s ? " <> " : "") + current.data.toString();
      current = current.next;
    }
    return s;
  }

  // Display the list to console
  display() {
    console.log(this.toString());
  }
}
