const express = require('express')
var quizController = require('../controllers/quizController')
var router = express.Router();
router.post('/createQuiz',quizController.createQuiz)
router.get('/getQuizzes',quizController.getAllQuizes)
router.get('/getQuiz/:quizId',quizController.getQuizByQuizId)
 module.exports =router 