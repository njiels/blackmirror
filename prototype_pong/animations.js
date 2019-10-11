//Creating a grid
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var dotWidth = document.getElementById("dot").offsetWidth;
var rows = Math.round(screenWidth / dotWidth);
var columns = Math.round(screenHeight / dotWidth);
var numDots = rows * columns;
var rowcol = rows + " keer " + columns + " is " + numDots;
var dots = "<div class='dot'></div>";

function fillDots(){
    console.log(dotWidth);
    document.getElementById("dotContainer").innerHTML= "<div class='dot'></div>".repeat(numDots);
}
fillDots();

function drawGrid(){
  //Here the grid is being drawn.
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

//make the grid ripple from the center
var rippleMiddle = {
    targets: '.dots-layout .dot',
    loop: 'false',
    scale: 0.3,
    opacity: [
      {value: 1, duration: 500},
      {value: 0, duration: 200}
    ],
    delay: anime.stagger(100, {grid: [rows, columns], from: 'center'}),
    // opacity: [
    //   {value: 1, easing: 'easeInOutQuad', duration: 200},
    // ],
  };

//make the grid ripple from left (NOT YET FIXED)
var rippleEdge = {
    targets: '.dots-layout .dot',
    backgroundColor: '#FFF',
    opacity: [
      {value: 0, easing: 'easeOutSine', duration: 500},
      {value: 0.8, easing: 'easeInOutQuad', duration: 500},
      {value: 0, easing: 'easeOutSine', duration: 500}
    ],
    delay: anime.stagger(30, {grid: [rows, columns], from: (rows * (columns/2))})
  }; 

var textPopUp = {
  targets: '.widget',
  scale: [
    {value: 1, easing: 'easeOutSine', duration: 100},
    {value: 0.9, easing: 'easeInOutQuad', duration: 200},
    {value: 1, easing: 'easeInOutQuad', duration: 200}
  ],
  opacity: [
    {value: 1, easing: 'easeInOutQuad', duration: 50}
  ],
  duration: 1000,
};

var gridFade = {
  targets: '.dot',
  easing: 'easeInOutSine',
  opacity: [
    {value: 1, duration: 500},
    {value: 0, easing: 'easeInOutSine', duration: 200}
  ],
};

var targetYes ={
  targets: '#yes',
  easing: 'easeInOutSine',
  loop: 2,
  scale: [
    {value: 1, duration: 500},
    {value: 0.8, duration: 500}
  ],
};

var targetNo ={
  targets: '#no',
  easing: 'easeInOutSine',
  loop: 2,
  scale: [
    {value: 1, duration: 500},
    {value: 0.8, duration: 500}
  ],
};

//Animation TIMELINES
const timeline = anime.timeline({
    autoplay: false,
    loop: 'false'
  })
  
  const hiAnimation = anime.timeline({
      autoplay: false
    })
  
  const textSelect = anime.timeline({
      autoplay: false
  })

  const noddingY = anime.timeline({
    autoplay: false
})

  const noddingN = anime.timeline({
    autoplay: false
  })
  
timeline.add(textPopUp)
    .add(gridFade);
timeline.play();

hiAnimation.add(rippleMiddle)
    .add(gridFade);

textSelect.add(textPopUp);

noddingY.add(targetYes);
noddingN.add(targetNo);