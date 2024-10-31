//generated with gpt-4o-mini


import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

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
    private width = 20;
    private height = 10;
    private snake: Point[];
    private direction: Direction;
    private fruit: Point[];
    private score: number;
    private highScore: number;
    private speed: number; // Speed represented in milliseconds
    private obstacles: Point[];

    constructor() {
        this.snake = [{ x: 5, y: 5 }];
        this.direction = Direction.Right;
        this.fruit = this.randomFruits(3);
        this.score = 0;
        this.highScore = 0;
        this.speed = 200;
        this.obstacles = this.randomObstacles(5);
    }

    private randomFruits(count: number): Point[] {
        const fruits: Point[] = [];
        while (fruits.length < count) {
            const fruit: Point = {
                x: Math.floor(Math.random() * this.width),
                y: Math.floor(Math.random() * this.height)
            };
            if (!this.isPointOccupied(fruit) && !fruits.some(f => f.x === fruit.x && f.y === fruit.y)) {
                fruits.push(fruit);
            }
        }
        return fruits;
    }

    private randomObstacles(count: number): Point[] {
        const obstacles: Point[] = [];
        while (obstacles.length < count) {
            const obstacle: Point = {
                x: Math.floor(Math.random() * this.width),
                y: Math.floor(Math.random() * this.height)
            };
            if (!this.isPointOccupied(obstacle) && !obstacles.some(o => o.x === obstacle.x && o.y === obstacle.y)) {
                obstacles.push(obstacle);
            }
        }
        return obstacles;
    }

    private isPointOccupied(point: Point): boolean {
        return this.snake.some(segment => segment.x === point.x && segment.y === point.y) ||
               this.obstacles.some(obstacle => obstacle.x === point.x && obstacle.y === point.y);
    }

    private processInput(input: string) {
        switch (input) {
            case 'w':
                if (this.direction !== Direction.Down) this.direction = Direction.Up;
                break;
            case 's':
                if (this.direction !== Direction.Up) this.direction = Direction.Down;
                break;
            case 'a':
                if (this.direction !== Direction.Right) this.direction = Direction.Left;
                break;
            case 'd':
                if (this.direction !== Direction.Left) this.direction = Direction.Right;
                break;
        }
    }

    private update() {
        const head = { ...this.snake[0] };

        // Move the snake in the current direction
        switch (this.direction) {
            case Direction.Up: head.y--; break;
            case Direction.Down: head.y++; break;
            case Direction.Left: head.x--; break;
            case Direction.Right: head.x++; break;
        }

        this.snake.unshift(head);

        // Check if the snake eats a fruit
        const fruitIndex = this.fruit.findIndex(f => head.x === f.x && head.y === f.y);
        if (fruitIndex !== -1) {
            this.score++;
            this.fruit.splice(fruitIndex, 1);
            if (this.score % 5 === 0) {
                this.speed = Math.max(100, this.speed - 20); // Increase speed every 5 points
            }
            this.fruit = this.fruit.concat(this.randomFruits(1));
        } else {
            this.snake.pop(); // Remove the tail if no fruit is eaten
        }

        // Check for game over conditions
        if (this.isGameOver()) {
            this.endGame();
        }
    }

    private isGameOver(): boolean {
        const head = this.snake[0];
        return (
            head.x < 0 ||
            head.x >= this.width ||
            head.y < 0 ||
            head.y >= this.height ||
            this.snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y) ||
            this.obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)
        );
    }

    private endGame() {
        console.log('Game Over! Your score was: ' + this.score);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            console.log('New high score!');
        }
        process.exit(0);
    }

    private render() {
        console.clear();
        let output = '';

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.snake[0].x === x && this.snake[0].y === y) {
                    output += 'O'; // head of the snake
                } else if (this.snake.some(segment => segment.x === x && segment.y === y)) {
                    output += 'X'; // body of the snake
                } else if (this.fruit.some(f => f.x === x && f.y === y)) {
                    output += '*'; // fruit
                } else if (this.obstacles.some(o => o.x === x && o.y === y)) {
                    output += '#'; // obstacle
                } else {
                    output += ' ';
                }
            }
            output += '\n';
        }

        output += `Score: ${this.score}\n`;
        output += `High Score: ${this.highScore}\n`;
        console.log(output);
    }

    public start() {
        setInterval(() => {
            this.update();
            this.render();
        }, this.speed);

        rl.on('line', (input) => this.processInput(input));
    }
}

const game = new SnakeGame();
game.start();
