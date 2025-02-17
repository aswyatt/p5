let grid, scaleX, scaleY;
let manhatten = (a, b) =>
  Math.max(Math.abs(a.nx - b.nx), Math.abs(a.ny - b.ny));
let distance = (a, b) => Math.sqrt((a.nx - b.nx) ** 2, (a.ny - b.ny) ** 2);

function drawBoundary() {
  push();
  noFill();
  stroke(0);
  rect(0, 0, width - 1, height - 1);
  pop();
}

function setup() {
  createCanvas(1200, 800);
  grid = new Grid(100, 80, 0.2);
  scaleX = width / grid.Nx;
  scaleY = height / grid.Ny;

  aStar = new AStar(
    grid.cells[0][0],
    grid.cells[grid.Nx - 1][grid.Ny - 1],
    distance,
    manhatten
  );
  background(255);
  drawBoundary();
  grid.display(scaleX, scaleY);
}

function draw() {
  if (aStar.closedSet) aStar.plotClosed(scaleX, scaleY);
  if (aStar.openSet.head) {
    aStar.plotOpen(scaleX, scaleY);
    aStar.iterate();
  } else console.log("NO PATH FOUND!");

  if (aStar.finalPath.head) {
    aStar.plotFinal(scaleX, scaleY);
    console.log("Final Path:" + aStar.finalPath.toString());
    noLoop();
  }
}
