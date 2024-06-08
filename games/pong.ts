
import * as readline from 'readline';

const paddleHeight = 10;
const paddleWidth = 1;
let ballX: number = 0;
let ballY: number = 0;
let ballVelocityX: number = 1;
let ballVelocityY: number = 1;
let player1Y: number = 0;
let player2Y: number = 0;
let player1Score: number = 0;
let player2Score: number = 0;
let gameRunning: boolean = true;

function update(): void {
    ballX += ballVelocityX;
    ballY += ballVelocityY;

    if (ballX <= 0) {
        if (ballY >= player1Y && ballY <= player1Y + paddleHeight) {
            ballVelocityX *= -1;
        } else {
            player2Score++;
            resetBall();
        }
    }

    if (ballX >= 80 - 1) {
        if (ballY >= player2Y && ballY <= player2Y + paddleHeight) {
            ballVelocityX *= -1;
        } else {
            player1Score++;
            resetBall();
        }
    }

    if (ballY <= 0 || ballY >= 24 - 1) {
        ballVelocityY *= -1;
    }

    if (player1Score >= 5 || player2Score >= 5) {
        gameRunning = false;
    }
}

function resetBall(): void {
    ballX = 40;
    ballY = 12;
    ballVelocityX = (Math.random() < 0.5) ? 1 : -1;
    ballVelocityY = (Math.random() < 0.5) ? 1 : -1;
}

function draw(): void {
    let output = '';
    for (let y = 0; y < 24; y++) {
        for (let x = 0; x < 80; x++) {
            if (x === 0 || x === 80 - 1) {
                output += '|';
            } else if (x === ballX && y === ballY) {
                output += '*';
            } else if (x === 3 && y >= player1Y && y < player1Y + paddleHeight) {
                output += '#';
            } else if (x === 80 - 4 && y >= player2Y && y < player2Y + paddleHeight) {
                output += '#';
            } else {
                output += ' ';
            }
        }
        output += '\n';
    }
    output += 'Score: ' + player1Score + ' - ' + player2Score;
    console.clear();
    console.log(output);
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key): void => {
    if (key.sequence === 'w') {
        player1Y = Math.max(0, player1Y - 1);
    }
    if (key.sequence === 's') {
        player1Y = Math.min(24 - paddleHeight, player1Y + 1);
    }
    if (key.sequence === 'i') {
        player2Y = Math.max(0, player2Y - 1);
    }
    if (key.sequence === 'k') {
        player2Y = Math.min(24 - paddleHeight, player2Y + 1);
    }
    if (key.sequence === '\u0003') {
        process.exit(0);
    }
});

function gameLoop(): void {
    if (gameRunning) {
        update();
        draw();
    } else {
        console.log('Game over!');
        process.exit(0);
    }
}

setInterval(gameLoop, 1000 / 30);
