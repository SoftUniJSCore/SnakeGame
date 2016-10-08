function game() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.font = '15px Arial';
    window.addEventListener('keydown',handleEvent);
    let w = canvas.width;
    let h = canvas.height;
    let cellWidth = 10;
    let direction;
    let food;
    let score;
    let snake_array;

    function init() {
        direction = 'right';
        createSnake();
        createFood();
        score =0;
        if(typeof(game_loop) !='undefined') clearInterval(game_loop);
        game_loop = setInterval(draw, 60);
    }
    init();

    function createSnake() {
        let length = 5;

        snake_array=[];

        for(let i=length-1;i>=0;i--){
            snake_array.push({x:i,y:0});
        }
    }

    function createFood() {
        food ={
            x:Math.round(Math.random() * (w-cellWidth)/cellWidth),
            y:Math.round(Math.random() * (h-cellWidth)/cellWidth)
        }
    }

    function draw() {
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(0,0,w,h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);

        let nx = snake_array[0].x;
        let ny = snake_array[0].y;

        if(direction == 'right') nx++;
        else if(direction =='left') nx--;
        else if(direction =='up') ny--;
        else if(direction=='down')ny++;


        //checks if the snakes hits one of the walls
        //if so, the game restarts
        if(nx==-1 || nx== w/cellWidth || ny==-1 || ny==h/cellWidth || checkCollision(nx,ny,snake_array)){
            //restart game
            init();
            return;
        }
        //moving the snakes comes when the tail(or the last element)
        //come before the first element (or the head)
        //if the snake eats food, we push the tail in the snake array
        if(nx == food.x && ny == food.y){
            var tail ={x:nx,y:ny};
            score++;
            createFood();
        }
        else{
            var tail = snake_array.pop();
            tail.x =nx;
            tail.y =ny;
        }

        snake_array.unshift(tail);

        for(let i=0;i<snake_array.length;i++){
            let singleSnakeCell = snake_array[i];

            paintSnakeCell(singleSnakeCell.x,singleSnakeCell.y);
        }

        paintFoodCell(food.x,food.y);
        ctx.fillStyle='black';
        ctx.fillText(`Your score is: ${score}`,5,h-5);


    }

    function paintSnakeCell(x, y) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(x*cellWidth,y*cellWidth,cellWidth,cellWidth);

    }

    function paintFoodCell(x,y) {
        ctx.fillStyle = 'red';
        ctx.fillRect(x*cellWidth,y*cellWidth,cellWidth,cellWidth);
    }

    function checkCollision(x, y, array) {
        for(var i = 0; i < array.length; i++)
        {
            if(array[i].x == x && array[i].y == y)
                return true;
        }
        return false;
    }

    function handleEvent(event) {
        switch (event.code){
            case "ArrowLeft": if(direction != 'right'){direction='left'}
                break;
            case "ArrowRight": if(direction != 'left'){direction='right'}
                break;
            case "ArrowUp": if(direction != 'down'){direction='up'}
                break;
            case "ArrowDown": if(direction != 'up'){direction='down'}
                break;
        }
    }


}

game();