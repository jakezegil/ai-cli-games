//generated with gpt-4o


// Requirements: This code requires Node.js to run and an environment that supports ANSI escape codes for terminal graphics.
// Save this code in a file named `tetris.ts` and compile it using `tsc tetris.ts`. Run it using `node tetris.js`.

class Point {
    constructor(public x: number, public y: number) {}
}

type Matrix = number[][];

const WIDTH: number = 10;
const HEIGHT: number = 20;

const TETROMINOS: Matrix[] = [
    // I piece
    [
        [1, 1, 1, 1]
    ],
    // J piece
    [
        [0, 0, 1],
        [1, 1, 1]
    ],
    // L piece
    [
        [1, 0, 0],
        [1, 1, 1]
    ],
    // O piece
    [
        [1, 1],
        [1, 1]
    ],
    // S piece
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    // T piece
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    // Z piece
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
];

class Tetris {
    private grid: Matrix = this.createMatrix(WIDTH, HEIGHT);
    private currentPiece: Matrix;
    private position: Point = new Point(0, 0);

    constructor() {
        this.newPiece();
    }

    private createMatrix(width: number, height: number): Matrix {
        return Array.from(Array(height), () => Array(width).fill(0));
    }

    private newPiece() {
        const rand = Math.floor(Math.random() * TETROMINOS.length);
        this.currentPiece = TETROMINOS[rand];
        this.position = new Point((WIDTH / 2 | 0) - (this.currentPiece[0].length / 2 | 0), 0);
    }

    private collide(): boolean {
        for (let y = 0; y < this.currentPiece.length; ++y) {
            for (let x = 0; x < this.currentPiece[y].length; ++x) {
                if (this.currentPiece[y][x] !== 0 &&
                    (this.grid[y + this.position.y] && this.grid[y + this.position.y][x + this.position.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    private merge() {
        for (let y = 0; y < this.currentPiece.length; ++y) {
            for (let x = 0; x < this.currentPiece[y].length; ++x) {
                if (this.currentPiece[y][x] !== 0) {
                    this.grid[y + this.position.y][x + this.position.x] = this.currentPiece[y][x];
                }
            }
        }
    }

    private rotate(matrix: Matrix): Matrix {
        return matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
    }

    public drop() {
        this.position.y++;
        if (this.collide()) {
            this.position.y--;
            this.merge();
            this.newPiece();
        }
    }

    public move(direction: number) {
        this.position.x += direction;
        if (this.collide()) {
            this.position.x -= direction;
        }
    }

    public rotatePiece() {
        const pos = this.position.x;
        let offset = 1;
        this.currentPiece = this.rotate(this.currentPiece);

        while (this.collide()) {
            this.position.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.currentPiece[0].length) {
                this.currentPiece = this.rotate(this.currentPiece);
                this.position.x = pos;
                return;
            }
        }
    }

    public clearLines() {
        outer: for (let y = this.grid.length - 1; y > 0; --y) {
            for (let x = 0; x < this.grid[y].length; ++x) {
                if (this.grid[y][x] === 0) {
                    continue outer;
                }
            }
            const row = this.grid.splice(y, 1)[0].fill(0);
            this.grid.unshift(row);
        }
    }

    public draw(): void {
        console.clear();
        for (let y = 0; y < this.grid.length; ++y) {
            let row = '';
            for (let x = 0; x < this.grid[y].length; ++x) {
                if (this.grid[y][x] === 0) {
                    row += '.';
                } else {
                    row += '#';
                }
            }
            console.log(row);
        }
    }
}

const game = new Tetris();

function gameLoop() {
    game.drop();
    game.clearLines();
    game.draw();
    setTimeout(gameLoop, 500);
}

gameLoop();

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (key) => {
    if (key === '\u0003') {
        process.exit();
    }

    if (key === 'a') {
        game.move(-1);
    } else if (key === 'd') {
        game.move(1);
    } else if (key === 'w') {
        game.rotatePiece();
    } else if (key === 's') {
        game.drop();
    }
});
