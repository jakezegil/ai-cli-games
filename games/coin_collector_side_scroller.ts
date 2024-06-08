
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Player {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  moveUp() {
    if (this.y > 0) {
      this.y--;
    }
  }

  moveDown(maxY: number) {
    if (this.y < maxY) {
      this.y++;
    }
  }
}

class Coin {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Game {
  player: Player;
  coins: Coin[];
  height: number;
  width: number;

  constructor(height: number, width: number) {
    this.player = new Player(0, 0);
    this.coins = [];
    this.height = height;
    this.width = width;
    this.generateCoins();
  }

  generateCoins() {
    this.coins = [];
    for (let i = 0; i < this.width; i++) {
      const coin = new Coin(i, Math.floor(Math.random() * this.height));
      this.coins.push(coin);
    }
  }

  drawGame() {
    let gameBoard: string[][] = new Array(this.height).fill(null).map(() => new Array(this.width).fill(' '));
    
    for (const coin of this.coins) {
      gameBoard[coin.y][coin.x] = 'o';
    }

    gameBoard[this.player.y][this.player.x] = 'P';

    for (let row of gameBoard) {
      console.log(row.join(''));
    }
  }

  collectCoin() {
    const collectedCoins = this.coins.filter((coin) => coin.x === this.player.x && coin.y === this.player.y);

    for (const coin of collectedCoins) {
      this.coins = this.coins.filter((c) => c !== coin);
    }
  }

  play() {
    this.drawGame();

    rl.on('line', (input) => {
      if (input === 'w') {
        this.player.moveUp();
      } else if (input === 's') {
        this.player.moveDown(this.height - 1);
      }
      
      this.collectCoin();

      if (this.coins.length === 0) {
        console.log('You collected all coins! You win!');
        rl.close();
      } else {
        this.drawGame();
      }
    });
  }
}

const game = new Game(5, 20);
game.play();
