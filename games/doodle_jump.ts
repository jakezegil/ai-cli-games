//generated with gpt-4o-mini


// doodle_jump.ts

class Platform {
    public y: number;
    public type: string; // "normal", "moving", "disappearing", "spring"
    public isActive: boolean;

    constructor(y: number, type: string) {
        this.y = y;
        this.type = type;
        this.isActive = true;
    }
}

class Enemy {
    public x: number;
    public y: number;
    public type: string; // "slow", "fast", "flying"

    constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}

class PowerUp {
    public x: number;
    public y: number;
    public type: string; // "double jump", "score boost", "invincibility", "shield"

    constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}

class Game {
    private score: number;
    private playerY: number;
    private playerX: number;
    private platforms: Platform[];
    private enemies: Enemy[];
    private powerUps: PowerUp[];
    private isJumping: boolean;
    private gravity: number;
    private jumpStrength: number;
    private level: number;
    private scoreMultiplier: number;
    private invincible: boolean;

    constructor() {
        this.score = 0;
        this.playerY = 10;
        this.playerX = 5;
        this.platforms = [];
        this.enemies = [];
        this.powerUps = [];
        this.isJumping = false;
        this.gravity = -1;
        this.jumpStrength = 3;
        this.level = 1;
        this.scoreMultiplier = 1;
        this.invincible = false;

        this.initPlatforms();
        this.initEnemies();
        this.initPowerUps();
    }

    private initPlatforms(): void {
        for (let i = 1; i <= 10; i++) {
            const type = i % 5 === 0 ? "spring" : (i % 3 === 0 ? "moving" : (i % 2 === 0 ? "disappearing" : "normal"));
            this.platforms.push(new Platform(10 * i, type));
        }
    }

    private initEnemies(): void {
        const enemyTypes = ["slow", "fast", "flying"];
        for (let i = 0; i < 3; i++) {
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            this.enemies.push(new Enemy(Math.floor(Math.random() * 10), 20 + i * 10, type));
        }
    }

    private initPowerUps(): void {
        this.powerUps.push(new PowerUp(3, 25, "double jump"));
        this.powerUps.push(new PowerUp(8, 35, "score boost"));
        this.powerUps.push(new PowerUp(5, 20, "invincibility"));
        this.powerUps.push(new PowerUp(6, 30, "shield"));
    }

    private draw(): void {
        console.clear();
        console.log(`Score: ${this.score} (Multiplier: x${this.scoreMultiplier})`);
        console.log(`Player Position: (${this.playerX}, ${this.playerY})`);
        console.log(`Level: ${this.level}`);
        console.log("Platforms:");

        for (let y = 50; y >= 0; y--) {
            let line = "";

            for (let x = 0; x < 10; x++) {
                if (y === this.playerY && x === this.playerX) {
                    line += "D"; // Doodle
                } else if (this.platforms.some(p => p.y === y && p.isActive)) {
                    const platform = this.platforms.find(p => p.y === y)!;
                    line += platform.type === "spring" ? "^" : (platform.type === "moving" ? "~" : (platform.type === "disappearing" ? " " : "-")); // Platform
                } else if (this.enemies.some(e => e.x === x && e.y === y)) {
                    line += "E"; // Enemy
                } else if (this.powerUps.some(p => p.x === x && p.y === y)) {
                    line += "P"; // Power-up
                } else {
                    line += " "; // Empty space
                }
            }

            console.log(line);
        }
    }

    private updatePlatforms(): void {
        this.platforms.forEach(platform => {
            if (platform.type === "moving") {
                platform.y += Math.random() > 0.5 ? 1 : -1; // Move up or down
                if (platform.y > 50) platform.y = 0; // Loop back
            } else if (platform.type === "disappearing") {
                platform.isActive = Math.random() > 0.5;
            }
        });
    }

    private updateEnemies(): void {
        this.enemies.forEach(enemy => {
            if (enemy.type === "fast") {
                enemy.y += 2;
            } else if (enemy.type === "flying") {
                enemy.y += Math.random() > 0.5 ? 1 : -1; // Fly up or down
            }
            // Reset enemy position if it goes off-screen
            if (enemy.y > 50) {
                enemy.y = 0;
                enemy.x = Math.floor(Math.random() * 10); // Random x position
            }
        });
    }

    private update(): void {
        this.updatePlatforms();
        this.updateEnemies();

        // Apply jumping mechanics
        if (this.isJumping) {
            this.playerY += this.jumpStrength;
            this.jumpStrength += this.gravity;
            if (this.playerY <= 0) {
                this.playerY = 0;
                this.isJumping = false;
            }
        } else {
            this.playerY += this.gravity;
            if (this.playerY < 0) {
                this.playerY = 0; // Ground level
            }
            for (const platform of this.platforms) {
                if (this.playerY === platform.y && this.playerX > 0 && this.playerX < 10) {
                    this.playerY = platform.y + 1; // reset player position on platform
                    this.jumpStrength = 3; // reset jump strength
                    this.score += this.scoreMultiplier; // increase score

                    if (platform.type === "spring") {
                        this.jumpStrength = 6; // Extra lift from spring platform
                    }
                }
            }
        }

        // Check for collisions with enemies
        for (const enemy of this.enemies) {
            if (this.playerX === enemy.x && this.playerY === enemy.y) {
                if (this.invincible) {
                    // If invincible, just pass through enemy
                    console.log("Invincible! Enemy passed.");
                } else {
                    this.gameOver();
                }
            }
        }

        // Check for power-up collisions
        for (const powerUp of this.powerUps) {
            if (this.playerX === powerUp.x && this.playerY === powerUp.y) {
                this.activatePowerUp(powerUp);
                this.powerUps = this.powerUps.filter(p => p !== powerUp); // Remove collected power-up
            }
        }

        // Check if fallen below the ground
        if (this.playerY < 0) {
            this.gameOver();
        }
    }

    private activatePowerUp(powerUp: PowerUp): void {
        switch (powerUp.type) {
            case "double jump":
                this.jumpStrength = 6; // Increase jump strength.
                console.log("Double Jump Activated!");
                break;
            case "score boost":
                this.scoreMultiplier = 2; // Boost score.
                console.log("Score Boost Activated!");
                break;
            case "invincibility":
                this.invincible = true;
                setTimeout(() => {
                    this.invincible = false;
                    console.log("Invincibility Deactivated!");
                }, 5000); // 5 seconds of invincibility
                console.log("Invincibility Activated! You can dash through enemies!");
                break;
            case "shield":
                this.invincible = true;
                console.log("Shield Activated! You can hit enemies without dying!");
                break;
        }
    }

    private gameOver(): void {
        console.clear();
        console.log(`Game Over! Your Score: ${this.score}`);
        process.exit();
    }

    public start(): void {
        console.log("Welcome to Turbo Doodle Jump!");
        this.draw();
        const stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');

        stdin.on('data', (key) => {
            if (key === 'w' || key === 'W') {
                this.isJumping = true;
            }
            if (key === 'a' || key === 'A') {
                this.playerX = Math.max(0, this.playerX - 1);
            }
            if (key === 'd' || key === 'D') {
                this.playerX = Math.min(9, this.playerX + 1);
            }
            if (key === 'q' || key === 'Q') {
                this.gameOver();
            }
        });

        setInterval(() => {
            this.update();
            this.draw();
        }, 100);
    }
}

const game = new Game();
game.start();
