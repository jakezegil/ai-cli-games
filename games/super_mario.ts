
// Define constants
const MAP_WIDTH = 10;
const MAP_HEIGHT = 10;
const PLAYER_CHAR = 'P';
const COIN_CHAR = 'C';
const EMPTY_CHAR = '_';

// Define game state
let playerX = 0;
let playerY = MAP_HEIGHT - 1;
let coinsCollected = 0;
let map: string[][] = [];

// Initialize map
for (let y = 0; y < MAP_HEIGHT; y++) {
    let row: string[] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
        if (y === MAP_HEIGHT - 1 && x === 0) {
            row.push(PLAYER_CHAR);
        } else if (Math.random() < 0.2) {
            row.push(COIN_CHAR);
        } else {
            row.push(EMPTY_CHAR);
        }
    }
    map.push(row);
}

// Main game loop
function mainLoop() {
    // Render map
    renderGame();

    // Handle input - for simplicity, let's assume the player can only move left or right
    process.stdin.on('data', (chunk) => {
        const input = chunk.toString().trim();
        if (input === 'a' && playerX > 0) {
            map[playerY][playerX] = EMPTY_CHAR;
            playerX--;
            if (map[playerY][playerX] === COIN_CHAR) {
                coinsCollected++;
            }
            map[playerY][playerX] = PLAYER_CHAR;
        } else if (input === 'd' && playerX < MAP_WIDTH - 1) {
            map[playerY][playerX] = EMPTY_CHAR;
            playerX++;
            if (map[playerY][playerX] === COIN_CHAR) {
                coinsCollected++;
            }
            map[playerY][playerX] = PLAYER_CHAR;
        } else if (input === 'q') {
            process.exit();
        }
        if (coinsCollected === 3) {
            console.log('You win!');
            process.exit();
        }
        mainLoop();
    });
}

// Render function
function renderGame() {
    process.stdout.write('\x1Bc');
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            process.stdout.write(map[y][x] + ' ');
        }
        process.stdout.write('\n');
    }
    process.stdout.write(`Coins collected: ${coinsCollected}\n`);
}

// Start the game
mainLoop();
