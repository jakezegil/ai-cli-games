//generated with gpt-4o


class AsteroidGame {
    private grid: string[][] = [];
    private shipPosition: number = 10;
    private asteroidPosition: number[] = [];
    private gridSize: number = 20;
    private gameOver: boolean = false;

    constructor() {
        this.setupGrid();
        this.gameLoop();
    }

    private setupGrid() {
        for (let i = 0; i < this.gridSize; i++) {
            this.grid[i] = new Array(this.gridSize).fill(' ');
        }
    }

    private spawnAsteroid() {
        const position = Math.floor(Math.random() * this.gridSize);
        this.asteroidPosition.push(position);
    }

    private update() {
        if (Math.random() < 0.1) this.spawnAsteroid();

        this.asteroidPosition = this.asteroidPosition.map(pos => pos + 1);
        if (this.asteroidPosition.includes(this.shipPosition)) {
            this.gameOver = true;
        }
        this.asteroidPosition = this.asteroidPosition.filter(pos => pos < this.gridSize);

        // Clear grid
        this.grid.forEach(row => row.fill(' '));
        // Draw ship
        this.grid[this.gridSize - 1][this.shipPosition] = 'A';
        // Draw asteroids
        this.asteroidPosition.forEach(pos => this.grid[pos][this.shipPosition] = 'O');
    }

    private render() {
        console.clear();
        this.grid.forEach(row => console.log(row.join('')));
        console.log('Use "a" to move left, "d" to move right, "q" to quit.');
        if (this.gameOver) {
            console.log('Game Over!');
        }
    }

    private async gameLoop() {
        const stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        
        stdin.on('data', (key: string) => {
            if (key === '\u0003' || key === 'q') {
                process.exit();
            } else if (key === 'a') {
                this.shipPosition = Math.max(0, this.shipPosition - 1);
            } else if (key === 'd') {
                this.shipPosition = Math.min(this.gridSize - 1, this.shipPosition + 1);
            }
        });

        while (!this.gameOver) {
            this.update();
            this.render();
            await new Promise(res => setTimeout(res, 200));
        }
    }
}

new AsteroidGame();
