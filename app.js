const gameBoardTable = document.getElementById('gameboard');
const messageDiv = document.getElementById('message');
const scoreDiv = document.getElementById('score');
const resetBtn = document.getElementById('reset');
const optionCheckBoxes = document.querySelectorAll('#options input[type="checkbox"]');

const foodArray = ['&#127815', '&#127816', '&#127817', '&#127822', '&#127826', '&#129373', '&#129361', '&#127814', '&#129365', '&#127812', '&#127829'];
const boardSize = 20

let snakeY, snakeX, score, snake, direction, foodY, foodX, foodEmojiIndex, speedOption, wallOption, speed, timeoutID;

resetBtn.addEventListener('click', e => {
    initGame();
});

// initialize game
function initGame () {

    clearTimeout(timeoutID);
    timeoutID = null;

    snakeY = parseInt(boardSize / 2);
    snakeX = parseInt(boardSize / 2);

    score = 0;

    snake = [snakeY + '_' + snakeX];

    direction = 'u';

    speedOption = localStorage.getItem('speed-cb') == "true" ? true : false;
    wallOption = localStorage.getItem('wall-cb') == "true" ? true : false;

    speed = 200;

    messageDiv.innerText = '';
    messageDiv.classList.add('hidden');

    (function repeat() {
        timeoutID = setTimeout(repeat, speed);
        runGame();
    })();

    addFood();
    updateHighScore();
    
}

initGame();

optionCheckBoxes.forEach( cb => {

    const id = cb.getAttribute('id');

    if ( localStorage.getItem(id) == "true" ) {
        cb.checked = true;
    } else {
        cb.checked = false;
    }

    cb.addEventListener('change', e => {
        localStorage.setItem(id, e.target.checked);
    });
});

document.addEventListener ('keydown', e => {
    switch ( e.key ) {
        case 'ArrowUp':
            direction = 'u';
            break;
        case 'ArrowDown':
            direction = 'd';
            break;
        case 'ArrowLeft':
            direction = 'l';
            break;
        case 'ArrowRight':
            direction = 'r';
            break;
    }
});

// game engine
function runGame () {

    let [cursorY, cursorX] = calculateNewCursor();
    
    if ( !wallOption && hitsBorder(cursorY, cursorX) ) {
        gameOver();
    }

    if ( hitsSnake(cursorY, cursorX) ) {
        gameOver();
    }
   
    snake.unshift(cursorY + '_' + cursorX);
    snake.pop();

    drawGameBoard();
}

// for drawing game board
function drawGameBoard () {

    gameBoardTable.innerHTML = '';
    
    for ( let y = 0; y < boardSize; y++ ) {
        const boardRowTr = document.createElement('tr');
        for ( let x = 0; x < boardSize; x++ ) {
            const boardCellTd = document.createElement('td');
            const id = y + '_' + x;
            boardCellTd.setAttribute('id', id);

            // draw snake
            if ( snake.includes(id) ) {
                boardCellTd.innerHTML = '&#128055';
            }

            // draw food
            if ( y == foodY && x == foodX ) {
                boardCellTd.innerHTML = foodArray[foodEmojiIndex];
            }

            boardRowTr.append(boardCellTd);
        }
        gameBoardTable.append(boardRowTr);
    }

    scoreDiv.innerText = 'Score: ' + score;
}


// calculate new cursor for snake
function calculateNewCursor () {

    let [y, x] = snake[0].split('_');

    switch ( direction ) {
        case 'u':
            if ( wallOption && y == 0 ) {
                y = boardSize - 1;
            } else {
                y--;
            }
            break;
        case 'd':
            if ( wallOption && y == (boardSize - 1) ) {
                y = 0;
            } else {
                y++;
            }
            break;
        case 'l':
            if ( wallOption && x == 0 ) {
                x = boardSize - 1;
            } else {
                x--;
            }
            break;
        case 'r':
            if ( wallOption && x == (boardSize - 1) ) {
                x = 0;
            } else {
                x++;
            }
            break;
    }

    if ( y == foodY && x == foodX ) {
        addFood();
        score++;
        snake.push(undefined);
        if ( speedOption ) {
            speed *= 0.95;
        }
    }

    return [y, x];    
}

// test if snake hits the border
function hitsBorder ( y, x ) {

    if ( y < 0 || y >= boardSize || x < 0 || x >= boardSize ) {
        return true;
    }

    return false;
}

// test if snake hits itself
function hitsSnake ( y, x ) {
    if ( snake.includes(y + '_' + x) ) {
        return true;
    }

    return false;
}

// game over stuff
function gameOver () {

    clearTimeout(timeoutID);
    timeoutID = null;

    messageDiv.innerText = 'Game Over';
    messageDiv.classList.remove('hidden');

    if ( localStorage.getItem('tak22SnakeScore') < score ) {
        localStorage.setItem('tak22SnakeScore', score);
        updateHighScore();
    }

}

// gerenate food with random
function addFood () {

    do {
        foodY = Math.floor(Math.random() * boardSize);
        foodX = Math.floor(Math.random() * boardSize);
        foodEmojiIndex = Math.floor(Math.random() * foodArray.length);
    } while ( snake.includes(foodY + '_' + foodX) )

}

// update high score
function updateHighScore () {
    const highScore = localStorage.getItem('tak22SnakeScore');
    const highScoreDiv = document.getElementById('high-score');
    highScoreDiv.innerText = 'High score: ' + highScore;
}