/* 
  A-STAR PATH FINDING ALGORITHM

  AStar class implements pseudo code from Wikipedia (see below).
  The open set is implemented as a doubly linked list, with items sorted from shortest distance to highest.

  ****************************************************************************
    function reconstruct_path(cameFrom, current)
        total_path := {current}
        while current in cameFrom.Keys:
            current := cameFrom[current]
            total_path.prepend(current)
        return total_path

    // A* finds a path from start to goal.
    // h is the heuristic function. h(n) estimates the cost to reach goal from node n.
    function A_Star(start, goal, h)
        // The set of discovered nodes that may need to be (re-)expanded.
        // Initially, only the start node is known.
        // This is usually implemented as a min-heap or priority queue rather than a hash-set.
        openSet := {start}

        // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
        // to n currently known.
        cameFrom := an empty map

        // For node n, gScore[n] is the currently known cost of the cheapest path from start to n.
        gScore := map with default value of Infinity
        gScore[start] := 0

        // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
        // how cheap a path could be from start to finish if it goes through n.
        fScore := map with default value of Infinity
        fScore[start] := h(start)

        while openSet is not empty
            // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
            current := the node in openSet having the lowest fScore[] value
            if current = goal
                return reconstruct_path(cameFrom, current)

            openSet.Remove(current)
            for each neighbor of current
                // d(current,neighbor) is the weight of the edge from current to neighbor
                // tentative_gScore is the distance from start to the neighbor through current
                tentative_gScore := gScore[current] + d(current, neighbor)
                if tentative_gScore < gScore[neighbor]
                    // This path to neighbor is better than any previous one. Record it!
                    cameFrom[neighbor] := current
                    gScore[neighbor] := tentative_gScore
                    fScore[neighbor] := tentative_gScore + h(neighbor)
                    if neighbor not in openSet
                        openSet.add(neighbor)

        // Open set is empty but goal was never reached
        return failure
  ****************************************************************************

*/
class AStar {
  /* Implementation of A* path finding algorithm

    start and end are user-defined objects that require the following properties:
      x, y
      userData: valid, gScore, fScore, cameFrom

      Object keeps track of start and end of path, as well as function for evaluating actual distance and heuristic distance.
      The openSet contains locations that should be evaluated.
      The finalPath is only generated after succesfully reaching the end point.
  */
  constructor(start, end, gFun, hFun, scale = { x: 1, y: 1, l: 1 }) {
    this.openSet = new DoublyLinkedList();
    this.openSet.append(start);
    this.finalPath = new DoublyLinkedList();
    this.scale = scale;
    this.evalg = gFun;
    this.evalh = hFun;
    start.userData.gScore = 0;
    start.userData.fScore = hFun(start, end);
    this.start = start;
    this.end = end;
  }

  // Generate the final path, starting from the end and using the cameFrom reference to add the previous point
  generatePath(currentPoint) {
    this.finalPath.append(currentPoint);
    while (currentPoint !== this.start) {
      currentPoint = currentPoint.userData.cameFrom;
      this.finalPath.insertBefore(currentPoint);
    }
  }

  /* Adds a new point to the openSet, which is ordered from shortest estimated distance
      If the new point is the shortest, simply add to the start.
      If the new point is the longest, simply add to the end.
      If in-between, then guess whether it is closer to the head or tail and search through the list from there
  */
  addToOpenSet(cell, plotNode = false) {
    // Check if openSet is empty
    if (!this.openSet.head) {
      this.openSet.append(cell);
      return;
    }

    // Perform simple checks first
    let score = cell.userData.fScore;
    let headScore = this.openSet.head.data.userData.fScore;
    let tailScore = this.openSet.tail.data.userData.fScore;
    if (score <= headScore) this.openSet.insertBefore(cell);
    else if (score >= tailScore) this.openSet.insertAfter(cell);
    else {
      // Determine whether to start search at head or tail
      let currentNode, next, compare;
      if (score <= 0.5 * (headScore + tailScore)) {
        next = nextCell => nextCell.next;
        compare = currentScore => score > currentScore;
        currentNode = this.openSet.head;
      } else {
        next = nextCell => nextCell.prev;
        compare = currentScore => score < currentScore;
        currentNode = this.openSet.tail;
      }
      // Find location to insert
      while (currentNode && compare(currentNode.data.userData.fScore))
        currentNode = next(currentNode);
      this.openSet.insertAfter(cell, currentNode);
    }

    // Plot the node as blue/red with the colour depending on the score
    if (plotNode) {
      let c =
        (this.start.userData.fScore / cell.userData.fScore) ** this.scale.l;
      c = int(255 * c);
      let r = constrain(c, 0, 255);
      let b = constrain(255 - 0.9*c, 0, 255);
      this.plotNode(cell, { r: r, g: 0, b: b });
    }
  }

  // Implementation of A* step
  iterate() {
    let currentNode = this.openSet.pop(0);
    // if (!currentNode) return;

    let currentData = currentNode.data;

    // Check if we are done
    if (currentData === this.end) {
      this.generatePath(currentData);
    }

    // Remove current node from openSet, but it may get re-inserted
    // this.openSet.removeNode(currentNode);
    for (let neighbour of currentData.neighbours) {
      let score =
        currentData.userData.gScore + this.evalg(currentData, neighbour);
      if (score < neighbour.userData.gScore) {
        // Better score --> update information
        neighbour.userData.cameFrom = currentData;
        neighbour.userData.gScore = score;
        neighbour.userData.fScore = score + this.evalh(currentData, this.end);
        // Only need to add if it does not exist, but adding anyway is probably quicker than searching if it is in the list.
        // Could add a flag to determine if it is in the openSet, which would speed it up.
        this.addToOpenSet(neighbour, true);
        // if (!this.openSet.findNode(neighbour)) this.addToOpenSet(neighbour, true);
      }
    }
  }

  plotNode(data, colour = { r: 0, g: 0, b: 0 }) {
    push();
    let x = (data.x + 0.5) * this.scale.x;
    let y = (data.y + 0.5) * this.scale.y;
    noStroke();
    fill(colour.r, colour.g, colour.b);
    ellipse(x, y, this.scale.x, this.scale.y);
    pop();
  }

  plotFinal() {
    this.plotSet(this.finalPath.head, { r: 0, g: 200, b: 0 });
  }

  /* No-longer used */
  plotSet(currentNode, colour) {
    while (currentNode) {
      this.plotNode(currentNode.data, colour);
      currentNode = currentNode.next;
    }
  }

  plotOpen() {
    this.plotSet(this.openSet.head, { r: 0, g: 0, b: 255 });
  }

  run() {
    while (this.openSet.head) this.iterate();
  }
}
