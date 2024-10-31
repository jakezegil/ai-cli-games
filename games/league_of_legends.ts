//generated with gpt-4o-mini


import * as readline from 'readline';

class Champion {
    public ultimateCooldown: number = 0;

    constructor(
        public name: string,
        public health: number,
        public attack: number,
        public ability: Ability
    ) {}

    isAlive(): boolean {
        return this.health > 0;
    }

    attackOpponent(opponent: Champion): void {
        console.log(`${this.name} attacks ${opponent.name} for ${this.attack} damage!`);
        opponent.health -= this.attack;
        this.checkUltimateCooldown();
    }

    useAbility(opponent: Champion): void {
        if (this.ultimateCooldown === 0) {
            console.log(`${this.name} uses ${this.ability.name}!`);
            this.ability.effect(this, opponent);
            this.ultimateCooldown = this.ability.cooldown;
        } else {
            console.log(`${this.name}'s ultimate is on cooldown for ${this.ultimateCooldown} turns.`);
        }
    }

    checkUltimateCooldown(): void {
        if (this.ultimateCooldown > 0) {
            this.ultimateCooldown--;
        }
    }
}

interface Ability {
    name: string;
    cooldown: number;
    effect: (caster: Champion, target: Champion) => void;
}

const champions: Champion[] = [
    new Champion("Garen", 100, 20, {
        name: "Demacian Justice",
        cooldown: 3,
        effect: (caster, target) => {
            const damage = 50; // Fixed damage for simplicity
            target.health -= damage;
            console.log(`${caster.name} deals ${damage} damage with Demacian Justice!`);
        },
    }),
    new Champion("Lux", 80, 25, {
        name: "Final Spark",
        cooldown: 5,
        effect: (caster, target) => {
            const damage = 60; // Fixed damage for simplicity
            target.health -= damage;
            console.log(`${caster.name} deals ${damage} damage with Final Spark!`);
        },
    }),
    new Champion("Ashe", 70, 30, {
        name: "Enchanted Crystal Arrow",
        cooldown: 4,
        effect: (caster, target) => {
            const damage = 40; // Fixed damage for simplicity
            target.health -= damage;
            console.log(`${caster.name} deals ${damage} damage with Enchanted Crystal Arrow!`);
        },
    }),
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let player: Champion;
let enemy: Champion;

const chooseChampion = () => {
    return new Promise<Champion>((resolve) => {
        console.log("Choose your champion:");
        champions.forEach((champion, index) => {
            console.log(`${index + 1}: ${champion.name} (Health: ${champion.health}, Attack: ${champion.attack})`);
        });

        rl.question("Enter the number of your champion: ", (answer) => {
            const choice = parseInt(answer) - 1;
            if (choice >= 0 && choice < champions.length) {
                player = champions[choice];
                enemy = champions[(choice + 1) % champions.length]; // Pick a different champion as enemy
                console.log(`You chose ${player.name} who will battle ${enemy.name}.`);
                resolve(player);
            } else {
                console.log("Invalid choice. Please try again.");
                resolve(chooseChampion());
            }
        });
    });
};

const randomEvent = () => {
    const events = [
        "The ground shakes! Both champions take 5 damage!",
        "A wild potion appears! Restore 10 health!",
        "The enemies are distracted! Your attack gets an extra 10 damage!",
        "Both champions are stunned for one turn! No one attacks!",
    ];
    const chosenEvent = Math.floor(Math.random() * events.length);
    console.log(events[chosenEvent]);
    return chosenEvent;
};

const gameLoop = async () => {
    while (player.isAlive() && enemy.isAlive()) {
        console.log(`\n${player.name} (Health: ${player.health}) vs. ${enemy.name} (Health: ${enemy.health})`);
        const action = await new Promise<string>((resolve) => {
            rl.question("Do you want to (a)ttack, (d)efend, or (u)se ability? ", resolve);
        });

        if (action === 'a') {
            player.attackOpponent(enemy);
        } else if (action === 'u') {
            player.useAbility(enemy);
        } else if (action === 'd') {
            console.log(`${player.name} defends, reducing the next incoming damage by 50%`);
            if (enemy.isAlive()) {
                enemy.attackOpponent(player); // Attack after defending
                player.health += 10; // Bonus health while defending
            }
            continue; // skip the enemy attack since player defended
        }

        if (enemy.isAlive()) {
            enemy.attackOpponent(player);
        }

        randomEvent();

        if (player.isAlive() && enemy.isAlive()) {
            console.log(`Both champions are still standing!`);
        }
    }

    if (player.isAlive()) {
        console.log(`\n${player.name} wins!`);
    } else {
        console.log(`\n${enemy.name} wins!`);
    }

    rl.close();
};

const startGame = async () => {
    await chooseChampion();
    await gameLoop();
};

startGame();
