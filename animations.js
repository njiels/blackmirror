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

//make the grid ripple from the center
var rippleMiddle = {
    targets: '.dots-layout .dot',
    backgroundColor: '#FFF',
    loop: 'false',
    opacity: [
      {value: 0, easing: 'easeOutSine', duration: 100},
      {value: 0.8, easing: 'easeInOutQuad', duration: 100}
    ],
    delay: anime.stagger(100, {grid: [rows, columns], from: 'center'}),
    scale: [
      {value: .1, easing: 'easeOutSine', duration: 100},
      {value: 1, easing: 'easeInOutQuad', duration: 100}
    ],
    delay: anime.stagger(100, {grid: [rows, columns], from: 'center'})
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
    {value: 1.1, easing: 'easeInOutQuad', duration: 200},
    {value: 1, easing: 'easeInOutQuad', duration: 200}
  ],
  opacity: [
    {value: 1, easing: 'easeInOutQuad', duration: 50}
  ]
};

var gridFade = {
  targets: '.dots-layout .dot',
  opacity: [
    {value: 1},
    {value: 0, easing: 'easeInOutQuad', duration: 300}
  ]
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
  
timeline.add(textPopUp)
    .add(gridFade);
timeline.play();

hiAnimation.add(rippleMiddle)
    .add(gridFade);

textSelect.add(textPopUp);