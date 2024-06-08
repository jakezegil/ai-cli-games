
import readline from 'readline';

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

interface Point {
  x: number;
  y: number;
}

class Snake {
  body: Point[] = [{ x: 5, y: 5 }];
  direction: Direction = Direction.Right;

  move() {
    const head = this.body[0];
    let newHead: Point;

    switch (this.direction) {
      case Direction.Up:
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case Direction.Down:
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case Direction.Left:
        newHead = { x: head.x - 1, y: head.y };
        break;
      case Direction.Right:
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    this.body.unshift(newHead);
    this.body.pop();
  }

  changeDirection(newDirection: Direction) {
    if (this.isOppositeDirection(this.direction, newDirection)) {
      return;
    }
    this.direction = newDirection;
  }

  isOppositeDirection(dir1: Direction, dir2: Direction) {
    return (dir1 === Direction.Up && dir2 === Direction.Down) ||
      (dir1 === Direction.Down && dir2 === Direction.Up) ||
      (dir1 === Direction.Left && dir2 === Direction.Right) ||
      (dir1 === Direction.Right && dir2 === Direction.Left);
  }

  grow() {
    const tail = this.body[this.body.length - 1];
    this.body.push({ x: tail.x, y: tail.y });
  }
}

class Game {
  snake: Snake = new Snake();
  food: Point = { x: 10, y: 10 };

  inputListener = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  setup() {
    this.inputListener.on('keypress', (str, key) => {
      if (key.name === 'up') {
        this.snake.changeDirection(Direction.Up);
      } else if (key.name === 'down') {
        this.snake.changeDirection(Direction.Down);
      } else if (key.name === 'left') {
        this.snake.changeDirection(Direction.Left);
      } else if (key.name === 'right') {
        this.snake.changeDirection(Direction.Right);
      }
    });
  }

  render() {
    const board: string[][] = [];

    for (let y = 0; y < 20; y++) {
      const row: string[] = [];
      for (let x = 0; x < 20; x++) {
        row.push(' ');
      }
      board.push(row);
    }

    this.snake.body.forEach((point) => {
      const { x, y } = point;
      board[y][x] = '■';
    });

    const { x, y } = this.food;
    board[y][x] = '●';

    board.forEach((row) => {
      console.log(row.join(''));
    });
  }

  start() {
    this.setup();
    setInterval(() => {
      this.snake.move();
      this.render();
    }, 100);
  }
}

const game = new Game();
game.start();
