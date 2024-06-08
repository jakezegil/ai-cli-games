
class Player {
  public health: number;
  public weapon: string;
  public position: string;

  constructor(health: number, weapon: string, position: string) {
    this.health = health;
    this.weapon = weapon;
    this.position = position;
  }

  public explore() {
    console.log("You move to an unexplored area...");
    // Add logic to handle exploration, enemy encounters, etc.
  }

  public attack() {
    console.log("You attack with your " + this.weapon + "!");
    // Add logic to handle combat with enemies.
  }
}

class Game {
  private player: Player;

  constructor() {
    this.player = new Player(100, "Blaster", "Starting Area");
  }

  public start() {
    console.log("Welcome to Super Metroid Adventure!");
    console.log("You find yourself in the " + this.player.position);

    // Game loop
    while (this.player.health > 0) {
      // Handle player input
      const input = prompt(
        "What will you do? (explore/attack/quit)"
      );

      if (input === "explore") {
        this.player.explore();
      } else if (input === "attack") {
        this.player.attack();
      } else if (input === "quit") {
        console.log("Quitting game...");
        break;
      } else {
        console.log("Invalid command!");
      }
    }

    // End of game
    console.log("Game over!");
  }
}

// Start the game
const game = new Game();
game.start();
