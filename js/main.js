/*
 * MAin game logic - simulate class
 * can't call functions outside without mainLogic.
 */

var mainLogic = (function () {


    var soundEfx; // Sound Efx
    var soundGameOver = 'sound/over.wav'; //Game Over sound efx    
    var soundHitFood = 'sound/hit.wav'; //Game Hit Food sound efx    
    var soundSoundBackground = 'sound/game_sound_background.wav'; //Game Sound Background sound efx  


    /*
     * drawSnake - it draws the snake as rectangle
     */
    var drawSnake = function (x, y) {
        ctx.fillStyle = 'green';
        ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
    }

    /*
     * drawFood - it draws the food as rectangle
     */
    var drawFood = function (x, y) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(x * snakeSize + 1, y * snakeSize + 1, snakeSize - 2, snakeSize - 2);
    }

    /*
     * scoreText - shows the score when the game start
     */
    var scoreText = function () {
        var score_text = "Score: " + score;
        document.getElementById('score').innerHTML = score_text;

    }

    /*
     * fillSnake - from 0 to initial length (global var) fill the snake rectangle by rectangle
     */
    var fillSnake = function () {
        snake = [];
        for (var i = initialLength - 1; i >= 0; i--) {
            snake.push({x: i, y: 0});
        }

        soundEfx = document.getElementById("soundEfx");
        soundEfx.src = soundSoundBackground;
        soundEfx.play();
    }


    /*
     * moveSnake - main game logic - called in start game loop
     */
    var moveSnake = function () {

        /*
         * draw back font
         */
        ctx.fillStyle = '#ffc823';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(0, 0, w, h);

        /*
         * disable start button when game is ongoing
         */
        btn.setAttribute('disabled', true);

        /*
         *  take zero coordinates as head
         */
        var snakeX = snake[0].x;
        var snakeY = snake[0].y;

        /*
         *  change coordinates depend on key input
         */
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

        /*
         *  change for GameOver - collision with walls or itself
         */
        if (snakeX == -1 || snakeX == w / snakeSize || snakeY == -1 || snakeY == h / snakeSize || checkCollision(snakeX, snakeY, snake)) {

            /*
             *  when game over - reset game start button and clear game field
             */
            btn.removeAttribute('disabled', true);
            ctx.clearRect(0, 0, w, h);


            soundEfx = document.getElementById("soundEfx");
            soundEfx.src = soundGameOver;
            soundEfx.play();

            gameloop = clearInterval(gameloop);

            gameOverDialog();

            return;
        }

        /*
         *  define tail to keep element from tail to head or food to head
         *  if the food is eaten create new head instead of moving the tail
         *  and create new food on random position
         *  check if the max speed is reached and increase it
         *  otherwise we move the last element (tail) as first element (head) and the snake is moving
         */
        var tail = {x: 0, y: 0};
        if (snakeX == food.x && snakeY == food.y) {
            tail = {x: snakeX, y: snakeY};


            soundEfx = document.getElementById("soundEfx");
            soundEfx.src = soundHitFood;
            soundEfx.play();

            score++;

            snakeSpeed -= speedStep;
            if (snakeSpeed < speedMin) {
                snakeSpeed = speedMin;
            }

            gameloop = clearInterval(gameloop);
            gameloop = setInterval(moveSnake, snakeSpeed);

            createFood();
        } else {
            //pops out the last cell
            snake.pop();
            tail.x = snakeX;
            tail.y = snakeY;
        }

        //add tail element in front of the array
        snake.unshift(tail);

        /*
         *  the snake is ready to be drawn rectangle by rectangle
         */
        for (var i = 0; i < snake.length; i++) {
            drawSnake(snake[i].x, snake[i].y);
        }

        drawFood(food.x, food.y);
        scoreText();
    }

    /*
     *  create food at random position
     *  check if food shows on the snake body and change it
     */
    var createFood = function () {
        food = {
            x: Math.floor((Math.random() * 40)),
            y: Math.floor((Math.random() * 40))
        }

        for (var i = 0; i > snake.length; i++) {
            var snakeX = snake[i].x;
            var snakeY = snake[i].y;

            if (food.x === snakeX && food.y === snakeY || food.y === snakeY && food.x === snakeX) {
                food.x = Math.floor((Math.random() * 40) + 1);
                food.y = Math.floor((Math.random() * 40) + 1);
            }
        }
    }

    /*
     *  check if head element is equal to another element from snake array
     *  its called in GameOver check
     */
    var checkCollision = function (x, y, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].x === x && array[i].y === y)
                return true;
        }
        return false;
    }


    /*
     *  dialog box with the score shown when the game is over
     */
    var gameOverDialog = function () {

        // Get the modal
        var modal = document.getElementById('myModal');

        var modalContent = document.getElementById("modalText").innerHTML = "Game Over <br />" + "Score: " + score;
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    /*
     *  game initialisation point
     */
    var start = function () {
        score = 0;
        direction = 'down';
        fillSnake();
        createFood();
        snakeSpeed = snakeStartSpeed;
        time();
        gameloop = setInterval(moveSnake, snakeSpeed);   //global gameloop is id to interval
    }

    /*
     *  timer shows how long is the game going
     */
    var time = function timer() {
        var sec = -1;

        function pad(val) {
            return val > 9 ? val : "0" + val;
        }

        setInterval(function () {

            $("#seconds").html(pad(++sec % 60));
            $("#minutes").html(pad(parseInt(sec / 60, 10) % 60));
            $("#hours").html(pad(parseInt(sec / 3600, 10)));
        }, 1000);
    }


    //return json object called in the input handler
    return {
        start: start
    };


}());
