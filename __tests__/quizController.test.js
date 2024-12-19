const request = require('supertest');
const express = require('express');
const quizController = require('../controllers/quizController'); // assuming the controller is in the same directory

const app = express();

// Middleware for handling JSON request bodies
app.use(express.json());


const quizzes = new Map();
const userAnswers = new Map();
const userResults = new Map();

// Define the routes
app.post('/createQuiz', quizController.createQuiz);
app.get('/getAllQuizzes', quizController.getAllQuizes);
app.get('/getQuiz/:quizId', quizController.getQuizByQuizId);
app.post('/addQuestion', quizController.addQuestions);
app.post('/submitAnswer', quizController.submitAnswer);
app.get('/getResults/:userId/:quizId', quizController.userScore);

// Mock data for testing
beforeEach(() => {
  // Clear the quizzes and userAnswers maps before each test to avoid interference
  quizzes.clear();
  userAnswers.clear();
  userResults.clear();
});

describe('Quiz API Tests', () => {
  
  // Test for creating a quiz
  test('Create a new quiz', async () => {
    const response = await request(app)
      .post('/createQuiz')
      .send({ quizId: 1, title: 'Math Quiz' });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Quiz "Math Quiz" created successfully');
  });

  // Test for getting all quizzes
  test('Get all quizzes', async () => {
    // First create a quiz
    await request(app)
      .post('/createQuiz')
      .send({ quizId: 1, title: 'Math Quiz' });

    const response = await request(app).get('/getAllQuizzes');
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe('Math Quiz');
  });

  // Test for getting a quiz by ID
  test('Get quiz by ID', async () => {
    // Create a quiz and add a question
    await request(app)
      .post('/createQuiz')
      .send({ quizId: 1, title: 'Math Quiz' });

    await request(app)
      .post('/addQuestion')
      .send({
        quizId: 1,
        questionId: 1,
        questionText: 'What is 2 + 2?',
        choices: ['2', '3', '4', '5'],
        correctAnswer: '4'
      });

    const response = await request(app).get('/getQuiz/1');

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Math Quiz');
    expect(response.body.questions.length).toBe(1);
    expect(response.body.questions[0].questionText).toBe('What is 2 + 2?');
    expect(response.body.questions[0]).not.toHaveProperty('correctAnswer'); // Ensure correctAnswer is not present
  });

  // Test for adding a question to a quiz
  test('Add question to quiz', async () => {
    await request(app)
      .post('/createQuiz')
      .send({ quizId: 1, title: 'Math Quiz' });

    const response = await request(app)
      .post('/addQuestion')
      .send({
        quizId: 1,
        questionId: 1,
        questionText: 'What is 2 + 2?',
        choices: ['2', '3', '4', '5'],
        correctAnswer: '4'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Question added to quiz');
  });

  // Test for submitting an answer
  test('Submit answer for a question', async () => {
    // Create a quiz and add a question
    await request(app)
      .post('/createQuiz')
      .send({ quizId: 1, title: 'Math Quiz' });

    await request(app)
      .post('/addQuestion')
      .send({
        quizId: 1,
        questionId: 1,
        questionText: 'What is 2 + 2?',
        choices: ['2', '3', '4', '5'],
        correctAnswer: '4'
      });

    const response = await request(app)
      .post('/submitAnswer')
      .send({
        userId: 1,
        quizId: 1,
        questionId: 1,
        questionIndex: 0,
        answer: '4'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Correct!');
  });

  // Test for getting the user's results
  test('Get user results for a quiz', async () => {
    // Create a quiz, add a question, and submit an answer
    await request(app)
      .post('/createQuiz')
      .send({ quizId: 1, title: 'Math Quiz' });

    await request(app)
      .post('/addQuestion')
      .send({
        quizId: 1,
        questionId: 1,
        questionText: 'What is 2 + 2?',
        choices: ['2', '3', '4', '5'],
        correctAnswer: '4'
      });

    await request(app)
      .post('/submitAnswer')
      .send({
        userId: 1,
        quizId: 1,
        questionId: 1,
        questionIndex: 0,
        answer: '4'
      });

    const response = await request(app).get('/getResults/1/1');
    expect(response.status).toBe(200);
    expect(response.body.Score).toBe(1);
    expect(response.body.Answer[0].isCorrect).toBe(true);
  });
});

