//generated with gpt-4o-mini


import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

interface Question {
    question: string;
    options: string[];
    answer: number;
}

const questions: Question[] = [
    {
        question: "What is the capital of France?",
        options: ["1. Berlin", "2. Madrid", "3. Paris", "4. Lisbon"],
        answer: 3
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["1. Earth", "2. Mars", "3. Jupiter", "4. Venus"],
        answer: 2
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["1. Elephant", "2. Blue Whale", "3. Giraffe", "4. Shark"],
        answer: 2
    },
    {
        question: "What is the boiling point of water in Celsius?",
        options: ["1. 90", "2. 100", "3. 80", "4. 120"],
        answer: 2
    },
    {
        question: "Who wrote 'Hamlet'?",
        options: ["1. Charles Dickens", "2. Mark Twain", "3. William Shakespeare", "4. J.K. Rowling"],
        answer: 3
    },
];

let score = 0;

function askQuestion(): void {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const { question, options, answer } = questions[randomIndex];

    console.log("\n" + question);
    options.forEach(option => console.log(option));

    rl.question('Your answer (1-4): ', (userInput) => {
        const userAnswer = parseInt(userInput);
        if (userAnswer === answer) {
            score++;
            console.log("Correct! Your score is now: " + score);
        } else {
            console.log("Wrong! The correct answer was: " + answer);
        }
        askQuestion(); // Ask the next question
    });
}

console.log("Welcome to Infinite Trivia! Answer the questions as best as you can.");
askQuestion();
