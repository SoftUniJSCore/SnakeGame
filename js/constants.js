
//instance canvas and global variables -  can be made as json object
var mycanvas = document.getElementById('mycanvas');
var ctx = mycanvas.getContext('2d');
var w = 600;
var h = 500;
var score = 0;
var snake;
var snakeSize = 15;
var food;

var initialLength = 5;
var snakeStartSpeed = 300;
var speedMin = 60;
var speedStep = 20;
var isPaused ;
