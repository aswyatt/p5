let grid, scaleX, scaleY, scaleP, speed;
let chebyshev = (a, b) =>
  Math.max(Math.abs(a.nx - b.nx), Math.abs(a.ny - b.ny));
let distance = (a, b) => Math.sqrt((a.nx - b.nx) ** 2 + (a.ny - b.ny) ** 2);
let manhatten = (a, b) => Math.abs(a.nx - b.nx) + Math.abs(a.ny - b.ny);

// let actualDistance = chebyshev;
// let actualDistance = (a, b) =>1/(1/chebyshev(a,b) + 1/distance(a,b));
let heuristicDistance = chebyshev;
let actualDistance = distance;
// let heuristicDistance = distance;
speed = 10;

let diagonals = false;
function drawBoundary() {
  push();
  noFill();
  stroke(0);
  rect(0, 0, width - 1, height - 1);
  pop();
}

function setup() {
  createCanvas(1700, 900);
  grid = new Grid(int(width / 10), int(height / 10), 0.3, diagonals);
  scaleX = width / grid.Nx;
  scaleY = height / grid.Ny;
  scaleP = int(
    Math.sqrt(1 / (1 / grid.Nx + 1 / grid.Ny)) *
      (1 + (actualDistance !== distance))
  );
  // scaleP = int(
  //   Math.sqrt(1 / (1 / grid.Nx + 1 / grid.Ny)) *
  //     (1 + (actualDistance !== distance) - 0.5 * (actualDistance === distance))
  // );

  aStar = new AStar(
    grid.cells[0][0],
    grid.cells[grid.Nx - 1][grid.Ny - 1],
    actualDistance,
    heuristicDistance
  );
  background(255);
  drawBoundary();
  grid.display();
  count = 0;
}

function draw() {
  // count++;
  for (let n = 0; n < speed; n++)
    if (aStar.openSet.head) aStar.iterate();
    else console.log("NO PATH FOUND!");
  // aStar.plotOpen(scaleX, scaleY);

  // if (!(count % 20)) {
  // aStar.plotClosed(scaleX, scaleY);
  // aStar.plotOpen(scaleX, scaleY);
  // }
  // if (aStar.closedUpdated) aStar.plotClosed(scaleX, scaleY);
  // if (aStar.openUpdated) aStar.plotOpen(scaleX, scaleY);

  if (aStar.finalPath.head) {
    aStar.plotFinal();
    console.log("Final Path:" + aStar.finalPath.toString());
    console.log("Estimated score:", aStar.start.fScore);
    console.log("Actual score:", aStar.end.gScore);
    noLoop();
  }
}
