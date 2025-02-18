let grid, scaleX, scaleY, count;
let chebyshev = (a, b) =>
  Math.max(Math.abs(a.nx - b.nx), Math.abs(a.ny - b.ny));
let distance = (a, b) => Math.sqrt((a.nx - b.nx) ** 2 + (a.ny - b.ny) ** 2);
let manhatten = (a, b) => Math.abs(a.nx - b.nx) + Math.abs(a.ny - b.ny);

function drawBoundary() {
  push();
  noFill();
  stroke(0);
  rect(0, 0, width - 1, height - 1);
  pop();
}

function setup() {
  createCanvas(1200, 800);
  grid = new Grid(240, 160, 0.3, true);
  scaleX = width / grid.Nx;
  scaleY = height / grid.Ny;

  aStar = new AStar(
    grid.cells[0][0],
    grid.cells[grid.Nx - 1][grid.Ny - 1],
    chebyshev,
    chebyshev
  );
  background(255);
  drawBoundary();
  grid.display(scaleX, scaleY);
  count = 0;
}

function draw() {
  count++;
  if (aStar.openSet.head) aStar.iterate();
  else console.log("NO PATH FOUND!");

  if (!(count % 20)) {
    aStar.plotClosed(scaleX, scaleY);
    aStar.plotOpen(scaleX, scaleY);
  }
  // if (aStar.closedUpdated) aStar.plotClosed(scaleX, scaleY);
  // if (aStar.openUpdated) aStar.plotOpen(scaleX, scaleY);

  if (aStar.finalPath.head) {
    aStar.plotFinal(scaleX, scaleY);
    console.log("Final Path:" + aStar.finalPath.toString());
    console.log("Estimated score:", aStar.start.fScore);
    console.log("Actual score:", aStar.end.gScore);
    noLoop();
  }
}
