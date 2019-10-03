//This is a quadrant based interaction
// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */
//below some variables that will later be used by ML5js are being called.
let video;
let poseNet;
let poses = [];
let leftEyeX = 0;
let leftEyeY = 0;
let rightEyeX = 0;
let rightEyeY = 0;
let noseX = 0;
let noseY = 0;
let rightHandX = 0;
let rightHandY = 0;
let leftHandX = 0;
let leftHandY = 0;
let leftElbowX = 0;
let leftElbowY = 0;
let rightElbowX = 0;
let rightElbowY = 0;
let recInterval = 1000;
let conditionNoseX = 0;
let conditionNoseY = 0;
let nodNo = 0;
let nodYes = 0;
let screen = 0;

// U I 
//Here are the precalcalculations called to estimate screensize, and just general pose and interaction variables
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

var speechBubble = document.getElementById('speechBubble');
var explainContainer = document.getElementsByClassName('explaincontainer');
//initialisation of variables
var distanceEyes, distanceFace, distancePointLeft, distancePointRight, reactDistance,
nose, hand, hand2, wrist, wrist2, leftHandXEst, leftHandYEst, laptopEst, mirrorEst,
leftHandXEstimation, leftHandYEstimation, rightHandXEstimation, rightHandXEstimation,
virtualScreenWidth, virtualScreenHeight, gridHeight, gridWidth, gridX, gridY,
startPointCalc, conditionLHandX, conditionLHandY, conditionRHandX, conditionRHandY,
differenceNoseX, differenceNoseY, gesture;

//presets for the grid and animation trigger
var responseGrid = [];
var played = false;

console.log('this application runs on ML5 version:', ml5.version);

//Sets up some variables for ML5js to use, like webcam input
function setup() {
    var canvas = createCanvas(screenWidth, screenHeight);
    canvas.parent('canvascontainer');
    video = createCapture(VIDEO);
    
    video.position(0,-200);
    video.size(width, height);

    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', gotPoses);
    // Hide the video element, and just show the canvas
    video.hide();

    //Calculate a fitting grid for the full screen
    for(var i = 0; i < columns; i++){
        responseGrid[i] = []
        for(var j = 0; j < rows; j++){
            responseGrid[i][j] = [];

            gridX = i * dotWidth;
            gridY = j * dotWidth;
        }
    }
}

//NOTE TO SELF: Should this be deleted? it is still called in line 54 tho...
function modelReady() {
    console.log("Posenet loaded")
}

function gotPoses(poses){
    //Assigns variables to pose data. NOTE TO SELF: how can this be written for multiple users?
    if (poses.length > 0) {
    rightHandX = (poses[0].pose.keypoints[10].position.x);
    rightHandY = (poses[0].pose.keypoints[10].position.y);

    leftHandX = (poses[0].pose.keypoints[9].position.x);
    leftHandY = (poses[0].pose.keypoints[9].position.y);

    leftElbowX = (poses[0].pose.keypoints[7].position.x);
    leftElbowY = (poses[0].pose.keypoints[7].position.y);
    rightElbowX = (poses[0].pose.keypoints[8].position.x);
    rightElbowY = (poses[0].pose.keypoints[8].position.y);
    
    noseX = (poses[0].pose.keypoints[0].position.x);
    noseY = (poses[0].pose.keypoints[0].position.y);
    
    leftEyeX = (poses[0].pose.keypoints[1].position.x);
    leftEyeY = (poses[0].pose.keypoints[1].position.y);
    rightEyeX = (poses[0].pose.keypoints[2].position.x);
    rightEyeY = (poses[0].pose.keypoints[2].position.y);
    }
}

function calculate(){
    //hand estimation for LAPTOP screenSize or MIRROR... not responsive yet!
    laptopEst = 370;
    mirrorEst = (screenHeight*(distanceEyes/100));//NOTE TO SELF: these should be influenced by the position of handY's ONLY WORKS FOR LEFT HAND NOW
    leftHandXEstimation = (leftHandX + distancePointLeft);
    leftHandYEstimation = ((leftHandY*2) - mirrorEst);
    rightHandXEstimation = (rightHandX + distancePointRight);
    rightHandYEstimation = ((rightHandY*2) - mirrorEst);
    //these lines estimate the way user points. NOTE TO SELF: could use some tweaking!
    distancePointLeft = (leftHandX  - leftElbowX);
    distancePointRight = (rightHandX  - rightElbowX);

    distanceEyes = int(dist(leftEyeX, leftEyeY, rightEyeX, rightEyeY));
    distanceFace = int(dist(leftEyeX, leftEyeY, noseX, rightEyeX, rightEyeY, noseY));//NOTE TO SELF: stille necessary?
    
    fill(255,255,255);
    hand = ellipse(leftHandXEstimation, leftHandYEstimation, (2*distanceEyes), (2*distanceEyes));
    // NOTE TO SELF: Could use some improvement. (same with wrist2)
    // fill(255,0,0);
    hand2 = ellipse(rightHandXEstimation, rightHandYEstimation, (2*distanceEyes), (2*distanceEyes));

    wrist = ellipse(leftHandX, leftHandY, 10, 10);
    wrist2 = ellipse(rightHandX, rightHandY, 10, 10);

    nose = ellipse(noseX, noseY, 30, 30);

    virtualSize = 0.002 * distanceEyes;
    virtualScreenWidth = virtualSize * screenWidth;
    virtualScreenHeight = virtualSize * screenHeight;
}
//G E S T U R E    F U N C T I O N S
//creating reference points for gestures
function startPoint(){
    conditionNoseX = noseX;
    conditionNoseY = noseY;

    nodYes = 0;
    nodNo = 0;

    conditionLHandX = leftHandXEstimation;
    conditionLHandY = leftHandYEstimation;
    conditionRHandX = rightHandXEstimation;
    conditionRHandY = rightHandYEstimation;
}
setInterval(startPoint, recInterval);

//This function resets the gesture every 2 seconds.
function resetGesture(){
    if( gesture !=null)
    setTimeout(() => {
        gesture = null;
    }, 2000);
}
setInterval(resetGesture, 2000);

//Animations after gesture
function gestureAnime(){
    //Trigger gesture (verplaatst deze wellicht naar nodrec() )
    if(gesture == 'n'){
        noddingN.play();
        
        if screen == 1{
            screen = 2;
        }

        if screen == 2{
            screen = 3;
        }

        if screen == 3{
            screen = 4;
        }
    }
    if(gesture == 'y'){
        noddingY.play();   
    }
}

//NODDING
function nodRec(){ 
    differenceNoseY = Math.abs(conditionNoseY-noseY);
    differenceNoseX = Math.abs(conditionNoseX-noseX);
    if(!conditionNoseX){
        console.log('no stuff to work with!');
    }else{
        // console.log('searching for nods');
        //YES
        if (differenceNoseY >= (distanceEyes/4)){//was /4
            nodYes = 1;
            console.log('step one Y');
        }
        if (differenceNoseY >= 150){
            nodYes == 0;
        }
        if (nodYes == 1){
            if(differenceNoseY <= 50){
                nodYes = 2;
                gesture = 'y';
            }
        }
        if (nodYes == 2){
            console.log("I saw a Yes ", nodYes);
        }
        //NO 50
        if (differenceNoseX >= (distanceEyes/2)){//was /2
            nodNo = 1;
            console.log('step one N');

        }
        if (differenceNoseX >= 150){
            nodNo == 0;
        }
        if (nodNo == 1){
            if(differenceNoseX <= 25){
                nodNo = 2;
                gesture = 'n';
            }
        }
        if (nodNo == 2){
            console.log("I saw a NO ", nodNo);
        }
    }
}

function scenario(){
    if(screen == 0){
        speechBubble.classList.add('hide');
        // explainContainer.classList.add('hide');
    }
    if(screen == 1){
        speechBubble.classList.remove('hide');
        speechBubble.innerHTML = "Hey.. Is that you Frank?";
    }
//no answers
    if(screen == 2){
        speechBubble.classList.remove('hide');
        speechBubble.innerHTML = "You gotta be kidding... You look like him!";
    }

    if(screen == 3){
        speechBubble.classList.remove('hide');
        speechBubble.innerHTML = "Anyway, you've got a invitation for a meeting next friday. Do you want me to accept?";
    }

    if(screen == 4){
        speechBubble.classList.remove('hide');
        speechBubble.innerHTML = "Too late, You are expected in Leuven next Friday at 12:00. Have a good day Frank!";
    }
//yes answers
    if(screen == 5){
        speechBubble.classList.remove('hide');
        speechBubble.innerHTML = "Great! You are expected in Leuven next Friday at 12:00. Have a good day Frank!";
    }
    if(screen == 5){
        speechBubble.classList.remove('hide');
        speechBubble.innerHTML = "Great! You are expected in Leuven next Friday at 12:00. Have a good day Frank!";
    }
    if(screen == 5){
        speechBubble.classList.remove('hide');
        speechBubble.innerHTML = "Great! You are expected in Leuven next Friday at 12:00. Have a good day Frank!";
    }
}

//function draw is a P5 loop that updates the canvas. It is in this function where the poses are estimated, because a new image is being drawn from the input of the webcam.
function draw() {
    clear();
    image(video, 0, 0, width, height);
    calculate();

    rect(conditionNoseX, conditionNoseY, 20, 20);
    rect(conditionLHandX, conditionLHandY, 20, 20);
    rect(conditionRHandX, conditionRHandY, 20, 20);

    //NOTE TO SELF: background(0) seems to stopped working. Fix this ASAP for testing!
    // background(0);

    //code below triggers the functionality if users are nearby enough, so users from faraway cannot influence the mirror.
    if (distanceEyes > 50 && distanceEyes < 150){
        drawGrid();
        nodRec();
        gestureAnime();
        scenario();
        screen = 1;
        if (!played){
            hiAnimation.play();
            played = true;
        }
    }else{
        played = false;
    }
    //console log commented for eventual use
    if (gesture != null){
        console.log(gesture);
    }
}