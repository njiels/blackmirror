//This is a script that solely makes a game
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
var score = 0;
//Here are the precalcalculations called to estimate screensize, and just general pose and interaction variables
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

//game physics
var xBall = Math.floor(Math.random() * 300) + 50;
var yBall = 50;
var diameter = 50 / (yBall/100);
var xBallChange = 20;
var yBallChange = 20;
var xPong1, yPong1,
distanceEyes, distanceFace, distancePointLeft, distancePointRight, reactDistance,
nose, hand, hand2, wrist, wrist2, leftHandXEst, leftHandYEst, laptopEst, mirrorEst,
leftHandXEstimation, leftHandYEstimation, rightHandXEstimation, rightHandXEstimation,
startPointCalc, conditionLHandX, conditionLHandY, conditionRHandX, conditionRHandY,
differenceNoseX, differenceNoseY, gesture;
var paddleWidth = 200;
var paddleHeight = 20;

var scoreWidget = document.getElementById('score');

function setup(){
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
}

function modelReady(){
    console.log("model ready!");
    var model = 'ready';
    score = 0;
}

function draw(){
    clear();
    image(video, 0, 0, width, height);
    background(0);

    calculate();
    //ball
    fill(255, 255, 255);
    noStroke();
    ellipse(xBall, yBall, diameter, diameter);
    rect(xPong1, (windowHeight- 100), paddleWidth, 20);
    rect();

    xPong1 = rightHandXEstimation;
    yPong1 = windowHeight- 100;//rightHandY;

    xBall += xBallChange;
    yBall += yBallChange;

    diameter = 50 ;//* (yBall/50);
    scoreWidget.innerHTML = score;

    if (xBall < diameter/2 || 
        xBall > windowWidth - 0.5*diameter) {
    xBallChange *= -1;
    }
    if (yBall < diameter/2 || 
        yBall > windowHeight - diameter) {
        yBallChange *= -1;
    }

    if (yBall >= (windowHeight - (diameter))){
        score = 0;
    }

    if (model = 'ready'){
        //collision detection
        if ((xBall > xPong1 &&
            xBall < xPong1 + paddleWidth) &&
            (yBall + (diameter/2) >= yPong1)){
                yBallChange *= -1.3;
                xBallChange *= -1.3;
                score++;
            }
        }
}