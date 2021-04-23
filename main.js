var radiusRatio = 2; // number that sets the radius relative to the screen
var radius; // variable to store the actual radius in
var backgroundColour;
var onColour = 'rgb(255,255,0)';
var offColour;
var buttonColour;
var buttonState = false;
var whichPlayer; // which of the three possible players are you>?
var breathSample;
var theVolume = -6;
var sampler;

function preload(){
    whichPlayer = getRndInteger(0, 3);
    console.log(`whichPlayer = ${whichPlayer}`)
    if(whichPlayer === 0){
        offColour = 'rgb(255,0,255)';
        backgroundColour ='rgb(150,0,0)';
    }else if(whichPlayer === 1){
        offColour = 'rgb(255,0,255)';
        backgroundColour ='rgb(0,150,0)';
    }else{
        offColour = 'rgb(255,0,255)';
        backgroundColour ='rgb(0,0,150)';
    }
    breathSample = `breath${whichPlayer+1}.flac`
    console.log(`breathSample = ${breathSample}`)
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
            A3: breathSample,
            C1: "speach1.mp3",
            C2: "speach2.mp3",
            C3: "speach3.mp3",
            C4: "speach4.mp3",
            C5: "speach5.mp3",
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
    sampler.triggerAttackRelease("A3", '4n');
    console.log("click");
    buttonColour = onColour;
    setTimeout(() => {
        buttonColour = offColour;
      }, 300);
}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
