class gridPoint {
  constructor(nx, ny, valid = true, neighbours = []) {
    this.nx = nx;
    this.ny = ny;
    this.valid = valid;
    this.gScore = Infinity;
    this.fScore = Infinity;
    this.setNeighbours(neighbours);
  }
  setNeighbours(neighbours = []) {
    this.neighbours = neighbours;
  }

  toString() {
    return (
        "(" +
        this.nx +
        "," +
        this.ny +
        ")"
      );
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

class Grid {
  constructor(Nx, Ny, prob = 0) {
    this.Nx = Nx;
    this.Ny = Ny;
    this.cells = [];
    this.createGrid(prob);
    this.initializeNeighbours();
  }

  createGrid(prob = 0) {
    for (let nx = 0; nx < this.Nx; nx++) {
      let row = [];
      for (let ny = 0; ny < this.Ny; ny++) {
        let valid =
          (nx === 0 && ny == 0) ||
          (nx === this.Nx - 1 && ny === this.Ny - 1) ||
          Math.random() >= prob;
        row.push(new gridPoint(nx, ny, valid));
      }
      this.cells.push(row);
    }
  }

  initializeNeighbours() {
    for (let nx = 0; nx < this.Nx; nx++) {
      for (let ny = 0; ny < this.Ny; ny++) {
        let cell = this.cells[nx][ny];
        if (!cell.valid) continue;
        let neighbours = [];
        for (let dnx = -1; dnx <= 1; dnx++) {
          for (let dny = -1; dny <= 1; dny++) {
            if (Math.abs(dnx) === Math.abs(dny)) continue;
            let nx2 = nx + dnx;
            let ny2 = ny + dny;
            if (
              nx2 >= 0 &&
              nx2 < this.Nx &&
              ny2 >= 0 &&
              ny2 < this.Ny &&
              this.cells[nx2][ny2].valid
            )
              neighbours.push(this.cells[nx2][ny2]);
          }
        }
        cell.setNeighbours(neighbours);
      }
    }
  }

  display(scaleX, scaleY) {
    push();
    for (let row of this.cells) {
      for (let cell of row) {
        let x1 = (cell.nx + 0.5) * scaleX;
        let y1 = (cell.ny + 0.5) * scaleY;
        if (cell.valid) {
          for (let n of cell.neighbours) {
            let x2 = (n.nx + 0.5) * scaleX;
            let y2 = (n.ny + 0.5) * scaleY;
            stroke(255, 0, 0);
            strokeWeight(1);
            line(x1, y1, x2, y2);
            fill(255, 0, 0);
            noStroke();
            ellipse(x1, y1, 5, 5);
          }
        } else {
          fill(0);
          noStroke();
          ellipse(x1, y1, scaleX / 4, scaleY / 4);
        }
      }
    }
    pop();
  }
}
