let grid, aStar;

// Define distance functions
let deltaX = (a, b) => Math.abs(a.x - b.x);
let deltaY = (a, b) => Math.abs(a.y - b.y);
let chebyshev = (a, b) => Math.max(deltaX(a, b), deltaY(a, b));
let euclidean = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
let manhatten = (a, b) => deltaX(a, b) + deltaY(a, b);
let geometric = (a, b) => 1 / (1 / chebyshev(a, b) + 1 / euclidean(a, b));

/* **********************************************
  U S E R   D E F I N E D   P A R A M E T E R S

  Edit this to modify simulation
 ************************************************/
let DIAGONALS = true;
let SPEED = 100;
let prob = 0.3;
let WIDTH = 1700;
let HEIGHT = 900;
let SCALE = 5;
let hDIST = chebyshev;
let gDIST = euclidean;

// Draw the canvas
function drawBoundary() {
  background(255);
  push();
  noFill();
  stroke(0);
  rect(0, 0, width - 1, height - 1);
  pop();
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  grid = new Grid(
    int(width / SCALE),
    int(height / SCALE),
    prob,
    DIAGONALS,
    (initialUserData = { fScore: Infinity, gScore: Infinity, cameFrom: null })
  );

  let scale = {
    x: width / grid.Nx,
    y: height / grid.Ny,
    l: int(
      Math.sqrt(1 / (1 / grid.Nx + 1 / grid.Ny)) *
        (1 + 3*(gDIST == chebyshev) - 0.25*(DIAGONALS===false) - 0.5*(gDIST===manhatten))
    )
  };
  aStar = new AStar(
    grid.cells[0][0],
    grid.cells[grid.Nx - 1][grid.Ny - 1],
    gDIST,
    hDIST,
    scale
  );

  drawBoundary();
  grid.display();
}

function draw() {
  // Loop over multiple iterations before actually drawing (speeds up the visualisation)
  for (let n = 0; n < SPEED; n++)
    if (aStar.openSet.head) aStar.iterate();
    else {
      console.log("NO PATH FOUND!");
      noLoop();
      break;
    }

  if (aStar.finalPath.head) {
    aStar.plotFinal();
    console.log("Final Path:" + aStar.finalPath.toString());
    console.log("Estimated score:", aStar.start.userData.fScore);
    console.log("Actual score:", aStar.end.userData.gScore);
    noLoop();
  }
}
