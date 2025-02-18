class AStar {
  constructor(start, end, gFun, hFun) {
    let openSet = new DoublyLinkedList();
    openSet.append(start);
    this.openSet = openSet;
    this.finalPath = new DoublyLinkedList();
    // this.closedSet = [];
    this.start = start;
    this.end = end;
    this.evalg = gFun;
    this.evalh = hFun;
    this.start.gScore = 0;
    this.start.fScore = this.evalh(start, end);
    this.openUpdated = false;
    // this.closedUpdated = false;
  }

  generatePath(currentData) {
    this.finalPath.append(currentData);
    while (currentData !== this.start) {
      currentData = currentData.cameFrom;
      this.finalPath.insertBefore(currentData);
      // let index = this.closedSet.findIndex(obj => obj.data === currentData);
      // if (index === -1) break;
      // currentData = this.closedSet[index].prev;
      // this.finalPath.insertBefore(currentData);
      // this.closedSet.splice(index, 1);
    }
  }

  addToOpenSet(cell, plot = false) {
    if (!this.openSet.head) {
      this.openSet.append(cell);
      return;
    }

    let score = cell.fScore;
    let headScore = this.openSet.head.data.fScore;
    let tailScore = this.openSet.tail.data.fScore;
    if (score <= headScore) this.openSet.insertBefore(cell);
    else if (score >= tailScore) this.openSet.insertAfter(cell);
    else {
      let current, next, compare;
      if (score <= 0.5 * (headScore + tailScore)) {
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
    this.openUpdated = true;

    if (plot) {
      // while (cell) {
        // let blue = int(255*Math.exp(-(cell.fScore/this.start.fScore)**2));
        let blue = int(255 * (this.start.fScore / cell.fScore) ** scaleP)
        // let blue = constrain(int(map(
        //   cell.fScore,
        //   this.start.fScore,
        //   this.start.fScore * 1.5,
        //   255,
        //   100
        // )), 0, 255);
        // console.log(blue);
        this.plotNode(cell, [0, 0, constrain(blue, 0, 255)]);
        // cell = cell.cameFrom;
      // }
    }
  }

  // addToClosedSet(currentData, neighbourData) {
  //   let index = this.closedSet.findIndex(obj => obj.data === neighbourData);
  //   if (index !== -1) {
  //     this.closedSet[index].prev = currentData;
  //   } else this.closedSet.push({ data: neighbourData, prev: currentData });
  //   this.closedUpdated = true;
  // }

  // printClosedSet() {
  //   for (let [index, obj] of this.closedSet.entries())
  //     console.log(
  //       index + ":",
  //       obj.data.toString() + "<-" + obj.prev.toString()
  //     );
  // }

  iterate() {
    // this.closedUpdated = false;
    this.openUpdated = false;
    let currentNode = this.openSet.pop(0);
    let currentData = currentNode.data;

    if (currentData === this.end) {
      this.generatePath(currentData);
    }

    this.openSet.removeNode(currentNode);
    for (let neighbour of currentData.neighbours) {
      let score = currentData.gScore + this.evalg(currentData, neighbour);
      if (score < neighbour.gScore) {
        neighbour.cameFrom = currentData;
        // this.addToClosedSet(currentData, neighbour);
        neighbour.gScore = score;
        neighbour.fScore = score + this.evalh(currentData, this.end);
        this.addToOpenSet(neighbour, true);
        // if (!this.openSet.findNode(neighbour)) this.addToOpenSet(neighbour);
      }
    }
  }

  plotSet(currentNode, colour) {
    while (currentNode) {
      this.plotNode(currentNode.data, colour);
      currentNode = currentNode.next;
    }
  }

  plotNode(data1, colour = [0, 0, 0]) {
    push();
    let x1 = (data1.nx + 0.5) * scaleX;
    let y1 = (data1.ny + 0.5) * scaleY;
    noStroke();
    fill(colour[0], colour[1], colour[2]);
    ellipse(x1, y1, scaleX, scaleY);
    pop();
  }

  plotOpen() {
    this.plotSet(this.openSet.head, [0, 0, 255]);
  }

  plotFinal() {
    this.plotSet(this.finalPath.head, [0, 200, 0]);
  }

  // plotClosed(scaleX, scaleY) {
  //   for (let obj of this.closedSet)
  //     this.plotNode(scaleX, scaleY, obj.prev, [255, 0, 255]);
  // }

  run() {
    while (this.openSet.head) this.iterate();
  }
}
