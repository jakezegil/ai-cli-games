//generated with o1-preview


import * as readline from 'readline';

// Simple CLI Game: Call of Duty Black Ops (Text-based Version)
class Game {
    private playerHealth: number = 100;
    private enemyHealth: number = 100;
    private isRunning: boolean = true;
    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    constructor() {
        console.log("Welcome to Call of Duty: Black Ops CLI Edition!");
        this.mainLoop();
    }

    private async mainLoop(): Promise<void> {
        while (this.isRunning) {
            this.render();
            await this.handleInput();
            this.checkGameOver();
        }
        this.rl.close();
    }

    private render(): void {
        console.log("\n==============================");
        console.log(`Your Health: ${this.playerHealth}`);
        console.log(`Enemy Health: ${this.enemyHealth}`);
        console.log("==============================");
        console.log("Choose your action:");
        console.log("1. Shoot");
        console.log("2. Grenade");
        console.log("3. Heal");
        console.log("4. Retreat");
    }

    private handleInput(): Promise<void> {
        return new Promise((resolve) => {
            this.rl.question("> ", (input) => {
                switch (input.trim()) {
                    case '1':
                        this.shoot();
                        break;
                    case '2':
                        this.grenade();
                        break;
                    case '3':
                        this.heal();
                        break;
                    case '4':
                        this.retreat();
                        break;
                    default:
                        console.log("Invalid action. Please select 1-4.");
                        break;
                }
                resolve();
            });
        });
    }

    private shoot(): void {
        const damage = this.randomNumber(15, 25);
        console.log(`You shoot the enemy for ${damage} damage.`);
        this.enemyHealth -= damage;
        this.enemyAttack();
    }

    private grenade(): void {
        const chance = Math.random();
        if (chance > 0.5) {
            const damage = this.randomNumber(30, 50);
            console.log(`Direct hit! Grenade deals ${damage} damage.`);
            this.enemyHealth -= damage;
        } else {
            console.log("Grenade missed!");
        }
        this.enemyAttack();
    }

    private heal(): void {
        const healAmount = this.randomNumber(20, 30);
        console.log(`You heal yourself for ${healAmount} health.`);
        this.playerHealth += healAmount;
        if (this.playerHealth > 100) this.playerHealth = 100;
        this.enemyAttack();
    }

    private retreat(): void {
        const chance = Math.random();
        if (chance > 0.7) {
            console.log("You successfully retreated!");
            this.isRunning = false;
        } else {
            console.log("Retreat failed! The enemy attacks.");
            this.enemyAttack(true);
        }
    }

    private enemyAttack(isCounterAttack: boolean = false): void {
        if (this.enemyHealth <= 0) return;
        const damage = this.randomNumber(10, 20);
        if (isCounterAttack) {
            console.log(`Enemy counterattacks for ${damage} damage!`);
        } else {
            console.log(`Enemy attacks you for ${damage} damage.`);
        }
        this.playerHealth -= damage;
    }

    private checkGameOver(): void {
        if (this.playerHealth <= 0) {
            console.log("You have been defeated!");
            this.isRunning = false;
        } else if (this.enemyHealth <= 0) {
            console.log("Enemy defeated! You are victorious!");
            this.isRunning = false;
        }
    }

    private randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Start the game
new Game();
