
// Import necessary modules
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

const WIDTH = 20;
const HEIGHT = 10;

enum Direction {
    Up,
    Down,
    Left,
    Right
}

interface Point {
    x: number;
    y: number;
}

class SnakeGame {
    private snake: Point[];
    private direction: Direction;
    private food: Point;
    private gameOver: boolean;

    constructor() {
        this.snake = [{x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2)}];
        this.direction = Direction.Right;
        this.food = this.generateFood();
        this.gameOver = false;
    }

    private generateFood(): Point {
        let food: Point;
        do {
            food = {
                x: Math.floor(Math.random() * WIDTH),
                y: Math.floor(Math.random() * HEIGHT)
            };
        } while (this.isCollidingWithSnake(food));
        return food;
    }

    private isCollidingWithSnake(point: Point): boolean {
        return this.snake.some(segment => segment.x === point.x && segment.y === point.y);
    }

    private isCollidingWithWall(): boolean {
        const head = this.snake[0];
        return head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT;
    }

    private update(): void {
        if (this.gameOver) return;

        const head = { ...this.snake[0] };

        switch(this.direction) {
            case Direction.Up: head.y--; break;
            case Direction.Down: head.y++; break;
            case Direction.Left: head.x--; break;
            case Direction.Right: head.x++; break;
        }

        if (this.isCollidingWithWall() || this.isCollidingWithSnake(head)) {
            this.gameOver = true;
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.food = this.generateFood(); // Generate new food
        } else {
            this.snake.pop(); // Remove the tail
        }
    }

    public changeDirection(newDirection: Direction): void {
        if (Math.abs(this.direction - newDirection) !== 2) {
            this.direction = newDirection;
        }
    }

    public render(): void {
        console.clear();
        const board = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(' '));

        this.snake.forEach(segment => {
            board[segment.y][segment.x] = 'O'; // Snake body
        });

        board[this.food.y][this.food.x] = 'X'; // Food

        console.log(board.map(row => row.join('')).join('\n'));
        console.log(this.gameOver ? "Game Over! Press 'r' to restart or 'q' to quit." : "");
    }

    public play(): void {
        this.update();
        this.render();

        if (!this.gameOver) {
            setTimeout(() => this.play(), 100);
        }
    }
}

// Game control
const game = new SnakeGame();

const controlGame = () => {
    rl.on('line', (input) => {
        switch (input.trim()) {
            case 'w': game.changeDirection(Direction.Up); break;
            case 's': game.changeDirection(Direction.Down); break;
            case 'a': game.changeDirection(Direction.Left); break;
            case 'd': game.changeDirection(Direction.Right); break;
            case 'r': if (game['gameOver']) { game['snake'] = [{ x: WIDTH / 2, y: HEIGHT / 2 }]; game['food'] = game['generateFood'](); game['gameOver'] = false; game.play(); } break;
            case 'q': rl.close(); break;
        }
    });
}

controlGame();
game.play();
