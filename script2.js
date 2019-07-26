//This is a point based interaction
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
var distanceEyes, distanceFace, distanceVS, distance, nose, hand, hand2, virtualSize, distanceVS,
virtualScreenWidth, virtualScreenHeight, pointB, pointD, pointOriginX, pointOriginY, pointOriginXEnd, pointOriginYEnd;
var screen = "onboarding";

//Get position of 
var offsets = document.getElementById('testwidget').getBoundingClientRect();
var topOffset = offsets.top;
var leftOffset = offsets.left;

var played = false;

console.log('ml5 version:', ml5.version);

function setup() {
    var canvas = createCanvas(screenWidth, screenHeight);
    canvas.parent('canvascontainer');
    video = createCapture(VIDEO);
    video.size(width, webcamHeight);

    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', gotPoses);
    // Hide the video element, and just show the canvas
    video.hide();
}

function modelReady() {
}

function gotPoses(poses){
    // console.log(poses);
    if (poses.length > 0) {
    rightHandX = (poses[0].pose.keypoints[10].position.x);
    rightHandY = (poses[0].pose.keypoints[10].position.y);

    leftHandX = (poses[0].pose.keypoints[9].position.x);
    leftHandY = (poses[0].pose.keypoints[9].position.y);
    
    noseX = (poses[0].pose.keypoints[0].position.x);
    noseY = (poses[0].pose.keypoints[0].position.y);
    
    leftEyeX = (poses[0].pose.keypoints[1].position.x);
    leftEyeY = (poses[0].pose.keypoints[1].position.y);
    rightEyeX = (poses[0].pose.keypoints[2].position.x);
    rightEyeY = (poses[0].pose.keypoints[2].position.y);
    }
}

function calculate(){
    distanceEyes = int(dist(leftEyeX, leftEyeY, rightEyeX, rightEyeY));
    distanceFace = int(dist(leftEyeX, leftEyeY, noseX, rightEyeX, rightEyeY, noseY));

    virtualSize = 0.002 * distanceEyes;
    distanceVS = 2 * distanceEyes;
    virtualScreenWidth = virtualSize * screenWidth;
    virtualScreenHeight = virtualSize * screenHeight;

    pointOriginX = noseX - (virtualScreenWidth);
    pointOriginXEnd = noseX + (virtualScreenWidth);
    pointOriginY = (noseY +  distanceVS) - (virtualScreenHeight);
    pointOriginYEnd = (noseY + distanceVS) + (virtualScreenHeight);
}
function drawgraphics(){
    //test buttons
    hand = ellipse(rightHandX, rightHandY, 10, 10);
    hand2 = ellipse(leftHandX, leftHandY, 10, 10);
    fill(140,140,140);
    nose = ellipse(noseX, noseY, 0, 0);

    //Virtual Field
    rectMode(CENTER);
    rect(noseX, (noseY + distanceVS), (virtualScreenWidth * 2), (virtualScreenHeight * 2));

    fill(0,0,250);
    ellipse(pointOriginX, pointOriginY, 10, 10);
    fill(250,0,0);
    ellipse(pointOriginX, pointOriginYEnd, 10, 10);
    fill(0,250,0);
    ellipse(pointOriginXEnd, pointOriginY, 10, 10);

    ellipse((pointOriginXEnd-(leftOffset*(virtualSize*2))), (pointOriginY+(topOffset*(virtualSize*2))),200,200);
    fill(0,250,0,0.5);
    rect((pointOriginXEnd-(leftOffset*(virtualSize*2))), (pointOriginY+(topOffset*(virtualSize*2))),10,10);
    fill(250,0,0);
    
    fill(200, 200, 200);
    
    fill('#fff');
}

function draw() {
    clear();
    image(video, 0, 0, width, webcamHeight);
    //background(0);
    calculate();

    if (distanceEyes > 80 && distanceEyes < 200){
        drawgraphics();
        if (!played){
            hiAnimation.play();
            played = true;
        }
    }else{
        played = false;
    }
}
console.log("left: " + leftOffset + " top: " + topOffset)