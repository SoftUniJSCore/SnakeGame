$(document).ready(function () {
    $('#pause_btn').hide();
});


//simulate class- cant call functions outside witout mainLogic.

var mainLogic = (function () {


    var soundEfx; // Sound Efx

    var soundGameOver = 'sound/over.wav'; //Game Over sound efx
    var soundHitFood = 'sound/hit.wav'; //Game Hit Food sound efx
    var soundSoundBackground = 'sound/game_sound_background.wav'; //Game Sound Background sound efx
	var onePointFood = 0;
	var fivePointFood = 0;
	var tenPointsFood = 0;
	var pointsWithoutBonuses = 0;
	var foodBonusScore = 0;
	var mostBonusesFromFood = 'equal';
  var snakeSizeWithoutBonus = 5;






    var drawSnake = function (x, y) {
        ctx.fillStyle = 'green';
        ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);


    }

    var drawFood = function (x, y) {

      let outsideColor = 'blue';
      let insideColor = 'lightblue'
      let scoreSize = '1';

      if (foodFlag == '1x') {
         outsideColor = 'blue';
         insideColor = 'lightblue';
         scoreSize = '1';
      } else if(foodFlag == '5x'){
            outsideColor = 'red';
            insideColor = '#ff6666';
            scoreSize = '5';
      } else if (foodFlag == '10x') {
          outsideColor = 'black';
          insideColor = 'yellow'
          scoreSize = '10';
      }else if(foodFlag == '11x') {
          outsideColor = 'green';
          insideColor = 'green';
          scoreSize = 'L';
      }else if (foodFlag == '12x') {
        outsideColor = 'purple';
        insideColor = 'purple';
        scoreSize = '30';
      }

      ctx.fillStyle = outsideColor;
      ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
      ctx.fillStyle = insideColor;
      ctx.fillRect(x * snakeSize + 1, y * snakeSize + 1, snakeSize - 2, snakeSize - 2);

      if(foodFlag == '11x' || foodFlag == '12x'){
        ctx.fillStyle = 'white';
      }else {
        ctx.fillStyle = 'black';
      }

	  if(scoreSize >= 10){
		  ctx.fillText(scoreSize, (x * snakeSize) + 1, (y * snakeSize) + 11);
	  }else{
		  ctx.fillText(scoreSize, (x * snakeSize) + 5, (y * snakeSize) + 11);
	  }

      //score text
      ctx.font = "12px";
      ctx.fillStyle = outsideColor;

    }

    var scoreText = function () {

    var score_text = "Score: " + score;
		let snSize = "Snake size: " + snake.length;
		let blueLight = "One point: " + onePointFood;
		let redColor = "Five point: " + fivePointFood;
		let yellowColor = "Ten Point: " + tenPointsFood;
		let sumWithBonuses = "Score without bonuses: " + pointsWithoutBonuses;
		let bonusFromFoods = "Bonuses from foods: " + foodBonusScore;
		let mostFoodBon = "Most fallen bonus food: " + mostBonusesFromFood;
    let snakeTotalSize = "Total size of snake: " + snakeSizeWithoutBonus;

		 document.getElementById('score').innerHTML = score_text + "<br />" + snSize + "<br />" + snakeTotalSize + "<br />" + "<hr />" + "Food points:" + "<br />" + blueLight +
		 "<br />" + redColor + "<br />" + yellowColor + "<br />" + "<hr />" + sumWithBonuses + "<br />" + "<hr />" + bonusFromFoods +
		 "<br /><br />" + mostFoodBon;



    }

//from initlength to 0 to fill the snake - initial position coordinates
    var fillSnake = function () {
        //var length = 4; //- global var
        snake = [];
        for (var i = initialLength - 1; i >= 0; i--) {
            snake.push({x: i, y: 0});
        }

    }


// main game logic - called in init game loop - move snake
    var moveSnake = function () {
        //draw font back
        ctx.fillStyle = '#ffc823';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(0, 0, w, h);

//game start - btn disabled
        btn.setAttribute('disabled', true);
        pause_btn.removeAttribute('disabled', true)


//takes zero coordinates [x - 4, y - 0] as head
        var snakeX = snake[0].x;
        var snakeY = snake[0].y;

        if (direction == 'right') {
            snakeX++;
        }
        else if (direction == 'left') {
            snakeX--;
        }
        else if (direction == 'up') {
            snakeY--;
        } else if (direction == 'down') {
            snakeY++;
        }

//game over - snakeSize - snake width - calc how many sqares it have
        if (snakeX == -1 || snakeX == w / snakeSize || snakeY == -1 || snakeY == h / snakeSize || checkCollision(snakeX, snakeY, snake)) {
            //restart game - active start button
			onePointFood = 0;
			fivePointFood = 0;
			tenPointsFood = 0;
			pointsWithoutBonuses = 0;
			foodBonusScore = 0;
			mostBonusesFromFood = 'equal';
            btn.removeAttribute('disabled', true);
            pause_btn.setAttribute('disabled', true)



            //ctx.clearRect(0,0,w,h);
            clock.stop();
            soundEfx = document.getElementById("soundEfx");
            soundEfx.src = soundGameOver;

            if(!isMusicPaused){

              soundEfx.play();
          }


            gameloop = clearInterval(gameloop);

            gameOverDialog();

			$('#btn').show();
			$('#pause_btn').hide();


            return;
        }

// define var to keep element from tail to head or food to head - add coordinates in if
        var tail = {x: 0, y: 0};
        if (snakeX == food.x && snakeY == food.y) {
            tail = {x: snakeX, y: snakeY};

            if (foodFlag == "10x") {
                score += 10;
                tenPointsFood++;
                snakeSizeWithoutBonus++;
            }
            else if (foodFlag == "5x") {
                score += 5;
                fivePointFood++;
                snakeSizeWithoutBonus++;
            }else if(foodFlag == "11x"){
                resetSnakeSize();
                snakeSizeWithoutBonus++;
            }else if (foodFlag == "12x") {
               slowSnake();
            }
            else {
                score++;
                onePointFood++;
                snakeSizeWithoutBonus++;
            }

			pointsWithoutBonuses = score - ((tenPointsFood * 10) + (fivePointFood * 5));
			foodBonusScore = (tenPointsFood * 10) + (fivePointFood * 5);

			if(tenPointsFood > fivePointFood){
				mostBonusesFromFood = 'yellow food';
			}else if(tenPointsFood < fivePointFood){
				mostBonusesFromFood = 'red food';
			}else{
				mostBonusesFromFood = 'equal';
			}


            //check if speed reached speed minimum and increase the speed
            snakeSpeed -= speedStep;
            if (snakeSpeed < speedMin) {
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
        for (var i = 0; i < snake.length; i++) {
            drawSnake(snake[i].x, snake[i].y);
        }

        drawFood(food.x, food.y);

        scoreText();
    }
    var foodFlag;


    var createFood = function () {
        var random = Math.floor(Math.random() * 100 + 1);

        food = {
            x: Math.floor((Math.random() * 40)),
            y: Math.floor((Math.random() * 34))

        }

        for (var i = 0; i < snake.length; i++) {
            var snakeX = snake[i].x;
            var snakeY = snake[i].y;

            if (food.x === snakeX && food.y === snakeY || food.y === snakeY && food.x === snakeX) {
                createFood();
            }
        }
        if (random % 10 == 0) {
            foodFlag = "10x";


        } else if (random % 5 == 0) {
            foodFlag = "5x";
        }else if(random % 11 == 0){
            foodFlag = "11x";
        }else if (random % 12 == 0) {
            foodFlag = "12x";
        }

        else {
            foodFlag = "1x";

        }


    }

//check if head element is equal to another element from snake array
    var checkCollision = function (x, y, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].x === x && array[i].y === y)
                return true;
        }
        return false;
    }

    var gameOverDialog = function () {

        var img = document.getElementById("img");
        ctx.drawImage(img, 0, 0, 600, 600);

    }

    var start = function () {
		$('#pause_btn').show();
		$('#btn').hide();

        snakeSizeWithoutBonus = 5;
        isMusicPaused = false;
        soundEfx = document.getElementById("soundEfx");
        soundEfx.src = soundSoundBackground;
        soundEfx.play();

        score = 0;
        direction = 'down';
        fillSnake();
        createFood();

        snakeSpeed = snakeStartSpeed;


        clock.reset();
        clock.start();

        gameloop = setInterval(moveSnake, snakeSpeed);   //global gameloop is id to interval
    }


    var clock = $('.your-clock').FlipClock({
        autoStart: false
    });




    function stopMusic() {
        soundEfx.pause();
    }

    function startMusic() {
        soundEfx.start();
    }


    function resetSnakeSize(){
        snake.length = 5;
    }


    function slowSnake() {
       //because ot speedStep next code will slow snake with 30 (50 - speedStep = 30)
        snakeSpeed += 50;

     }
    //pause the game



    var pause = document.getElementById("pause_btn");
    pause.innerHTML = "PAUSE";
    pause.onclick = function pauseGame() {
        if (!isPaused) {
            gameloop = clearInterval(gameloop);
            pause.innerHTML = "PLAY"
            soundEfx.pause();
            clock.stop();
            isPaused = true;
        } else if (isPaused = true) {
            gameloop = setInterval(moveSnake, snakeSpeed);
            pause.innerHTML = "PAUSE"
            if(isMusicPaused == true){
              soundEfx.pause();
            }else {
              soundEfx.play();
            }
            //soundEfx.play();
            clock.start();
            isPaused = false
        }


    };


//returns json object
    return {
        start: start
    };


}());
