class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    // Add a node to the end of the list
    append(data) {
        let newNode = new Node(data);

        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
    }

    pop(n = null) {
        let current, count, first, last, prev, next, nextNode, prevNode;
        // Start from tail if n is null or negative
        if (n === null || n < 0) {
            first = "tail";
            last = "head";
            prev = "next";
            next = "prev";
        } else {
            first = "tail";
            last = "head";
            prev = "prev";
            next = "next";
        }

        current = this[first];
        count = 0;
        n = Math.abs(n);

        while (current !== null && count < n) {
            current = current[incr];
            count++;
        }
        if (current) {
            prevNode = current[prev];
            nextNode = current[next];
            if (prevNode) {
                prevNode[next] = nextNode;
            } else {
                this[first] = nextNode;
            }
            if (nextNode) {
                nextNode[prev] = prevNode;
            } else {
                this[last] = prevNode;
            }
        }
        return current;
    }

    pop1(n = null) {
        if (this.head === null) {
            return null;
        }

        let current, count;

        if (n === null || n >= 0) {
            // Start from head if n is null or non-negative
            current = this.head;
            count = 0;
            while (current !== null && count < (n === null ? Infinity : n)) {
                current = current.next;
                count++;
            }
        } else {
            // Start from tail if n is negative
            current = this.tail;
            count = -1;
            while (current !== null && count > n) {
                current = current.prev;
                count--;
            }
        }

        if (current !== null) {
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
            return current;
        }
        return null;
    }


    // New pop function
    pop2(n = null) {
        if (this.head === null) {
            return null;
        }

        if (n === null) {
            // Remove the last node
            let poppedNode = this.tail;
            if (this.tail.prev) {
                this.tail = this.tail.prev;
                this.tail.next = null;
            } else {
                this.head = null;
                this.tail = null;
            }
            return poppedNode;
        } else if (n >= 0) {
            // Remove the nth node from the start
            let current = this.head;
            let count = 0;
            while (current !== null && count < n) {
                current = current.next;
                count++;
            }
            if (current !== null) {
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
                return current;
            }
        } else {
            // Remove the nth node from the end
            let current = this.tail;
            let count = -1;
            while (current !== null && count > n) {
                current = current.prev;
                count--;
            }
            if (current !== null) {
                if (current.next) {
                    current.next.prev = current.prev;
                } else {
                    this.tail = current.prev;
                }
                if (current.prev) {
                    current.prev.next = current.next;
                } else {
                    this.head = current.next;
                }
                return current;
            }
        }
        return null;
    }

    // Display the list
    display() {
        let current = this.head;
        while (current !== null) {
            console.log(current.data);
            current = current.next;
        }
    }
}