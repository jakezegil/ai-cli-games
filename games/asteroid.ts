//generated with gpt-4o



import readline from 'readline';

const width = 40;
const height = 20;
const numAsteroids = 50;
let gameRunning = true;

interface Position {
    x: number;
    y: number;
}

const ship: Position = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
const asteroids: Position[] = [];

// Initialize asteroids
for (let i = 0; i < numAsteroids; i++) {
    asteroids.push({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
    });
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if (key.name === 'q' || key.ctrl && key.name === 'c') {
        gameRunning = false;
        rl.close();
    } else if (key.name === 'up') {
        moveShip(0, -1);
    } else if (key.name === 'down') {
        moveShip(0, 1);
    } else if (key.name === 'left') {
        moveShip(-1, 0);
    } else if (key.name === 'right') {
        moveShip(1, 0);
    }
});

function moveShip(dx: number, dy: number) {
    ship.x = Math.min(Math.max(ship.x + dx, 0), width - 1);
    ship.y = Math.min(Math.max(ship.y + dy, 0), height - 1);

    // Check if ship hits an asteroid
    for (let asteroid of asteroids) {
        if (ship.x === asteroid.x && ship.y === asteroid.y) {
            console.log('\nYou were hit by an asteroid! Game Over.');
            gameRunning = false;
            rl.close();
            break;
        }
    }
}

function render() {
    console.clear();
    const field = Array.from({ length: height }, () => Array(width).fill(' '));

    // Place asteroids
    asteroids.forEach(({ x, y }) => {
        field[y][x] = '*';
    });

    // Place ship
    field[ship.y][ship.x] = '^';

    console.log(field.map(row => row.join('')).join('\n'));
    console.log('\nUse arrow keys to move. Press "q" to quit.');
}

function gameLoop() {
    if (gameRunning) {
        render();
        setTimeout(gameLoop, 100);
    } else {
        console.log('Thanks for playing!');
        process.exit();
    }
}

gameLoop();
