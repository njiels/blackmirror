//This is a quadrant based interaction
// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let rightHandX = 0;
let rightHandY = 0;
let leftHandX = 0;
let leftHandY = 0;
let leftElbowX = 0;
let leftElbowY = 0;
let rightElbowX = 0;
let rightElbowY = 0;
let noseX = 0;
let noseY = 0;

let leftEyeX = 0;
let leftEyeY = 0;
let rightEyeX = 0;
let rightEyeY = 0;

//screen
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var webcamHeight= screenWidth * 0.5625;
var distanceEyes, distanceFace, distance, distanceVS, distancePointLeft, distancePointRight, reactDistance,
nose, hand, hand2, wrist, wrist2, leftHandXLaptop, leftHandYLaptop, rightHandXLaptop, rightHandYLaptop,
virtualScreenWidth, virtualScreenHeight, gridHeight, gridWidth, gridX, gridY;
var screen = "onboarding";

//Get position of 
var offsets = document.getElementById('testwidget').getBoundingClientRect();
var topOffset = offsets.top;
var leftOffset = offsets.left;

var mirror = screenWidth - leftOffset;

//Graphics of ...
var responseGrid = [];
var played = false;

console.log('ml5 version:', ml5.version);

function setup() {
    var canvas = createCanvas(screenWidth, screenHeight);
    canvas.parent('canvascontainer');
    video = createCapture(VIDEO);
    
    video.position(0,-200);
    video.size(width, height);
    //translate(width,0); // move to far corner

    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', gotPoses);
    // Hide the video element, and just show the canvas
    video.hide();

    //Grid
    for(var i = 0; i < columns; i++){
        responseGrid[i] = []
        for(var j = 0; j < rows; j++){
            responseGrid[i][j] = [];

            gridX = i * dotWidth;
            gridY = j * dotWidth;
        }
    }
}

function modelReady() {
}

function getStartTime(){
    getTime();
}

function gotPoses(poses){
    // console.log(poses);
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
    leftHandXLaptop = (leftHandX + distancePointLeft);
    leftHandYLaptop = (leftHandY- 370);

    rightHandXLaptop = (rightHandX + distancePointRight);
    rightHandYLaptop = (rightHandY - 370);

    distancePointLeft = (leftHandX  - leftElbowX);
    distancePointRight = (rightHandX  - rightElbowX);

    distanceEyes = int(dist(leftEyeX, leftEyeY, rightEyeX, rightEyeY));
    distanceFace = int(dist(leftEyeX, leftEyeY, noseX, rightEyeX, rightEyeY, noseY));

    distanceVS = 1 * distanceEyes;
    distance = 5.5 * distanceEyes;
    
    fill(0,0,255);
    hand = ellipse(rightHandXLaptop, rightHandYLaptop, 20, 20);
    fill(255,0,0);
    hand2 = ellipse(leftHandXLaptop, leftHandYLaptop, 20, 20);
    //hand2 = ellipse((leftHandX), (leftHandY), 20, 20);
    wrist = ellipse(leftElbowX, leftElbowY, 10, 10);
    wrist2 = ellipse(rightHandX, rightHandY, 10, 10);

    fill(255,255,255);
    nose = ellipse(noseX, noseY, 30, 30);

    virtualSize = 0.002 * distanceEyes;
    virtualScreenWidth = virtualSize * screenWidth;
    virtualScreenHeight = virtualSize * screenHeight;
    //console.log(distancePointLeft);
}

function drawgraphics(){
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < columns; j++){
            gridX = i * dotWidth;
            gridY = j * dotWidth;
            stroke(255,255,255);
            fill(255,255,255,5);
            rect(gridX,gridY,dotWidth, dotWidth);
        }
    }
}

function selectControls(){
    reactDistance = dist(leftHandXLaptop, leftHandYLaptop, mirror, topOffset); 
    //Draw a mirror button on screen
    fill(255)
    rect(mirror,topOffset, -200, 200);
    console.log(reactDistance)
    
    if(reactDistance <= 300){
        textSelect.play();
        //played = true;
        console.log('CLICK');
    }else{
        //played = false;
    }
}

function draw() {
    clear();
    //translate(width,0); // move to far corner
    //scale(-1.0,1.0);    // flip x-axis backwards

    image(video, 0, 0, width, height);
    calculate();

    //translate(width,0); // move to far corner
    //scale(-1.0,1.0);    // flip x-axis backwards
    //background(0);

    if (distanceEyes > 50 && distanceEyes < 150){
        drawgraphics();
        selectControls();
        if (!played){
            hiAnimation.play();
            played = true;
        }
    }else{
        played = false;
    }
}
    
console.log("left: " + leftOffset + " top: " + topOffset);