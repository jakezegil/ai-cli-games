//generated with gpt-4o-mini


import * as readline from 'readline';

const WIDTH = 20;
const HEIGHT = 10;
const EMPTY = ' ';
const WALL = '#';
const FOOD = '.';
const PACMAN = 'P';
const GHOST = 'G';
const POWER_UP = 'O'; // new power-up icon
const GHOST_COUNT = 3; // number of ghosts
const POWER_UP_DURATION = 10; // turns the power-up lasts

type Position = { x: number; y: number };

class Game {
    grid: string[][];
    pacmanPosition: Position;
    ghostPositions: Position[];
    score: number;
    powerUps: Position[];
    powerUpActive: boolean;
    turnCount: number;

    constructor() {
        this.grid = this.createGrid();
        this.pacmanPosition = { x: 1, y: 1 };
        this.ghostPositions = this.createGhosts();
        this.score = 0;
        this.powerUps = this.createPowerUps();
        this.powerUpActive = false;
        this.turnCount = 0;
    }

    createGrid(): string[][] {
        const grid = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(EMPTY));
        for (let i = 0; i < HEIGHT; i++) {
            for (let j = 0; j < WIDTH; j++) {
                if (i === 0 || i === HEIGHT - 1 || j === 0 || j === WIDTH - 1) {
                    grid[i][j] = WALL; // Create walls
                } else if (Math.random() < 0.2) {
                    grid[i][j] = FOOD; // Randomly place food
                }
            }
        }
        return grid;
    }

    createGhosts(): Position[] {
        const ghosts: Position[] = [];
        for (let i = 0; i < GHOST_COUNT; i++) {
            let position;
            do {
                position = { x: Math.floor(Math.random() * (WIDTH - 2)) + 1, y: Math.floor(Math.random() * (HEIGHT - 2)) + 1 };
            } while (this.grid[position.y][position.x] !== EMPTY);
            ghosts.push(position);
        }
        return ghosts;
    }

    createPowerUps(): Position[] {
        const powerUps: Position[] = [];
        while (powerUps.length < 2) {
            const position = { x: Math.floor(Math.random() * (WIDTH - 2)) + 1, y: Math.floor(Math.random() * (HEIGHT - 2)) + 1 };
            if (this.grid[position.y][position.x] === EMPTY) {
                powerUps.push(position);
                this.grid[position.y][position.x] = POWER_UP; // Place the power-up in the grid
            }
        }
        return powerUps;
    }

    render() {
        this.grid[this.pacmanPosition.y][this.pacmanPosition.x] = PACMAN;
        this.ghostPositions.forEach(g => this.grid[g.y][g.x] = GHOST);

        console.clear();
        console.log(`Score: ${this.score}`);
        console.log(`Power-Up Active: ${this.powerUpActive ? 'Yes' : 'No'}`);
        console.log(`Turns Remaining: ${this.powerUpActive ? POWER_UP_DURATION - this.turnCount : 0}`);
        this.grid.forEach(row => console.log(row.join('')));

        this.grid[this.pacmanPosition.y][this.pacmanPosition.x] = EMPTY; // Clear Pac-Man from its position
    }

    movePacman(direction: string) {
        const { x, y } = this.pacmanPosition;
        let newPos: Position = { x, y };

        switch (direction) {
            case 'w': newPos.y = Math.max(1, y - 1); break; // Up
            case 's': newPos.y = Math.min(HEIGHT - 2, y + 1); break; // Down
            case 'a': newPos.x = Math.max(1, x - 1); break; // Left
            case 'd': newPos.x = Math.min(WIDTH - 2, x + 1); break; // Right
        }

        // Check for collisions with food or power-ups
        if (this.grid[newPos.y][newPos.x] === FOOD) {
            this.score++;
            this.grid[newPos.y][newPos.x] = EMPTY; // Remove food after eating
        }

        if (this.grid[newPos.y][newPos.x] === POWER_UP) {
            this.powerUpActive = true; // Activate power-up
            this.turnCount = 0; // Reset turn count
            this.powerUps = this.powerUps.filter(p => p.x !== newPos.x || p.y !== newPos.y); // Remove power-up from the grid
            console.log('Power-Up collected!');
        }

        this.pacmanPosition = newPos;
    }

    moveGhosts() {
        this.ghostPositions.forEach((ghost, index) => {
            const directions = [
                { x: 0, y: -1 }, // Up
                { x: 0, y: 1 },  // Down
                { x: -1, y: 0 }, // Left
                { x: 1, y: 0 }   // Right
            ];
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            const newGhostPos: Position = {
                x: ghost.x + randomDirection.x,
                y: ghost.y + randomDirection.y
            };

            // Check ghost movement does not go through walls
            if (this.grid[newGhostPos.y][newGhostPos.x] !== WALL) {
                this.ghostPositions[index] = newGhostPos; // Move the ghost
            }

            // Check collision with Pac-Man
            if (newGhostPos.x === this.pacmanPosition.x && newGhostPos.y === this.pacmanPosition.y) {
                if (this.powerUpActive) {
                    this.score += 5; // Bonus points for eating a ghost
                    console.log('Ghost eaten!');
                } else {
                    console.log('Game Over! You were caught by a ghost!');
                    process.exit();
                }
            }
        });
    }

    run() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true
        });

        const loop = () => {
            this.render();
            this.moveGhosts();
            if (this.powerUpActive) {
                this.turnCount++;
                if (this.turnCount >= POWER_UP_DURATION) {
                    this.powerUpActive = false; // Deactivate power-up after duration
                }
            }

            rl.question('Move (w/a/s/d) or exit: ', (answer) => {
                if (answer === 'exit') {
                    rl.close();
                    return;
                }
                this.movePacman(answer);
                loop();
            });
        };

        loop();
    }
}

const game = new Game();
game.run();
