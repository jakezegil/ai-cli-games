
class TicTacToe {
  board: string[][];
  currentPlayer: string;
  
  constructor() {
    this.board = [
      [' ', ' ', ' '],
      [' ', ' ', ' '],
      [' ', ' ', ' ']
    ];
    this.currentPlayer = 'X';
  }

  printBoard(): void {
    for (let i = 0; i < 3; i++) {
      console.log(this.board[i].join(' | '));
      if (i < 2) {
        console.log('---------');
      }
    }
  }

  makeMove(row: number, col: number): void {
    if (this.board[row][col] === ' ') {
      this.board[row][col] = this.currentPlayer;
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    } else {
      console.log('Invalid move. Cell already taken.');
    }
  }

  checkWin(): string {
    for (let i = 0; i < 3; i++) {
      if (this.board[i][0] !== ' ' && this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2]) {
        return this.board[i][0];
      }
      if (this.board[0][i] !== ' ' && this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i]) {
        return this.board[0][i];
      }
    }
    if (this.board[0][0] !== ' ' && this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) {
      return this.board[0][0];
    }
    if (this.board[0][2] !== ' ' && this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) {
      return this.board[0][2];
    }
    return '';
  }
}

// Usage
let game = new TicTacToe();
game.printBoard();
game.makeMove(0, 0);
game.makeMove(1, 1);
game.makeMove(0, 1);
game.makeMove(1, 2);
game.makeMove(0, 2);
console.log('Winner: ', game.checkWin());
game.printBoard();
