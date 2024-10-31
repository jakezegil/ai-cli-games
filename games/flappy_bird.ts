//generated with gpt-4o



import * as readline from 'readline';

// Utility functions
const clearScreen = () => process.stdout.write('\x1Bc');
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Game constants
const SCREEN_HEIGHT = 20;
const SCREEN_WIDTH = 40;
const BIRD_CHAR = 'O';
const PIPE_CHAR = '#';
const EMPTY_CHAR = ' ';
const GRAVITY = 1;
const FLAP_STRENGTH = -3;

// Game state
let birdY = Math.floor(SCREEN_HEIGHT / 2);
let birdVelocity = 0;
let pipeX = SCREEN_WIDTH;
let pipeGapY = Math.floor(SCREEN_HEIGHT / 2);
let score = 0;
let gameOver = false;

// Keyboard input
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (_, key) => {
    if (key && key.name === 'space') {
        birdVelocity = FLAP_STRENGTH;
    } else if (key && key.ctrl && key.name === 'c') {
        process.exit();
    }
});

// Game loop
const main = async () => {
    while (!gameOver) {
        update();
        render();
        await sleep(100);
    }
    console.log('Game Over! Your score:', score);
};

const update = () => {
    birdVelocity += GRAVITY;
    birdY += birdVelocity;

    if (birdY < 0 || birdY >= SCREEN_HEIGHT) {
        gameOver = true;
        return;
    }

    pipeX -= 1;
    if (pipeX < -1) {
        pipeX = SCREEN_WIDTH;
        pipeGapY = Math.floor(Math.random() * (SCREEN_HEIGHT - 6)) + 3;
        score++;
    }

    if (pipeX === 1 && (birdY < pipeGapY - 1 || birdY > pipeGapY + 1)) {
        gameOver = true;
    }
};

const render = () => {
    clearScreen();

    let screen = '';
    for (let y = 0; y < SCREEN_HEIGHT; y++) {
        let line = '';
        for (let x = 0; x < SCREEN_WIDTH; x++) {
            if (x === 1 && y === Math.floor(birdY)) {
                line += BIRD_CHAR;
            } else if (x === pipeX && (y < pipeGapY - 1 || y > pipeGapY + 1)) {
                line += PIPE_CHAR;
            } else {
                line += EMPTY_CHAR;
            }
        }
        screen += line + '\n';
    }

    console.log(screen);
    console.log('Score:', score);
};

main();
