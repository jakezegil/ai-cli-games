//generated with gpt-4o-mini


import * as readline from 'readline';

interface Creature {
    name: string;
    health: number;
    attack: number;
}

interface PlayerClass {
    name: string;
    health: number;
    attack: number;
    specialAbility?: () => void;
}

class Player {
    name: string;
    playerClass: PlayerClass;
    experience: number;
    level: number;

    constructor(name: string, playerClass: PlayerClass) {
        this.name = name;
        this.playerClass = playerClass;
        this.experience = 0;
        this.level = 1;
    }

    isAlive(): boolean {
        return this.playerClass.health > 0;
    }

    takeDamage(amount: number): void {
        this.playerClass.health -= amount;
    }

    gainExperience(amount: number): void {
        this.experience += amount;
        if (this.experience >= 100) {
            this.levelUp();
        }
    }

    levelUp(): void {
        this.level++;
        this.playerClass.health += 20; // Increase health on level up
        this.playerClass.attack += 5; // Increase attack on level up
        this.experience = 0; // Reset experience
        console.log(`${this.name} leveled up! You are now level ${this.level}.`);
    }
}

class Quest {
    description: string;
    experienceReward: number;

    constructor(description: string, experienceReward: number) {
        this.description = description;
        this.experienceReward = experienceReward;
    }
}

class Enemy implements Creature {
    name: string;
    health: number;
    attack: number;

    constructor(name: string, health: number, attack: number) {
        this.name = name;
        this.health = health;
        this.attack = attack;
    }
}

class Game {
    private player: Player;
    private enemies: Enemy[];
    private quests: Quest[];
    private currentEnemyIndex: number;

    constructor(playerName: string, playerClass: PlayerClass) {
        this.player = new Player(playerName, playerClass);
        this.enemies = [
            new Enemy("Goblin", 30, 5),
            new Enemy("Orc", 50, 10),
            new Enemy("Dragon", 100, 15),
        ];
        this.quests = [
            new Quest("Defeat 2 Goblins", 50),
            new Quest("Slay an Orc", 75),
            new Quest("Slay the Dragon", 150),
        ];
        this.currentEnemyIndex = 0;
    }

    private displayStatus(): void {
        console.log(`\nPlayer: ${this.player.name} | Health: ${this.player.playerClass.health} | Level: ${this.player.level} | Experience: ${this.player.experience}`);
        if (this.currentEnemyIndex < this.enemies.length) {
            console.log(`Current Enemy: ${this.enemies[this.currentEnemyIndex].name} | Health: ${this.enemies[this.currentEnemyIndex].health}`);
        }
    }

    private enemyTurn(): void {
        if (this.currentEnemyIndex >= this.enemies.length) return;

        const enemy = this.enemies[this.currentEnemyIndex];
        this.player.takeDamage(enemy.attack);
        console.log(`${enemy.name} attacks you for ${enemy.attack} damage!`);
    }

    public start(): void {
        console.log(`Welcome to the World of War, ${this.player.name}!`);
        this.gameLoop();
    }

    private gameLoop(): void {
        this.displayStatus();

        if (!this.player.isAlive()) {
            console.log("You have been defeated! Game Over.");
            return;
        }

        if (this.currentEnemyIndex >= this.enemies.length) {
            console.log("You have defeated all the enemies! You win!");
            return;
        }

        const enemy = this.enemies[this.currentEnemyIndex];

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('Do you want to (A)ttack, (R)un or (Q)uest? ', (answer) => {
            if (answer.toLowerCase() === 'a') {
                const damageDealt = this.player.playerClass.attack;
                enemy.health -= damageDealt;
                console.log(`You attack the ${enemy.name} for ${damageDealt} damage!`);
                
                if (enemy.health <= 0) {
                    console.log(`You have defeated the ${enemy.name}!`);
                    this.player.gainExperience(50); // Experience reward for defeating the enemy
                    this.currentEnemyIndex++;
                } else {
                    this.enemyTurn();
                }
            } else if (answer.toLowerCase() === 'r') {
                console.log("You ran away!");
                rl.close();
                return;
            } else if (answer.toLowerCase() === 'q') {
                this.completeQuest();
            } else {
                console.log("Invalid choice, please try again.");
            }

            rl.close();
            this.gameLoop();
        });
    }

    private completeQuest(): void {
        console.log("Available Quests:");
        this.quests.forEach((quest, index) => {
            console.log(`${index + 1}: ${quest.description} (Reward: ${quest.experienceReward} EXP)`);
        });

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('Which quest do you want to complete? (1/2/3) ', (answer) => {
            const questIndex = parseInt(answer) - 1;

            if (questIndex >= 0 && questIndex < this.quests.length) {
                this.player.gainExperience(this.quests[questIndex].experienceReward);
                console.log(`You completed the quest: ${this.quests[questIndex].description}!`);
            } else {
                console.log("Invalid quest index.");
            }
            rl.close();
            this.gameLoop();
        });
    }
}

// Define available player classes
const playerClasses: PlayerClass[] = [
    { name: "Warrior", health: 120, attack: 15 },
    { name: "Mage", health: 80, attack: 10, specialAbility: () => console.log("Casting Fireball!") },
    { name: "Rogue", health: 100, attack: 12 },
];

// Start the game
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("Choose your class:");
playerClasses.forEach((playerClass, index) => {
    console.log(`${index + 1}: ${playerClass.name}`);
});

rl.question('Please select a class (1/2/3): ', (classIndex) => {
    const selectedClassIndex = parseInt(classIndex) - 1;
    if (selectedClassIndex >= 0 && selectedClassIndex < playerClasses.length) {
        rl.question('What is your character\'s name? ', (name) => {
            const game = new Game(name, playerClasses[selectedClassIndex]);
            game.start();
        });
    } else {
        console.log("Invalid class selection.");
        rl.close();
    }
});
