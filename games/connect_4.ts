//generated with gpt-4o-mini


const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

const ROWS: number = 6;
const COLS: number = 7;

let board: string[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(' '));
let currentPlayer: string;
let player1Marker: string = 'X';
let player2Marker: string = 'O';
let gameActive: boolean = true;

function printBoard(): void {
    console.clear();
    console.log('\n');
    board.forEach(row => console.log('|' + row.join('|') + '|'));
    console.log('|' + Array(COLS).fill('-').join('|') + '|');
    console.log(' ' + Array.from({ length: COLS }, (_, i) => i + 1).join(' '));
}

function isValidMove(col: number): boolean {
    return col >= 0 && col < COLS && board[0][col] === ' ';
}

function makeMove(col: number): boolean {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === ' ') {
            board[row][col] = currentPlayer;
            return true;
        }
    }
    return false;
}

function checkWin(): boolean {
    return checkDirection(1, 0) || checkDirection(0, 1) || checkDirection(1, 1) || checkDirection(1, -1);
}

function checkDirection(deltaRow: number, deltaCol: number): boolean {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] === currentPlayer) {
                if (checkLine(row, col, deltaRow, deltaCol)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function checkLine(row: number, col: number, deltaRow: number, deltaCol: number): boolean {
    for (let i = 0; i < 4; i++) {
        let r = row + i * deltaRow;
        let c = col + i * deltaCol;
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS || board[r][c] !== currentPlayer) {
            return false;
        }
    }
    return true;
}

function switchPlayer(): void {
    currentPlayer = currentPlayer === player1Marker ? player2Marker : player1Marker;
}

function promptMove(): void {
    readline.question(`Player ${currentPlayer}, choose a column (1-${COLS}): `, (input: string) => {
        const col = parseInt(input) - 1;
        if (isValidMove(col)) {
            makeMove(col);
            printBoard();
            if (checkWin()) {
                console.log(`Player ${currentPlayer} wins! 🎉`);
                gameActive = false;
                readline.question('Would you like to play again? (y/n): ', (response: string) => {
                    if (response.toLowerCase() === 'y') {
                        resetGame();
                        startGame();
                    } else {
                        console.log('Thanks for playing! Goodbye! 👋');
                        readline.close();
                    }
                });
                return;
            }
            switchPlayer();
            promptMove();
        } else {
            console.log('Invalid move. Choose another column. 🚫');
            promptMove();
        }
    });
}

function resetGame(): void {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(' '));
    currentPlayer = player1Marker; // Reset to Player 1
    gameActive = true;
    console.log('The game has been reset! 🎮');
}

function setMarkers(): void {
    readline.question('Player 1, choose your marker (default is X): ', (input1: string) => {
        player1Marker = input1 || 'X';
        readline.question('Player 2, choose your marker (default is O): ', (input2: string) => {
            player2Marker = input2 || 'O';
            currentPlayer = player1Marker; // Set starting player
            startGame();
        });
    });
}

function startGame(): void {
    console.log('Welcome to Connect Four! ⚽');
    printBoard();
    promptMove();
}

setMarkers();
