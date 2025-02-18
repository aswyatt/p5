// Implementation of a grid of data points suitable for A* algorithm

// Basic grid point object
// neighbours is a list of connected neighbours
// userData is a user-defined object to store additional data
class gridPoint {
  constructor(x, y, neighbours = [], userData = {}) {
    this.x = x;
    this.y = y;
    // this.valid = valid;
    // this.gScore = Infinity;
    // this.fScore = Infinity;
    this.setNeighbours(neighbours);
    this.setUserData(userData);
  }
  setNeighbours(neighbours = []) {
    this.neighbours = neighbours;
  }
  setUserData(userData = {}) {
    this.userData = userData;
  }
  updateUserData(property, value) {
    this.userData[property] = value;
  }

  toString() {
    return "(" + this.x + "," + this.y + ")";
    // return (
    //   "(" +
    //   this.nx +
    //   "," +
    //   this.ny +
    //   "," +
    //   this.fScore +
    //   "," +
    //   this.gScore +
    //   ")"
    // );
  }
}

// Create a Cartesian grid of gridPoints
// prob: probability that the grid is invalid
// diagonals: sets whether connections can be along diagonals
// An invalid gridPoint cannot be connected to other gridPoints
class Grid {
  constructor(Nx, Ny, prob = 0, diagonals = false, initialUserData = {}) {
    this.Nx = Nx;
    this.Ny = Ny;
    this.scale = { x: width / Nx, y: height / Ny };
    this.cells = [];
    this.createGrid(prob, initialUserData);
    this.initializeNeighbours(diagonals);
  }

  // Initialise the grid
  createGrid(prob, initialUserData) {
    for (let nx = 0; nx < this.Nx; nx++) {
      let row = [];
      for (let ny = 0; ny < this.Ny; ny++) {
        let valid =
          (nx === 0 && ny == 0) ||
          (nx === this.Nx - 1 && ny === this.Ny - 1) ||
          Math.random() >= prob;
        row.push(
          new gridPoint(nx, ny, [], { ...initialUserData, valid: valid })
        );
      }
      this.cells.push(row);
    }
  }

  // Initialises the neighbour connections.
  // If diagonals is true, the connections to diagonal cells are allowed
  initializeNeighbours(diagonals) {
    // Loop over every cell
    for (let nx = 0; nx < this.Nx; nx++) {
      for (let ny = 0; ny < this.Ny; ny++) {
        let cell = this.cells[nx][ny];
        if (!cell.userData.valid) continue;
        let neighbours = [];
        // Loop over adjacent cells
        for (let dnx = -1; dnx <= 1; dnx++) {
          for (let dny = -1; dny <= 1; dny++) {
            // Do not include current cell, nor diagonals if not allowed
            if (
              (diagonals && dnx === 0 && dny === 0) ||
              (!diagonals && Math.abs(dnx) === Math.abs(dny))
            )
              continue;
            let nx2 = nx + dnx;
            let ny2 = ny + dny;
            let valid = nx2 >= 0 && nx2 < this.Nx && ny2 >= 0 && ny2 < this.Ny;
            valid = valid && this.cells[nx2][ny2].userData.valid;
            if (valid) neighbours.push(this.cells[nx2][ny2]);
          }
        }
        cell.setNeighbours(neighbours);
      }
    }
  }

  // Display the grid to the canvas as red ellipses
  // If connections is true, will also plot line to neighbours
  display(connections = false) {
    push();
    for (let row of this.cells)
      for (let cell of row) {
        let x1 = (cell.x + 0.5) * this.scale.x;
        let y1 = (cell.y + 0.5) * this.scale.y;
        // Small red spot if valid, otherwise larger black spot
        if (cell.userData.valid) {
          // Optionally draw connecting lines
          if (connections)
            for (let n of cell.neighbours) {
              let x2 = (n.x + 0.5) * this.scale.x;
              let y2 = (n.y + 0.5) * this.scale.y;
              stroke(255, 0, 0);
              strokeWeight(0.1);
              line(x1, y1, x2, y2);
            }
          // Current point
          fill(255, 0, 0);
          noStroke();
          ellipse(x1, y1, this.scale.x / 3, this.scale.y / 3);
        } else {
          fill(0);
          noStroke();
          ellipse(x1, y1, this.scale.x / 1.5, this.scale.y / 1.5);
        }
      }
    pop();
  }
}
