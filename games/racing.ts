//generated with gpt-4o


import readline from 'readline';

// Player and computer classes
class Car {
  constructor(public position: number = 0, public name: string) {}

  // Move the car forward
  moveForward(steps: number = 1) {
    this.position += steps;
  }
}

const player = new Car(0, "You");
const computer = new Car(0, "Computer");
const finishLine = 20;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Welcome to the Insane CLI Racing Game!");
console.log("Press 'a' to move your car forward.");
console.log("Press 's' to use a nitro boost once per race.");
console.log("Press 'd' to drop an oil slick once per race.");

function render() {
  console.clear();
  console.log("Race to the finish line!");
  console.log(`${player.name}: ${'-'.repeat(player.position)}🚗`);
  console.log(`${computer.name}: ${'-'.repeat(computer.position)}🚙`);
}

let nitroAvailable = true;
let oilSlickAvailable = true;
let obstacle = -1;

function update(input: string) {
  switch (input.trim().toLowerCase()) {
    case 'a':
      player.moveForward();
      break;
    case 's':
      if (nitroAvailable) {
        player.moveForward(3);
        nitroAvailable = false;
        console.log("Nitro boost used!");
      }
      break;
    case 'd':
      if (oilSlickAvailable) {
        obstacle = player.position + Math.floor(Math.random() * 5) + 1; // random distance from current position
        oilSlickAvailable = false;
        console.log("Oil slick dropped on the track!");
      }
      break;
    default:
      console.log("Invalid input! Use 'a', 's', or 'd'.");
  }

  if (computer.position === obstacle) {
    console.log("Computer hit the oil slick and slowed down!");
  } else {
    computer.moveForward(Math.floor(Math.random() * 2));
  }
}

function checkWinner() {
  if (player.position >= finishLine) {
    console.log("Congratulations! You won!");
    process.exit();
  } else if (computer.position >= finishLine) {
    console.log("The computer won! Better luck next time.");
    process.exit();
  }
}

function gameLoop() {
  render();
  rl.question("Press 'a', 's', or 'd' to move: ", (input: string) => {
    update(input);
    checkWinner();
    setImmediate(gameLoop);
  });
}

render();
gameLoop();
