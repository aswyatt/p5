let classifier;
let img;
let label = "";
let confidence = "";

function preload() {
    classifier = ml5.imageClassifier("MobileNet");
    img = loadImage("images/car.png");
}

function setup() {
    createCanvas(640, 480);
    console.log("Hello, World!");
    console.log(ml5.version);
    classifier.classify(img, gotResult);
    image(img, 0, 0, width, height, 0, 0, img.width, img.height, CONTAIN);
}


function gotResult(results) {
  console.log(results);

  fill(255);
  stroke(0);
  textSize(18);
  label = "Label: " + results[0].label;
  confidence = "Confidence: " + nf(results[0].confidence, 0, 2);
  text(label, 10, 360);
  text(confidence, 10, 380);
}
