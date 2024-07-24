
import * as readline from 'readline';

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

class SnakeGame {
    private board: string[][];
    private snake: [number, number][];
    private direction: Direction;
    private food: [number, number];
    private score: number;
    private isGameOver: boolean;

    constructor(public width: number, public height: number) {
        this.board = Array.from({ length: height }, () => Array(width).fill(' '));
        this.snake = [[Math.floor(height / 2), Math.floor(width / 2)]];
        this.direction = Direction.RIGHT;
        this.score = 0;
        this.isGameOver = false;
        this.placeFood();
        this.render();
    }

    private placeFood() {
        let foodX, foodY;
        do {
            foodX = Math.floor(Math.random() * this.height);
            foodY = Math.floor(Math.random() * this.width);
        } while (this.snake.some(([x, y]) => x === foodX && y === foodY));
        this.food = [foodX, foodY];
    }

    public changeDirection(newDirection: Direction) {
        // Prevent reversing direction
        if (Math.abs(this.direction - newDirection) !== 2) {
            this.direction = newDirection;
        }
    }

    private moveSnake() {
        const head = this.snake[0];
        let newHead: [number, number];

        switch (this.direction) {
            case Direction.UP:
                newHead = [head[0] - 1, head[1]];
                break;
            case Direction.DOWN:
                newHead = [head[0] + 1, head[1]];
                break;
            case Direction.LEFT:
                newHead = [head[0], head[1] - 1];
                break;
            case Direction.RIGHT:
                newHead = [head[0], head[1] + 1];
                break;
        }

        // Check for collisions
        if (this.isCollision(newHead)) {
            this.isGameOver = true;
            return;
        }

        this.snake.unshift(newHead);
        if (newHead[0] === this.food[0] && newHead[1] === this.food[1]) {
            this.score++;
            this.placeFood();
        } else {
            this.snake.pop();
        }
    }

    private isCollision([x, y]: [number, number]): boolean {
        return (
            x < 0 || 
            x >= this.height || 
            y < 0 || 
            y >= this.width || 
            this.snake.slice(1).some(([sx, sy]) => sx === x && sy === y)
        );
    }

    public update() {
        if (!this.isGameOver) {
            this.moveSnake();
        }
    }

    public render() {
        console.clear();
        this.board = Array.from({ length: this.height }, () => Array(this.width).fill(' '));
        
        this.snake.forEach(([x, y]) => {
            this.board[x][y] = 'O';
        });

        const [foodX, foodY] = this.food;
        this.board[foodX][foodY] = 'X';

        this.board.forEach(row => console.log(row.join(' ')));
        console.log(`Score: ${this.score}`);
        if (this.isGameOver) {
            console.log('Game Over!');
        }
    }

    public getGameOver() {
        return this.isGameOver;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

const game = new SnakeGame(10, 10);
const tickInterval = 200; // Game speed

const tick = setInterval(() => {
    game.update();
    game.render();
    if (game.getGameOver()) {
        clearInterval(tick);
        rl.close();
    }
}, tickInterval);

rl.on('line', (input) => {
    switch (input.toLowerCase()) {
        case 'w':
            game.changeDirection(Direction.UP);
            break;
        case 's':
            game.changeDirection(Direction.DOWN);
            break;
        case 'a':
            game.changeDirection(Direction.LEFT);
            break;
        case 'd':
            game.changeDirection(Direction.RIGHT);
            break;
    }
});

console.log('Use WASD to control the snake. Press Enter to start!');
