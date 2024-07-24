
class ChessGame {
    private board: string[][];

    constructor() {
        // Initialize an 8x8 chess board
        this.board = [
            ["r", "n", "b", "q", "k", "b", "n", "r"],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            ["R", "N", "B", "Q", "K", "B", "N", "R"]
        ];
    }

    public displayBoard() {
        console.log("  a b c d e f g h");
        console.log(" +----------------");
        for (let i = 0; i < 8; i++) {
            let row = (8 - i) + '|';
            for (let j = 0; j < 8; j++) {
                row += this.board[i][j] + ' ';
            }
            console.log(row);
        }
        console.log(" +----------------");
    }

    public move(from: string, to: string): boolean {
        const fromRow = 8 - parseInt(from[1], 10);
        const fromCol = from[0].charCodeAt(0) - 'a'.charCodeAt(0);
        const toRow = 8 - parseInt(to[1], 10);
        const toCol = to[0].charCodeAt(0) - 'a'.charCodeAt(0);

        // Basic move validation
        if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
            const piece = this.board[fromRow][fromCol];
            this.board[fromRow][fromCol] = " ";
            this.board[toRow][toCol] = piece;
            return true;
        }
        return false;
    }

    private isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
        // Basic checks
        if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7 ||
            toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
            return false;
        }
        const piece = this.board[fromRow][fromCol];
        if (piece === " ") return false; // No piece to move

        // Add additional validation for pieces moving here...

        return true; // Assume valid for now
    }

    public play() {
        const stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.resume();

        this.displayBoard();
        console.log("Enter your move (e.g., 'e2 e4'):");

        const readLine = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readLine.on('line', (input: string) => {
            const [from, to] = input.split(' ');
            if (this.move(from, to)) {
                this.displayBoard();
            } else {
                console.log("Invalid move. Try again.");
            }
        });
    }
}

const game = new ChessGame();
game.play();
