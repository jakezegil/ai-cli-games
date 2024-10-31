//generated with gpt-4o


import axios from 'axios';
import readline from 'readline';

interface TriviaQuestion {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

class TriviaGame {
    private score: number = 0;
    private questions: TriviaQuestion[] = [];
    private currentIndex: number = 0;

    constructor() {}

    async fetchQuestions(amount: number = 5): Promise<void> {
        try {
            const response = await axios.get(`https://opentdb.com/api.php?amount=${amount}&type=multiple`);
            this.questions = response.data.results;
        } catch (error) {
            console.error('Error fetching trivia questions:', error);
        }
    }

    startGame(): void {
        if (this.questions.length === 0) {
            console.log('No questions available. Please try again later.');
            return;
        }
        console.log('Welcome to Super Duper Trivia Master!');
        this.askQuestion();
    }

    private askQuestion(): void {
        if (this.currentIndex >= this.questions.length) {
            console.log(`Game over! Your final score is ${this.score}/${this.questions.length}.`);
            process.exit();
        }

        const question = this.questions[this.currentIndex];
        const answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);
        
        console.log(`\nQuestion ${this.currentIndex + 1}: ${question.question}`);
        answers.forEach((answer, index) => {
            console.log(`${index + 1}: ${answer}`);
        });

        this.getUserInput(answers);
    }

    private getUserInput(answers: string[]): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('\nYour answer (1-4): ', (answer) => {
            rl.close();
            const userAnswer = answers[+answer - 1];
            if (userAnswer === undefined) {
                console.log('Invalid input. Please enter a number between 1 and 4.');
                this.askQuestion();
            } else if (userAnswer === this.questions[this.currentIndex].correct_answer) {
                console.log('Correct!');
                this.score++;
            } else {
                console.log(`Wrong! The correct answer was: ${this.questions[this.currentIndex].correct_answer}`);
            }

            this.currentIndex++;
            this.askQuestion();
        });
    }
}

(async () => {
    const game = new TriviaGame();
    await game.fetchQuestions();
    game.startGame();
})();
