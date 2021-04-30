//why am i getting away without having tone.start?

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
const player = new Tone.Player().toDestination();
const toneWaveForm = new Tone.Waveform();
player.connect(toneWaveForm);
var buffer1;
var interfaceState = 0; // 0 displays the text loading, 1 is a button, 2 is a visualisation of the sound
var lastSound;
var cnvDimension;


function preload(){
    chooseSample();
}

function setup() {  // setup p5

    let masterDiv = document.getElementById("container");
    let divPos = masterDiv.getBoundingClientRect(); //The returned value is a DOMRect object which is the smallest rectangle which contains the entire element, including its padding and border-width. The left, top, right, bottom, x, y, width, and height properties describe the position and size of the overall rectangle in pixels.
    let masterLeft = divPos.left; // distance from left of screen to left edge of bounding box
    let masterRight = divPos.right; // distance from left of screen to the right edge of bounding box
    cnvDimension = masterRight - masterLeft; // size of div -however in some cases this is wrong, so i am now using css !important to set the size and sca;ing - but have kept this to work out size of other elements if needed
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

    player.set(
        {
          "mute": false,
          "volume": 0,
          "autostart": false,
          "fadeIn": 0,
          "fadeOut": 0,
          "loop": false,
          "playbackRate": 1,
          "reverse": false,
          "onstop": reload
        }
      );
}

function draw() {
    background(backgroundColour); // background
    //imageMode(CENTER);
    if(interfaceState === 0){
        fill(buttonColour);
        rect(width/2 - radius/2, height/2 - radius/4, radius, radius/2);
        fill(150);
        textAlign(CENTER, CENTER);
        textSize(cnvDimension/20);
        text("Loading", width/2, height/2);
    }
    if(interfaceState === 1){
        fill(buttonColour);
        ellipse(width/2, height/2, radius);
    }if(interfaceState === 2){
        text("Audio Visualisation", width/2, height/2);
        console.log(toneWaveForm.getValue());
    }
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
    if(interfaceState === 1){
        let d = dist(mouseX, mouseY, width/2, height/2);
        if (d < radius/2) {
            buttonPressed();
            buttonState = true;
        }
    }
}

function buttonPressed() {
    player.start();
    console.log("click");
    interfaceState = 2;
    }


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  function chooseSample(){
    do{
        whichSpeaker = getRndInteger(1, 23);
    }while(whichSpeaker === lastSound);

    console.log(`whichSpeaker = ${whichSpeaker}`)
    speechSample = `speech${whichSpeaker}.flac`
    console.log(`speechSample = ${speechSample}`)
    buffer1 = new Tone.ToneAudioBuffer(`/sounds/${speechSample}`, () => {
        console.log("loaded");
        player.buffer = buffer1.get();
        interfaceState = 1;
    })

}

function reload() {
    buffer1.dispose();
    chooseSample();
    interfaceState = 0;
}
