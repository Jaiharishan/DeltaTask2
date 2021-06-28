const canvas = document.querySelector('canvas');

canvas.width = innerWidth;
canvas.height = innerHeight;
// THIS THING IS LIKE A COMMAND FOR EVERY FUNCTION
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
ctx.fillStyle = 'orange';

canvas.style.background = 'rgb(37, 37, 37)';



// CREATING A PLAYER OBJECT TO SET ATTRIBUTES FOR PLAYER
let player = {
    width:100,
    height:100,
    posX:canvasWidth / 4,
    posY:canvasHeight - 120 - 100,  // FLOOR WIDTH + PLAYER WIDTH
    dy:0,
    speed:25,
    side:'floor',
    color: 'rgb(30, 150, 40)',
}



// THIS CLASS IS USED TO CREATE NEW BLOCK BOTH IN FLOOR AND CEILING
class Floor {
    constructor(_posX, _posY){
        this._posX = _posX;
        this._posY = _posY;
        this._width = canvasWidth/4;
        this._height = 120;
        this._dx = -5;
        this.status = 'fill';
        this.color = 'rgb(29, 55, 61)';
    }
}



// ADING INITAL ELEMENTS TO FLOORARRAY
let floorArray = []
for (let i = 0; i < 4; i++) {
    let ourFloor = new Floor((canvasWidth/4) * i,canvasHeight - 120);
    floorArray.push(ourFloor);
}


// ADDING INITAL ELEMENTS TO CEILINGARRAY
let ceilingArray= [];
for (let i = 0; i < 4; i++) {
    let ourFloor = new Floor((canvasWidth/4) * i, 0);
    ceilingArray.push(ourFloor);
}


function generateFloor(mode, block) {
    if(mode === 'easy') {
        if (Math.random() < 0.2) {
            block.color = 'rgb(37, 37, 37)';
            block.status = 'hole';
        }
    }
    return block
}


function clearScreen() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}


// DRAWING FUNCTIONS
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.posX, player.posY, player.width, player.height);
}


function drawFloor() {
    for (let i = 0; i < floorArray.length; i++) {
        ctx.fillStyle = floorArray[i].color;
        ctx.fillRect(floorArray[i]._posX, floorArray[i]._posY, floorArray[i]._width, floorArray[i]._height);
    }
}


function drawceiling() {
    for (let i = 0; i < ceilingArray.length; i++) {
        ctx.fillStyle = ceilingArray[i].color;
        ctx.fillRect(ceilingArray[i]._posX, ceilingArray[i]._posY, ceilingArray[i]._width, ceilingArray[i]._height);
    }
}



// POSITION UPDATING FUNCTIONS
function newPlayerPos() {
    player.posY += player.dy;
}


function newFloorPos() {
    for (let i = 0; i < floorArray.length; i++) {
        floorArray[i]._posX += floorArray[i]._dx
    }
}


function newCeilingPos() {
    for (let i = 0; i < ceilingArray.length; i++) {
        ceilingArray[i]._posX += ceilingArray[i]._dx
    }
}


let score = 0;

let scoreCard = document.querySelector('.score');
scoreCard.textContent = 'Score: ' + score;



function scoreUpdate() {
    score++;
}


let Game = false;
// ON CLICK THE START BUTTON THE GAME SHOULD CONTINUE

const startBtn = document.querySelector('.start-btn');
const playerInfo = document.querySelector('.player-info');

const playerName = document.querySelector('#player');

let body = document.querySelector('body');

startBtn.addEventListener('click', ()=> {
    Game = true;
    let name = playerName.value;
    localStorage.setItem(name, '0');
    playerInfo.style.display = 'none';

    body.style.overflow = 'hidden';
    update();

})



function checkGame() {
    if(player.side === 'floor') {
        for (let i = 0; i < floorArray.length; i++) {
            if(floorArray[i].status === 'hole') {
                // console.log(player.posX + player.width, floorArray[i]._posX + floorArray[i]._width);
                if(player.posX + player.width < floorArray[i]._posX + floorArray[i]._width && player.posX > floorArray[i]._posX) {
                    console.log('gameOver');
                    Game = false;
                }
            }
        }
    }else if (player.side === 'ceiling') {
        for (let i = 0; i < ceilingArray.length; i++){
            if(ceilingArray[i].status === 'hole') {
                if(player.posX + player.width < ceilingArray[i]._posX + ceilingArray[i]._width && player.posX > ceilingArray[i]._posX) {
                    console.log('gameOver');
                    Game = false;
                }
            }
        }
    }
}



// THE MAIN UPDATE FUNCTION
function update() {
    clearScreen();

    if(Game) {
        // ALL RENDERS GOES HERE
        drawPlayer();
        drawceiling();
        drawFloor();
        

        // ADDING THE DX AND DY IN FUNCTIONS
        newCeilingPos();
        newPlayerPos();
        newFloorPos();
        

        // ALL CHECKING CONDITIONS GOES HERE

        // THESE 10 ARE FOR SOME SMALL FIXES AS THE UPDATE ITSELF CAN DETECT IT WHEN 
        // PLAYER MOVES AT SUCH A HIGH SPEED
        if (player.posY < 120) {
            player.posY = 120;
            player.dy = 0;
        } 

        if (player.posY + player.height > canvasHeight - 120) {
            player.posY = canvasHeight - 120 - player.height;
            player.dy = 0;
        }


        // FOR THE FLOOR AND CEILING MOVEMENTS

        if(floorArray[0]._posX < 0 && floorArray.length === 4) {
            let newFloor = new Floor(canvasWidth - 5, canvasHeight - 120);

            // THE MAKE IT RANDOM FUNCTION PLAYER ITS ROLE HERE
            newFloor = generateFloor('easy', newFloor);
            floorArray.push(newFloor);
        }

        if (floorArray[0]._posX + floorArray[0]._width < 0 && floorArray.length === 5) {
            floorArray.shift();
        }



        
        if(ceilingArray[0]._posX < 0 && ceilingArray.length === 4) {
            let newFloor = new Floor(canvasWidth - 5, 0);

            // THE MAKE IT RANDOM FUNCTION PLAYER ITS ROLE HERE
            newFloor = generateFloor('easy', newFloor);
            ceilingArray.push(newFloor);
        }

        if (ceilingArray[0]._posX + ceilingArray[0]._width < 0 && ceilingArray.length === 5) {
            ceilingArray.shift();
        }


        checkGame();
        // UPDATING AND DISPLAYING THE SCORE
        scoreUpdate();
        scoreCard.textContent = 'Score: ' + Math.floor(score/10);


        requestAnimationFrame(update);
    }
    else {
        playerInfo.style.display = 'flex';
        setScore();
        let gamerOver = document.createElement('div');
        gamerOver.setAttribute('class','header');
        gamerOver.textContent = 'Game Over!';
        playerInfo.removeChild(document.querySelector('.header'));
        playerInfo.appendChild(gamerOver);
        gamerOver.style.order = '-1';

        body.style.overflowY = 'scroll';


        // Game = true;
        // let name = playerName.value;
        // localStorage.setItem(name, '0');
        // playerInfo.style.display = 'none';
        // update();
        
    }
}



function moveUp() {
    player.dy = player.speed*-1;
    player.side = 'ceiling';
}

function moveDown() {
    player.dy = player.speed;
    player.side = 'floor';
}



function keyDownMoves(e) {
    if(e.key === ' ' && player.side === 'floor') {
        moveUp();
    }else if(e.key === ' ' && player.side === 'ceiling') {
        moveDown();
    }
}

function onClickMoves() {
    if (player.side === 'floor') {
        moveUp();
    }else if(player.side === 'ceiling') {
        moveDown();
    }
}

document.addEventListener('keydown', keyDownMoves);
document.addEventListener('click', onClickMoves);


const scoreBoard = document.querySelector('.score-board');



// TO DISPLAY THE SCORE AND NAME
function setScore() {
    let name = playerName.value;
    let gameScore = Math.floor(score/10);
    localStorage.setItem(name, gameScore);

    // NOW CREATING ELEMENTS
    renderScoreBoard(name, gameScore);
}


// NOW TO RENDER PREVIOUS PLAYERS SCORE

function renderScoreBoard(name, score) {
    let scoreRowDiv = document.createElement('div');
    scoreRowDiv.setAttribute('class', 'score-row');

    let nameDiv = document.createElement('div');
    nameDiv.setAttribute('class', 'name-card');
    nameDiv.textContent = name;

    let scoreDiv = document.createElement('div');
    scoreDiv.setAttribute('class', 'score-card');
    scoreDiv.textContent = score;

    scoreRowDiv.appendChild(nameDiv);
    scoreRowDiv.appendChild(scoreDiv);

    scoreBoard.appendChild(scoreRowDiv);
    scoreRowDiv.style.order = score;
}


for (let i = 0; i < Object.entries(localStorage).length; i++) {
    renderScoreBoard(Object.entries(localStorage)[i][0], Object.entries(localStorage)[i][1])
}




