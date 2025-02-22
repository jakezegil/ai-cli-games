//generated with gpt-4o


class AngryBirdsCLI {
  targetDistance: number;
  launchVelocity: number;
  attempts: number;

  constructor() {
    this.targetDistance = Math.floor(Math.random() * 50) + 20;  // Random target distance between 20 and 70
    this.launchVelocity = 0;
    this.attempts = 0;
  }

  getUserInput(prompt: string): number {
    const userInput = require('readline-sync');
    return parseFloat(userInput.question(prompt));
  }

  launchBird(angle: number, velocity: number): number {
    const radians = (angle * Math.PI) / 180;
    const distance = Math.round((velocity * velocity * Math.sin(2 * radians)) / 9.8);
    return distance;
  }

  play() {
    console.log("Welcome to Angry Birds CLI!");
    console.log("Try to hit the target by adjusting your launch angle and velocity.\n");

    while (true) {
      this.attempts += 1;
      const angle = this.getUserInput("Enter launch angle (degrees): ");
      this.launchVelocity = this.getUserInput("Enter launch velocity: ");

      const distance = this.launchBird(angle, this.launchVelocity);
      
      console.log(`Your bird landed at: ${distance}`);

      if (distance === this.targetDistance) {
        console.log(`Congratulations! You hit the target at ${this.targetDistance} in ${this.attempts} attempts!`);
        break;
      } else if (distance < this.targetDistance) {
        console.log("Too short! Try increasing the velocity or angle.");
      } else {
        console.log("Too far! Try decreasing the velocity or angle.");
      }
    }
  }
}

const game = new AngryBirdsCLI();
game.play();
