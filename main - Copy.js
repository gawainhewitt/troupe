var radiusRatio = 1.5; // number that sets the radius relative to the screen
var radius; // variable to store the actual radius in
var backgroundColour = 'rgb(0, 255, 0)';
var onColour = 'rgb(255,255,0)';
var offColour = 'rgb(0, 0, 255)';
var buttonColour;
var buttonState = false;
var whichSpeaker; // which of the samples?
var speechSample; //current sample
var theVolume = -6;
var sampler;


function preload(){
    chooseSample();
}

function chooseSample(){
    whichSpeaker = getRndInteger(1, 23);
    console.log(`whichSpeaker = ${whichSpeaker}`)
    speechSample = `speech${whichSpeaker}.flac`
    console.log(`speechSample = ${speechSample}`)
}

function setup() {  // setup p5

    let masterDiv = document.getElementById("container");
    let divPos = masterDiv.getBoundingClientRect(); //The returned value is a DOMRect object which is the smallest rectangle which contains the entire element, including its padding and border-width. The left, top, right, bottom, x, y, width, and height properties describe the position and size of the overall rectangle in pixels.
    let masterLeft = divPos.left; // distance from left of screen to left edge of bounding box
    let masterRight = divPos.right; // distance from left of screen to the right edge of bounding box
    let cnvDimension = masterRight - masterLeft; // size of div -however in some cases this is wrong, so i am now using css !important to set the size and sca;ing - but have kept this to work out size of other elements if needed
    buttonColour = offColour;

    console.log("canvas size = " + cnvDimension);

    noStroke(); // no stroke on the drawings

    let cnv = createCanvas(windowWidth, windowHeight); // create canvas - because i'm now using css size and !important this is really about the ratio between them, so the second number effects the shape. First number will be moved by CSS
    cnv.id('mycanvas'); // assign id to the canvas so i can style it - this is where the css dynamic sizing is applied
    cnv.parent('p5parent'); //put the canvas in a div with this id if needed - this also needs to be sized

    // *** add vanilla JS event listeners for touch which i want to use in place of the p5 ones as I believe that they are significantly faster
    let el = document.getElementById("p5parent");
    el.addEventListener("click", handleClick);

    setRadius();

    sampler = new Tone.Sampler({
        urls: {
            A3: speechSample,
        },
        baseUrl: "/sounds/",
        // 	onload: () => {
        //     // hideLoadScreen();
        //   }
        volume: theVolume
        }).toDestination();

}

function draw() {
    background(backgroundColour); // background
    imageMode(CENTER);
    fill(buttonColour);
    ellipse(width/2, height/2, radius);
}

function windowResized() {
    setRadius();
    resizeCanvas(windowWidth, windowHeight);
  }

function setRadius() {
    if(height > width){
        radius = width/radiusRatio;
    }else{
        radius = height/radiusRatio;
    }
}

function handleClick() {
    let d = dist(mouseX, mouseY, width/2, height/2);
    if (d < radius/2) {
      buttonPressed();
      buttonState = true;
    }
}

function buttonPressed() {
    sampler.triggerAttackRelease("A3");

    console.log("click");
    buttonColour = onColour;
    setTimeout(() => {
        buttonColour = offColour;
      }, 300);
      //console.log(sampler.dispose());
}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
