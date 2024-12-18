const express = require('express')
var quizController = require('../controllers/quizController')
var router = express.Router();
router.post('/createQuiz',quizController.createQuiz)
router.get('/getQuizzes',quizController.getAllQuizes)
router.get('/getQuiz/:quizId',quizController.getQuizByQuizId)
router.post('/addQuestions',quizController.addQuestions)
router.post('/saveAnswer',quizController.submitAnswer)
router.get('/userScore/:userId/:quizId',quizController.userScore)
 module.exports =router 