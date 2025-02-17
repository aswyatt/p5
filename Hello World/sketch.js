let x, y, dx, dy;

function setup() {
    createCanvas(600, 400);
    x = 1;
    y = 1;
    dx = 4;
    dy = 2;
}

function draw() {
    background(200);
    stroke(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Hello, World!", width/2, height/2);
    fill(0, 0, 0);
    circle(x, y, 5);
    if (x >= width || x <= 0) {
        dx *= -1;
    }
    if (y >= height || y <= 0) {
        dy *= -1;
    }
    x += dx;
    y += dy;
}
