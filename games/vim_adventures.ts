//generated with gpt-4o


import readline from 'readline';

type GridCell = '.' | '#' | 'O' | 'X' | '*' | 'E';
const OBSTACLE = '#';
const PLAYER = 'O';
const GOAL = 'X';
const POWER_UP = '*';
const ENEMY = 'E';

interface Position {
  x: number;
  y: number;
}

interface GameOptions {
  width: number;
  height: number;
  obstacleCount: number;
  enemyCount: number;
  powerUpCount: number;
}

class VimAdventures {
  grid: GridCell[][];
  playerPosition: Position;
  goalPosition: Position;
  obstacles: Position[];
  enemies: Position[];
  powerUps: Position[];
  score: number;
  level: number;
  gameOptions: GameOptions;

  constructor(gameOptions: GameOptions) {
    this.gameOptions = gameOptions;
    this.grid = this.createGrid(gameOptions.width, gameOptions.height);
    this.playerPosition = { x: 0, y: 0 };
    this.goalPosition = { x: gameOptions.width - 1, y: gameOptions.height - 1 };
    this.obstacles = [];
    this.enemies = [];
    this.powerUps = [];
    this.score = 0;
    this.level = 1;
    this.initializeGame();
  }

  createGrid(width: number, height: number): GridCell[][] {
    return Array.from({ length: height }, () =>
      Array.from({ length: width }, () => '.')
    );
  }

  initializeGame(): void {
    this.placeGoal();
    this.placeObstacles();
    this.placePowerUps();
    this.placeEnemies();
  }

  placeGoal(): void {
    this.grid[this.goalPosition.y][this.goalPosition.x] = GOAL;
  }
  
  placeObstacles(): void {
    for (let i = 0; i < this.gameOptions.obstacleCount; i++) {
      const pos = this.randomEmptyPosition();
      this.grid[pos.y][pos.x] = OBSTACLE;
      this.obstacles.push(pos);
    }
  }
  
  placePowerUps(): void {
    for (let i = 0; i < this.gameOptions.powerUpCount; i++) {
      const pos = this.randomEmptyPosition();
      this.grid[pos.y][pos.x] = POWER_UP;
      this.powerUps.push(pos);
    }
  }

  placeEnemies(): void {
    for (let i = 0; i < this.gameOptions.enemyCount; i++) {
      const pos = this.randomEmptyPosition();
      this.grid[pos.y][pos.x] = ENEMY;
      this.enemies.push(pos);
    }
  }

  randomEmptyPosition(): Position {
    let x, y;
    do {
      x = Math.floor(Math.random() * this.grid[0].length);
      y = Math.floor(Math.random() * this.grid.length);
    } while (this.grid[y][x] !== '.' || (x === 0 && y === 0));
    return { x, y };
  }

  displayGrid(): void {
    console.clear();
    for (let y = 0; y < this.grid.length; y++) {
      let row = '';
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.playerPosition.x === x && this.playerPosition.y === y) {
          row += PLAYER;
        } else {
          row += this.grid[y][x];
        }
      }
      console.log(row);
    }
    console.log(`Score: ${this.score}`);
  }

  movePlayer(dx: number, dy: number): void {
    const newX = this.playerPosition.x + dx;
    const newY = this.playerPosition.y + dy;
    if (newX >= 0 && newX < this.grid[0].length && newY >= 0 && newY < this.grid.length) {
      if (this.grid[newY][newX] !== OBSTACLE) {
        this.playerPosition = { x: newX, y: newY };
        this.checkSpecialCells(newX, newY);
      }
    }
  }

  checkSpecialCells(x: number, y: number): void {
    if (this.grid[y][x] === POWER_UP) {
      this.score += 10;
      this.grid[y][x] = '.';
    }
    if (this.grid[y][x] === ENEMY) {
      console.log("You've been caught by an enemy! Game over!");
      process.exit();
    }
    if (x === this.goalPosition.x && y === this.goalPosition.y) {
      console.log(`Congratulations! You've reached the goal with a score of ${this.score}!`);
      process.exit();
    }
  }

  moveEnemies(): void {
    this.enemies.forEach(enemy => {
      const dx = Math.round(Math.random() * 2 - 1);
      const dy = Math.round(Math.random() * 2 - 1);
      const newX = enemy.x + dx;
      const newY = enemy.y + dy;
      if (newX >= 0 && newX < this.grid[0].length && newY >= 0 && newY < this.grid.length) {
        if (this.grid[newY][newX] === '.') {
          enemy.x = newX;
          enemy.y = newY;
        }
      }
    });
  }

  handleInput(input: string): void {
    switch (input) {
      case 'h': this.movePlayer(-1, 0); break;
      case 'l': this.movePlayer(1, 0); break;
      case 'j': this.movePlayer(0, 1); break;
      case 'k': this.movePlayer(0, -1); break;
    }
    this.moveEnemies();
    this.displayGrid();
  }

  mainLoop(): void {
    this.displayGrid();
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.on('line', (input) => {
      this.handleInput(input);
      rl.prompt();
    }).on('close', () => {
      console.log('Game over!');
      process.exit(0);
    });

    rl.setPrompt('> ');
    rl.prompt();
  }
}

const gameOptions: GameOptions = {
  width: 10,
  height: 5,
  obstacleCount: 10,
  enemyCount: 2,
  powerUpCount: 3,
};

const game = new VimAdventures(gameOptions);
game.mainLoop();
