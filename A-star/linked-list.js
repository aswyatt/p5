class dLLNode {
  constructor(data, prev = null, next = null) {
    this.data = data;
    this.next = next;
    this.prev = prev;
  }
}

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

  length() {
    let current = this.head;
    let count = 0;
    while (current !== null) {
      count++;
      current = current.next;
    }
    return count;
  }

  pop(n = null) {
    let current, count, next;
    if (n === null || n < 0) {
      current = this.tail;
      next = node => node.prev;
    } else {
      current = this.head;
      next = node => node.next;
    }

    n = Math.abs(n);
    count = 0;
    while (current !== null && count < n) {
      current = next(current);
      count++;
    }
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

  findNode(data) {
    let current = this.head;
    while (current !== null) {
      if (current.data === data) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

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

  removeNode(node) {
    let prev = node.prev;
    let next = node.next;
    if (prev) prev.next = next;
    else this.head = next;
    if (next) next.prev = prev;
    else this.tail = prev;
  }

  toString() {
    let current = this.head;
    let s = "";
    while (current !== null) {
      s += (s ? " <> " : "") + current.data.toString();
      current = current.next;
    }
    return s;
  }

  // Display the list
  display() {
    console.log(this.toString());
  }
}
