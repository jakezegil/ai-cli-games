//generated with o1-preview


import * as readline from 'readline';

interface Question {
    question: string;
    choices: string[];
    answer: string;
}

const questions: Question[] = [
    {
        question: 'What is the largest marsupial in Australia?',
        choices: ['Kangaroo', 'Koala', 'Wombat', 'Tasmanian Devil'],
        answer: 'Kangaroo'
    },
    {
        question: 'Which animal is known as the laughing bird of Australia?',
        choices: ['Emu', 'Kookaburra', 'Cockatoo', 'Lyrebird'],
        answer: 'Kookaburra'
    },
    {
        question: 'What is the only egg-laying mammal found in Australia?',
        choices: ['Kangaroo', 'Platypus', 'Wombat', 'Koala'],
        answer: 'Platypus'
    },
    {
        question: 'Which Australian animal is famous for its powerful kick?',
        choices: ['Emu', 'Kangaroo', 'Koala', 'Wallaby'],
        answer: 'Kangaroo'
    },
    {
        question: 'Which animal is known for carrying its babies in a pouch?',
        choices: ['Kangaroo', 'Koala', 'Wombat', 'All of the above'],
        answer: 'All of the above'
    },
    {
        question: 'What is the largest bird native to Australia?',
        choices: ['Emu', 'Kookaburra', 'Ostrich', 'Cassowary'],
        answer: 'Emu'
    },
    {
        question: 'Which animal is a symbol of Australia and appears on the Australian coat of arms?',
        choices: ['Platypus', 'Kangaroo', 'Koala', 'Emu'],
        answer: 'Kangaroo'
    },
    {
        question: 'Which Australian animal sleeps up to 20 hours a day?',
        choices: ['Wombat', 'Koala', 'Kangaroo', 'Dingo'],
        answer: 'Koala'
    },
    {
        question: 'Which venomous Australian animal is a type of jellyfish?',
        choices: ['Blue-ringed octopus', 'Stonefish', 'Box jellyfish', 'Cone snail'],
        answer: 'Box jellyfish'
    },
    {
        question: 'Which Australian animal is known for its ability to mimic sounds?',
        choices: ['Lyrebird', 'Kookaburra', 'Cockatoo', 'Emu'],
        answer: 'Lyrebird'
    }
];

let score = 0;
let currentQuestionIndex = 0;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion() {
    if (currentQuestionIndex < questions.length) {
        const q = questions[currentQuestionIndex];
        console.log(`\nQuestion ${currentQuestionIndex + 1}: ${q.question}`);
        for (let i = 0; i < q.choices.length; i++) {
            console.log(` ${i + 1}: ${q.choices[i]}`);
        }
        rl.question('Your answer (enter the number of your choice): ', (answer) => {
            const userChoice = parseInt(answer);
            if (isNaN(userChoice) || userChoice < 1 || userChoice > q.choices.length) {
                console.log('Invalid input. Please enter a number corresponding to your choice.');
                askQuestion(); // ask the same question again
            } else {
                if (q.choices[userChoice - 1].toLowerCase() === q.answer.toLowerCase()) {
                    console.log('Correct!');
                    score++;
                } else {
                    console.log(`Wrong! The correct answer was: ${q.answer}`);
                }
                currentQuestionIndex++;
                askQuestion();
            }
        });
    } else {
        console.log(`\nQuiz completed! Your total score is: ${score} out of ${questions.length}`);
        rl.close();
    }
}

console.log('Welcome to the Fun Australian Animal Trivia Game!');
askQuestion();
