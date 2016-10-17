
(function (window, document, mainLogic, undefined) {

//
function stopMusic(){
	soundEfx.pause();
}

function startMusic(){
	soundEfx.play();
}


var btn = document.getElementById('btn');
btn.addEventListener("click", function(){ mainLogic.start();});

	document.onkeydown = function(event) {

        keyCode = window.event.keyCode;
        keyCode = event.keyCode;

	  console.log(snakeSpeed);

        switch(keyCode) {

        case 37:
          if (direction != 'right') {
            direction = 'left';
          }
          console.log('left');
          break;

        case 39:
          if (direction != 'left') {
          direction = 'right';
          console.log('right');
          }
          break;

        case 38:
          if (direction != 'down') {
          direction = 'up';
          console.log('up');
          }
          break;

        case 40:
          if (direction != 'up') {
          direction = 'down';
          console.log('down');
          }
          break;

            case 80:
                stopMusic();
                isMusicPaused = true;
                break;
            case 77:
                startMusic();
                isMusicPaused = false;
                break;
            case 32:
                pause.onclick();
                break;
          }


      }


})(window, document, mainLogic);
