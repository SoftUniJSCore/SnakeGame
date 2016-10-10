
//simulate class- cant call functions outside witout mainLogic.
var mainLogic = (function () {

  var drawSnake = function(x, y) {
        ctx.fillStyle = 'green';
        ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
  }

  var drawFood = function(x, y) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize);
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(x*snakeSize+1, y*snakeSize+1, snakeSize-2, snakeSize-2);
  }

  var scoreText = function() {
    var score_text = "Score: " + score;
    //ctx.fillStyle = 'blue';
    //ctx.fillText(score_text, 145, h-5);

//TODO: show score when start button click
    document.getElementById('score').innerHTML = score_text;

  }

//from initlength to 0 to fill the snake - initial position coordinates
  var fillSnake = function() {
      //var length = 4; //- global var
      snake = [];
      for (var i = initialLength-1; i>=0; i--) {
          snake.push({x:i, y:0});
      }
  }


// main game logic - called in init game loop - move snake
  var moveSnake = function(){
    //draw font back
      ctx.fillStyle = '#ffc823';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'black';
      ctx.strokeRect(0, 0, w, h);

//game start - btn disabled
      btn.setAttribute('disabled', true);

//takes zero coordinates [x - 4, y - 0] as head
      var snakeX = snake[0].x;
      var snakeY = snake[0].y;

      if (direction == 'right') {
        snakeX++; }
      else if (direction == 'left') {
        snakeX--; }
      else if (direction == 'up') {
        snakeY--;
      } else if(direction == 'down') {
        snakeY++; }

//game over - snakeSize - snake width - calc how many sqares it have
      if (snakeX == -1 || snakeX == w/snakeSize || snakeY == -1 || snakeY == h/snakeSize || checkCollision(snakeX, snakeY, snake)) {
          //restart game - active start button
          btn.removeAttribute('disabled', true);

          ctx.clearRect(0,0,w,h);
          gameloop = clearInterval(gameloop);

          gameOverDialog();

          return;
        }

// define var to keep element from tail to head or food to head - add coordinates in if
        var tail = {x:0, y:0};
        if(snakeX == food.x && snakeY == food.y) {
          tail = {x: snakeX, y: snakeY}; //Create a new head instead of moving the tail
          score ++;

          //check if speed reached speed minimum and increase the speed
          snakeSpeed -= speedStep;
          if(snakeSpeed < speedMin){
              snakeSpeed = speedMin;
          }
          gameloop = clearInterval(gameloop);
          gameloop = setInterval(moveSnake, snakeSpeed);


          createFood(); //Create new food
        } else {

          snake.pop(); //pops out the last cell
          tail.x = snakeX;
          tail.y = snakeY;
        }

        //add tail element in from of the array
        snake.unshift(tail); //puts back the tail as the first cell

//the snake is ready and draw
        for(var i = 0; i < snake.length; i++) {
          drawSnake(snake[i].x, snake[i].y);
        }

      drawFood(food.x, food.y);
        scoreText();
  }

  var createFood = function() {
      food = {
        x: Math.floor((Math.random() * 40)),
        y: Math.floor((Math.random() * 40))
      }

      for (var i=0; i>snake.length; i++) {
        var snakeX = snake[i].x;
        var snakeY = snake[i].y;

        if (food.x===snakeX && food.y === snakeY || food.y === snakeY && food.x===snakeX) {
          food.x = Math.floor((Math.random() * 40) + 1);
          food.y = Math.floor((Math.random() * 40) + 1);
        }
      }
  }

//check if head element is equal to another element from snake array
  var checkCollision = function(x, y, array) {
      for(var i = 0; i < array.length; i++) {
        if(array[i].x === x && array[i].y === y)
        return true;
      }
      return false;
  }

  var gameOverDialog = function (){
    console.log('hi');
          // Get the modal
      var modal = document.getElementById('myModal');

      // Get the button that opens the modal
      var modalContent = document.getElementById("modalText").innerHTML = "Score: " + score + "<br />" + "Game Over";


      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];

      // When the user clicks the button, open the modal

      modal.style.display = "block";


      // When the user clicks on <span> (x), close the modal
      span.onclick = function() {
          modal.style.display = "none";
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
          if (event.target == modal) {
              modal.style.display = "none";
          }
      }
  }

    var start = function(){
        score = 0;
        direction = 'down';
        fillSnake();
        createFood();
        snakeSpeed = snakeStartSpeed;
		    time();
        gameloop = setInterval(moveSnake, snakeSpeed);   //global gameloop is id to interval
    }


	//Timer
var time = function timer(){
	var sec = -1;
function pad(val) { return val > 9 ? val : "0" + val; }
setInterval(function () {

    $("#seconds").html(pad(++sec % 60));
    $("#minutes").html(pad(parseInt(sec / 60, 10) % 60));
    $("#hours").html(pad(parseInt(sec / 3600, 10)));
}, 1000);
}



//returns json object
    return {
        start : start
    };


}());
