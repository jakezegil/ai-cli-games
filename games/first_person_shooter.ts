
import * as readline from 'readline';

class FPSGame {
    private health: number;
    private enemies: number;
    private ammo: number;
    private rl: readline.Interface;

    constructor() {
        this.health = 100;
        this.enemies = 5;
        this.ammo = 10;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.startGame();
    }

    private startGame() {
        console.log("Welcome to the FPS Game!");
        this.gameLoop();
    }

    private gameLoop() {
        this.render();
        this.rl.question("Choose an action (shoot, reload, exit): ", (action) => {
            this.handleInput(action);
        });
    }

    private handleInput(action: string) {
        switch (action.toLowerCase()) {
            case 'shoot':
                this.shoot();
                break;
            case 'reload':
                this.reload();
                break;
            case 'exit':
                console.log("Thanks for playing!");
                this.rl.close();
                return;
            default:
                console.log("Invalid action. Try again.");
        }
        if (this.health > 0 && this.enemies > 0) {
            this.gameLoop();
        } else {
            this.endGame();
        }
    }

    private shoot() {
        if (this.ammo > 0) {
            console.log("Bang! You shot an enemy!");
            this.enemies--;
            this.ammo--;
            if (this.enemies === 0) {
                console.log("You've defeated all enemies!");
            } else {
                this.takeDamage();
            }
        } else {
            console.log("Out of ammo! Reload to continue fighting.");
        }
    }

    private reload() {
        console.log("Reloading...");
        this.ammo = 10;
        console.log("Ammo reloaded!");
    }

    private takeDamage() {
        const damage = Math.floor(Math.random() * 20);
        this.health -= damage;
        console.log(`An enemy hit you! You took ${damage} damage.`);
        if (this.health <= 0) {
            console.log("You've been defeated! Game over.");
        }
    }

    private render() {
        console.log(`\nHealth: ${this.health}`);
        console.log(`Enemies remaining: ${this.enemies}`);
        console.log(`Ammo: ${this.ammo}\n`);
    }

    private endGame() {
        if (this.health <= 0) {
            console.log("Game Over! You didn't survive.");
        } else if (this.enemies <= 0) {
            console.log("Congratulations! You won the battle!");
        }
        this.rl.close();
    }
}

new FPSGame();
