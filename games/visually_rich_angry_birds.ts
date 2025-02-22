//generated with gpt-4o

import readline from 'readline';

interface Bird {
    x: number;
    y: number;
    power: number;
    angle: number;
    velocity: number;
    type: 'red' | 'yellow' | 'blue' | 'black';
    special: boolean;
}

interface Target {
    x: number;
    y: number;
    health: number;
    type: 'wood' | 'stone' | 'glass' | 'tnt';
    width: number;
    height: number;
    destroyed: boolean;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    char: string;
}

class AngryBirdsGame {
    // Reduced size for better terminal display
    private width: number = 80;
    private height: number = 30;
    private bird: Bird;
    private targets: Target[];
    private particles: Particle[];
    private isRunning: boolean;
    private isAiming: boolean;
    private score: number;
    private gravity: number = 0.1; // Reduced gravity for smaller scale
    private windResistance: number = 0.98;
    private currentBirdIndex: number;
    private birdTypes: Array<'red' | 'yellow' | 'blue' | 'black'>;

    constructor() {
        this.bird = this.createBird();
        this.targets = this.initializeTargets();
        this.particles = [];
        this.isRunning = true;
        this.isAiming = true;
        this.score = 0;
        this.currentBirdIndex = 0;
        this.birdTypes = ['red', 'yellow', 'blue', 'black'];
    }

    private createBird(): Bird {
        return {
            x: 5,
            y: this.height - 5,
            power: 1,
            angle: 45,
            velocity: 5, // Reduced initial velocity
            type: 'red',
            special: false
        };
    }

    private initializeTargets(): Target[] {
        const targets: Target[] = [];
        const materials: Array<'wood' | 'stone' | 'glass' | 'tnt'> = ['wood', 'stone', 'glass', 'tnt'];
        
        // Create smaller, more compact structures
        for (let tower = 0; tower < 2; tower++) {
            const baseX = this.width - 25 + (tower * 10);
            for (let level = 0; level < 5; level++) {
                targets.push({
                    x: baseX,
                    y: this.height - 5 - (level * 3),
                    health: materials[level % 4] === 'stone' ? 3 : 2,
                    type: materials[level % 4],
                    width: 3,
                    height: 2,
                    destroyed: false
                });
            }
        }

        // Add horizontal beams
        for (let beam = 0; beam < 2; beam++) {
            targets.push({
                x: this.width - 30 + (beam * 8),
                y: this.height - 10,
                health: 2,
                type: 'wood',
                width: 4,
                height: 1,
                destroyed: false
            });
        }

        return targets;
    }

    private render(): void {
        console.clear();
        let output = '';
        const displayBuffer: string[][] = Array(this.height).fill(0).map(() => Array(this.width).fill(' '));

        // Draw trajectory preview with fewer points
        if (this.isAiming) {
            const previewPoints = this.calculateTrajectoryPreview();
            previewPoints.forEach(p => {
                const px = Math.round(p.x);
                const py = Math.round(p.y);
                if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
                    displayBuffer[py][px] = '·';
                }
            });
        }

        // Draw targets
        this.targets.forEach(target => {
            if (!target.destroyed) {
                const symbol = this.getTargetSymbol(target.type);
                for (let h = 0; h < target.height; h++) {
                    for (let w = 0; w < target.width; w++) {
                        const ty = Math.floor(target.y) + h;
                        const tx = Math.floor(target.x) + w;
                        if (ty >= 0 && ty < this.height && tx >= 0 && tx < this.width) {
                            displayBuffer[ty][tx] = symbol;
                        }
                    }
                }
            }
        });

        // Draw bird
        const birdSymbol = this.getBirdSymbol(this.bird.type);
        const bx = Math.round(this.bird.x);
        const by = Math.round(this.bird.y);
        if (by >= 0 && by < this.height && bx >= 0 && bx < this.width) {
            displayBuffer[by][bx] = birdSymbol;
        }

        // Draw particles
        this.particles.forEach(particle => {
            const px = Math.round(particle.x);
            const py = Math.round(particle.y);
            if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
                displayBuffer[py][px] = particle.char;
            }
        });

        // Draw ground
        for (let x = 0; x < this.width; x++) {
            displayBuffer[this.height - 1][x] = '⎯';
        }

        // Convert buffer to output string
        output = displayBuffer.map(row => row.join('')).join('\n');

        // Add HUD
        output += `\nScore: ${this.score} | Bird Type: ${this.bird.type} | Health: ${this.getTargetsHealth()}\n`;
        output += `Angle: ${this.bird.angle}° | Velocity: ${this.bird.velocity} | Special Power: ${this.bird.special ? 'ACTIVE' : 'Ready'}\n`;
        output += 'Controls: ↑/↓: Angle | ←/→: Velocity | SPACE: Launch | S: Special Power | Q: Quit\n';
        console.log(output);
    }

    private getTargetSymbol(type: string): string {
        switch (type) {
            case 'wood': return '#';
            case 'stone': return '█';
            case 'glass': return '▒';
            case 'tnt': return '!';
            default: return '#';
        }
    }

    private getBirdSymbol(type: string): string {
        switch (type) {
            case 'red': return '@';
            case 'yellow': return 'O';
            case 'blue': return '0';
            case 'black': return '●';
            default: return '@';
        }
    }

    private getTargetsHealth(): number {
        return this.targets.reduce((sum, target) => sum + (target.destroyed ? 0 : target.health), 0);
    }

    private calculateTrajectoryPreview(): {x: number, y: number}[] {
        const points: {x: number, y: number}[] = [];
        const angleRad = (this.bird.angle * Math.PI) / 180;
        const v = this.bird.velocity;
        let vx = v * Math.cos(angleRad);
        let vy = v * Math.sin(angleRad);
        let x = this.bird.x;
        let y = this.bird.y;

        for (let t = 0; t < 20; t += 0.5) { // Reduced preview points
            x += vx;
            y -= vy;
            vy -= this.gravity;
            vx *= this.windResistance;

            if (x >= this.width || y >= this.height || y < 0) break;
            points.push({x, y});
        }
        return points;
    }

    private createExplosion(x: number, y: number, intensity: number): void {
        const particles: Particle[] = [];
        const chars = ['*', '+', '·', '°'];
        for (let i = 0; i < intensity; i++) {
            const angle = (Math.PI * 2 * i) / intensity;
            particles.push({
                x,
                y,
                vx: Math.cos(angle),
                vy: Math.sin(angle),
                life: 10,
                char: chars[Math.floor(Math.random() * chars.length)]
            });
        }
        this.particles.push(...particles);
    }

    private async launchBird(): Promise<void> {
        this.isAiming = false;
        const angleRad = (this.bird.angle * Math.PI) / 180;
        let vx = this.bird.velocity * Math.cos(angleRad);
        let vy = this.bird.velocity * Math.sin(angleRad);
        
        while (true) {
            this.bird.x += vx;
            this.bird.y -= vy;
            vy -= this.gravity;
            vx *= this.windResistance;

            // Check collisions with better precision
            for (const target of this.targets) {
                if (!target.destroyed && 
                    Math.floor(this.bird.x) >= Math.floor(target.x) && 
                    Math.floor(this.bird.x) <= Math.floor(target.x + target.width) &&
                    Math.floor(this.bird.y) >= Math.floor(target.y) && 
                    Math.floor(this.bird.y) <= Math.floor(target.y + target.height)) {
                    
                    target.health -= this.bird.power * (this.bird.special ? 2 : 1);
                    if (target.health <= 0) {
                        target.destroyed = true;
                        this.score += 100;
                        this.createExplosion(target.x, target.y, 8);
                        
                        if (target.type === 'tnt') {
                            this.targets.forEach(t => {
                                if (!t.destroyed && 
                                    Math.abs(t.x - target.x) < 8 && 
                                    Math.abs(t.y - target.y) < 5) {
                                    t.health = 0;
                                    t.destroyed = true;
                                    this.createExplosion(t.x, t.y, 5);
                                }
                            });
                        }
                    }
                }
            }

            // Update particles
            this.particles = this.particles.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                return p.life > 0;
            });

            if (this.bird.x >= this.width || this.bird.y >= this.height || this.bird.y < 0) break;
            
            this.render();
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        this.currentBirdIndex = (this.currentBirdIndex + 1) % this.birdTypes.length;
        this.bird = this.createBird();
        this.bird.type = this.birdTypes[this.currentBirdIndex];
        this.isAiming = true;

        if (this.targets.every(t => t.destroyed)) {
            this.isRunning = false;
            console.clear();
            console.log(`🎉 Victory! Final Score: ${this.score} 🎉`);
            process.exit();
        }
    }

    public async play(): Promise<void> {
        const stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.setEncoding('utf8');

        stdin.on('data', async (key: string) => {
            if (key === 'q') {
                process.exit();
            } else if (this.isAiming) {
                if (key === '\u001B[A') {
                    this.bird.angle = Math.min(89, this.bird.angle + 5);
                } else if (key === '\u001B[B') {
                    this.bird.angle = Math.max(0, this.bird.angle - 5);
                } else if (key === '\u001B[C') {
                    this.bird.velocity = Math.min(10, this.bird.velocity + 1);
                } else if (key === '\u001B[D') {
                    this.bird.velocity = Math.max(1, this.bird.velocity - 1);
                } else if (key === ' ') {
                    await this.launchBird();
                } else if (key === 's') {
                    this.bird.special = !this.bird.special;
                }
            }
        });

        while (this.isRunning) {
            this.render();
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
}

const angryBirdsGame = new AngryBirdsGame();
angryBirdsGame.play();
