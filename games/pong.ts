//generated with gpt-4o


class PongGame {
    private width: number = 40;
    private height: number = 20;
    private ballPosition: { x: number, y: number };
    private ballVelocity: { x: number, y: number };
    private paddle1Position: number;
    private paddle2Position: number;
    private readonly paddleHeight: number = 4;
    private player1Score: number = 0;
    private player2Score: number = 0;

    constructor() {
        this.ballPosition = { x: Math.floor(this.width / 2), y: Math.floor(this.height / 2) };
        this.ballVelocity = { x: 1, y: 1 };
        this.paddle1Position = Math.floor(this.height / 2) - Math.floor(this.paddleHeight / 2);
        this.paddle2Position = Math.floor(this.height / 2) - Math.floor(this.paddleHeight / 2);
    }

    private render(): void {
        console.clear();
        let output = '';

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (x === 0 || x === this.width - 1) {
                    // Render paddles
                    const paddlePosition = x === 0 ? this.paddle1Position : this.paddle2Position;
                    if (y >= paddlePosition && y < paddlePosition + this.paddleHeight) {
                        output += '|';
                    } else {
                        output += ' ';
                    }
                } else if (x === this.ballPosition.x && y === this.ballPosition.y) {
                    output += 'O'; // Render ball
                } else {
                    output += ' ';
                }
            }
            output += '\n';
        }
        output += `Player 1: ${this.player1Score}  Player 2: ${this.player2Score}\n`;
        console.log(output);
    }

    private update(): void {
        // Update the ball position
        this.ballPosition.x += this.ballVelocity.x;
        this.ballPosition.y += this.ballVelocity.y;

        // Check for collision with top and bottom walls
        if (this.ballPosition.y <= 0 || this.ballPosition.y >= this.height - 1) {
            this.ballVelocity.y *= -1;
        }

        // Check for collision with paddles
        if (this.ballPosition.x === 1) { // Left paddle collision
            if (this.ballPosition.y >= this.paddle1Position && this.ballPosition.y < this.paddle1Position + this.paddleHeight) {
                this.ballVelocity.x *= -1;
            } else {
                this.player2Score++;
                this.resetBall();
            }
        } else if (this.ballPosition.x === this.width - 2) { // Right paddle collision
            if (this.ballPosition.y >= this.paddle2Position && this.ballPosition.y < this.paddle2Position + this.paddleHeight) {
                this.ballVelocity.x *= -1;
            } else {
                this.player1Score++;
                this.resetBall();
            }
        }
    }

    private resetBall(): void {
        this.ballPosition = { x: Math.floor(this.width / 2), y: Math.floor(this.height / 2) };
        this.ballVelocity.x *= -1; // Change direction
    }

    private handleInput(input: string): void {
        switch (input) {
            case 'w': // Move paddle 1 up
                if (this.paddle1Position > 0) this.paddle1Position--;
                break;
            case 's': // Move paddle 1 down
                if (this.paddle1Position < this.height - this.paddleHeight) this.paddle1Position++;
                break;
            case 'o': // Move paddle 2 up
                if (this.paddle2Position > 0) this.paddle2Position--;
                break;
            case 'l': // Move paddle 2 down
                if (this.paddle2Position < this.height - this.paddleHeight) this.paddle2Position++;
                break;
        }
    }

    public async play(): Promise<void> {
        const stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.setEncoding('utf8');

        stdin.on('data', (key: string) => {
            if (key === '\u0003') { // Ctrl+C to quit
                process.exit();
            } else {
                this.handleInput(key);
            }
        });

        while (true) {
            this.update();
            this.render();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
}

const game = new PongGame();
game.play();
