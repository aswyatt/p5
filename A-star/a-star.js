class AStar {
  constructor(start, end, distance, heuristic) {
    let openSet = new DoublyLinkedList();
    openSet.append(start);
    this.openSet = openSet;
    this.closedSet = new DoublyLinkedList();
    this.start = start;
    this.end = end;
    this.evalg = distance;
    this.evalh = heuristic;
    this.start.gScore = 0;
    this.start.fScore = this.evalh(start, end);
  }

  addToOpenSet(cell) {
    if (!this.openSet.head) {
      this.openSet.append(cell);
      return;
    }

    let score = cell.fScore;
    let headScore = this.openSet.head.data.fScore;
    let tailScore = this.openSet.tail.data.fScore;
    if (score < headScore) this.openSet.insertBefore(cell);
    else if (score > tailScore) this.openSet.insertAfter(cell);
    else {
      let current, next, compare;
      if (score <= 0.66 * (headScore + tailScore)) {
        next = nextCell => nextCell.next;
        compare = currentScore => score > currentScore;
        current = this.openSet.head;
      } else {
        next = nextCell => nextCell.prev;
        compare = currentScore => score < currentScore;
        current = this.openSet.tail;
      }
      while (current && compare(current.data.fScore)) current = next(current);
      this.openSet.insertBefore(cell, current);
    }
  }

  addToClosedSet(currentData, neighbourData) {
    // console.log("\nCurrent:", currentData.toString());
    // console.log("Neighbour:", neighbourData.toString());
    // console.log("Initial:"+this.closedSet.toString());

    let currentNode = this.closedSet.findNode(currentData);
    if (currentNode) {
      if (currentNode.next) this.closedSet.removeNode(currentNode.next);
      this.closedSet.insertAfter(neighbourData, currentNode);
    } else {
      this.closedSet.append(currentData);
      this.closedSet.append(neighbourData);
    }
    // console.log("Current Removed:"+this.closedSet.toString());
    // let neighbourNode = this.closedSet.findNode(neighbourData);
    // if (!neighbourNode) {
    //   this.closedSet.append(currentData);
    //   this.closedSet.append(neighbourData);
    //   console.log("No Neighbour:"+this.closedSet.toString());
    // } else {
    //   this.closedSet.insertBefore(currentData, neighbourNode);
    //   console.log("Yes Neighbour:"+this.closedSet.toString());
    // }
  }

  iterate() {
    let current = this.openSet.pop(0).data;

    if (current === this.end) return;

    for (let neighbour of current.neighbours) {
      let score = current.gScore + this.evalg(current, neighbour);
      if (score < neighbour.gScore) {
        this.addToClosedSet(current, neighbour);
        console.log("Closed:" + this.closedSet.toString())
        neighbour.gScore = score;
        neighbour.fScore = score + this.evalh(current, neighbour);
        if (!this.openSet.findNode(neighbour)) this.addToOpenSet(neighbour);
      }
    }
  }

  plotSet(scaleX, scaleY, current, colour) {
    push();
    while (current) {
      let data1 = current.data;
      let x1 = (data1.nx + 0.5) * scaleX;
      let y1 = (data1.ny + 0.5) * scaleY;
      noStroke();
      fill(colour[0], colour[1], colour[2]);
      ellipse(x1, y1, scaleX / 4, scaleY / 4);
      current = current.next;
    }
    pop();
  }

  plotOpen(scaleX, scaleY) {
    this.plotSet(scaleX, scaleY, this.openSet.head, [0, 0, 255]);
  }
  plotClosed(scaleX, scaleY) {
    this.plotSet(scaleX, scaleY, this.closedSet.head, [0, 255, 0]);
  }

  run() {
    while (this.openSet.head) this.iterate();
  }
}
