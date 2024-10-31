//generated with gpt-4o


type Position = {
  x: number;
  y: number;
};

type Vector = {
  dx: number;
  dy: number;
};

class Asteroid {
  position: Position;
  direction: Vector;
  active: boolean;

  constructor(position: Position, direction: Vector) {
    this.position = position;
    this.direction = direction;
    this.active = true;
  }

  move() {
    this.position.x += this.direction.dx;
    this.position.y += this.direction.dy;

    // Wrap around if they move out of bounds
    if (this.position.x < 0) this.position.x += 20;
    if (this.position.x >= 20) this.position.x -= 20;
    if (this.position.y < 0) this.position.y += 10;
    if (this.position.y >= 10) this.position.y -= 10;
  }
}

class Bullet {
  position: Position;
  direction: Vector;
  active: boolean;

  constructor(position: Position, direction: Vector) {
    this.position = position;
    this.direction = direction;
    this.active = true;
  }

  move() {
    this.position.x += this.direction.dx;
    this.position.y += this.direction.dy;

    if (this.position.x < 0 || this.position.x >= 20 || this.position.y < 0 || this.position.y >= 10) {
      this.active = false;
    }
  }
}

class Game {
  shipPosition: Position;
  shipDirection: Vector;
  asteroids: Asteroid[];
  bullets: Bullet[];
  score: number;
  gameOver: boolean;

  constructor() {
    this.shipPosition = {x: 10, y: 5};
    this.shipDirection = {dx: 1, dy: 0};
    this.asteroids = [];
    this.bullets = [];
    this.score = 0;
    this.gameOver = false;

    this.spawnAsteroids();
  }

  spawnAsteroids() {
    for (let i = 0; i < 3; i++) {
      const position = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 10)};
      const direction = {dx: Math.random() > 0.5 ? 1 : -1, dy: Math.random() > 0.5 ? 1 : -1};
      this.asteroids.push(new Asteroid(position, direction));
    }
  }

  moveShip(dx: number, dy: number) {
    this.shipPosition.x += dx;
    this.shipPosition.y += dy;

    if (this.shipPosition.x < 0) this.shipPosition.x = 0;
    if (this.shipPosition.x >= 20) this.shipPosition.x = 19;
    if (this.shipPosition.y < 0) this.shipPosition.y = 0;
    if (this.shipPosition.y >= 10) this.shipPosition.y = 9;
  }

  shoot() {
    const bulletDirection = {...this.shipDirection};
    const bulletPosition = {...this.shipPosition};
    this.bullets.push(new Bullet(bulletPosition, bulletDirection));
  }

  update() {
    this.asteroids.forEach(asteroid => asteroid.move());
    this.bullets.forEach(bullet => bullet.move());

    // Check for collisions between bullets and asteroids
    this.bullets.forEach(bullet => {
      if (bullet.active) {
        this.asteroids.forEach(asteroid => {
          if (asteroid.active && asteroid.position.x === bullet.position.x && asteroid.position.y === bullet.position.y) {
            asteroid.active = false;
            bullet.active = false;
            this.score++;
          }
        });
      }
    });

    // Check for collisions between ship and asteroids
    this.asteroids.forEach(asteroid => {
      if (asteroid.active && asteroid.position.x === this.shipPosition.x && asteroid.position.y === this.shipPosition.y) {
        this.gameOver = true;
      }
    });

    // Remove inactive asteroids and bullets
    this.asteroids = this.asteroids.filter(asteroid => asteroid.active);
    this.bullets = this.bullets.filter(bullet => bullet.active);

    // Respawn asteroids if all are destroyed
    if (this.asteroids.length === 0) {
      this.spawnAsteroids();
    }
  }

  render() {
    const display = Array.from({length: 10}, () => Array(20).fill(' '));

    display[this.shipPosition.y][this.shipPosition.x] = 'S';

    this.asteroids.forEach(asteroid => {
      if (asteroid.active) {
        display[asteroid.position.y][asteroid.position.x] = 'A';
      }
    });

    this.bullets.forEach(bullet => {
      if (bullet.active) {
        display[bullet.position.y][bullet.position.x] = '*';
      }
    });

    console.clear();
    console.log(display.map(row => row.join('')).join('\n'));
    console.log(`Score: ${this.score}`);
    if (this.gameOver) {
      console.log('Game Over! Press Ctrl+C to exit.');
    }
  }

  run() {
    const readline = require('readline');
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    process.stdin.on('keypress', (_str, key) => {
      if (key.ctrl && key.name === 'c') process.exit();
      
      if (!this.gameOver) {
        switch (key.name) {
          case 'w': this.moveShip(0, -1); break;
          case 'a': this.moveShip(-1, 0); break;
          case 's': this.moveShip(0, 1); break;
          case 'd': this.moveShip(1, 0); break;
          case 'space': this.shoot(); break;
        }
      }
    });

    const gameLoop = () => {
      if (!this.gameOver) {
        this.update();
        this.render();
        setTimeout(gameLoop, 200);
      }
    };

    gameLoop();
  }
}

const game = new Game();
game.run();
