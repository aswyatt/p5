class AStar {
  constructor(start, end, distance, heuristic) {
    let openSet = new DoublyLinkedList();
    openSet.append(start);
    this.openSet = openSet;
    this.finalPath = new DoublyLinkedList();
    this.closedSet = [];
    this.start = start;
    this.end = end;
    this.evalg = distance;
    this.evalh = heuristic;
    this.start.gScore = 0;
    this.start.fScore = this.evalh(start, end);
  }

  generatePath(currentData) {
    this.finalPath.append(currentData);
    while (currentData !== this.start) {
      let index = this.closedSet.findIndex(obj => obj.data === currentData);
      if (index === -1) break;
      currentData = this.closedSet[index].prev;
      this.finalPath.insertBefore(currentData);
      this.closedSet.splice(index, 1);
    }
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
    let index = this.closedSet.findIndex(obj => obj.data === neighbourData);
    if (index !== -1) {
      this.closedSet[index].prev = currentData;
    } else this.closedSet.push({ data: neighbourData, prev: currentData });
  }

  printClosedSet() {
    for (let [index, obj] of this.closedSet.entries())
      console.log(
        index + ":",
        obj.data.toString() + "<-" + obj.prev.toString()
      );
  }
  iterate() {
    let current = this.openSet.pop(0).data;

    if (current === this.end) {
      this.generatePath(current);
    }

    for (let neighbour of current.neighbours) {
      let score = current.gScore + this.evalg(current, neighbour);
      if (score < neighbour.gScore) {
        this.addToClosedSet(current, neighbour);
        neighbour.gScore = score;
        neighbour.fScore = score + this.evalh(current, neighbour);
        if (!this.openSet.findNode(neighbour)) this.addToOpenSet(neighbour);
      }
    }
  }

  plotSet(scaleX, scaleY, current, colour) {
    while (current) {
      this.plotNode(scaleX, scaleY, current.data, colour);
      current = current.next;
    }
  }

  plotNode(scaleX, scaleY, data1, colour) {
    push();
    let x1 = (data1.nx + 0.5) * scaleX;
    let y1 = (data1.ny + 0.5) * scaleY;
    noStroke();
    fill(colour[0], colour[1], colour[2]);
    ellipse(x1, y1, scaleX / 2, scaleY / 2);
    pop();
  }

  plotOpen(scaleX, scaleY) {
    this.plotSet(scaleX, scaleY, this.openSet.head, [0, 0, 255]);
  }
  plotFinal(scaleX, scaleY) {
    this.plotSet(scaleX, scaleY, this.finalPath.head, [0, 255, 0]);
  }
  plotClosed(scaleX, scaleY) {
    for (let obj of this.closedSet)
      this.plotNode(scaleX, scaleY, obj.data, [0, 255, 255]);
  }

  run() {
    while (this.openSet.head) this.iterate();
  }
}
