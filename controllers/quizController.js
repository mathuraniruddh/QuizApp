const express = require('express');

const quizzes = new Map();
const userAnswers = new Map();
const userResults = new Map();

exports.createQuiz = async function(req,res) {
    try{
    const { quizId, title } = req.body;

    if (quizzes.has(quizId)) {
        return res.status(400).json({ message: 'Quiz already exists' });
    }

    quizzes.set(quizId, { title, questions: [] });
    res.status(201).json({ message: `Quiz "${title}" created successfully` });
    }
    catch(error){
        console.error('Error adding quiz:', error);
        res.status(500).json({ message: 'Error adding quiz', error });
    }
}

// Get all quizzes
exports.getAllQuizes= async function(req, res) {
    try{
    const allQuizzes = Array.from(quizzes.values());
    res.status(200).json(allQuizzes);
    }
    catch(error){     
        console.error('Error in get quizes:', error);
        res.status(500).json({ message: 'Error in get quizes', error });
    }
};

// Get quiz by ID
exports.getQuizByQuizId = async function(req, res){
    try{
        const { quizId } = req.params;
        console.log(typeof quizId)
        const quiz = quizzes.get(Number(quizId));
    
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
    
        // Return questions without the correct answers
        const questionsWithoutCorrectAnswers = quiz.questions.map(q => {
            const { correctAnswer, ...rest } = q;  // Remove correctAnswer from the response
            return rest;
        });
    
        res.status(200).json({ title: quiz.title, questions: questionsWithoutCorrectAnswers });
}
 catch(error){     
        console.error('Error in getting quizes:', error);
        res.status(500).json({ message: 'Error in getting quizes', error });
    }

}

// Add question to a quiz
exports.addQuestions = async function(req,res) {
    try{
    const {quizId,questionId,questionText, choices, correctAnswer } = req.body;
      console.log("in add question",typeof quizId)
    const quiz = quizzes.get(quizId);
    if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
    }

    const question = {
        questionId,
        questionText,
        choices,
        correctAnswer
    };

    quiz.questions.push(question);
    res.status(201).json({ message: 'Question added to quiz' });
}
catch(error){
    console.error('Error in adding questions:', error);
    res.status(500).json({ message: 'Error in getting questions', error });
}
}

// save answer to a particular question of a quiz
exports.submitAnswer = async function (req,res) {
    try{
        const { userId, quizId, questionId,questionIndex, answer } = req.body;
    
        const quiz = quizzes.get(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
    
        const question = quiz.questions[questionIndex];
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
         var Answer = `${userId}_${quizId}`
        if (!userAnswers.has(Answer)) {
            userAnswers.set(Answer, []);
        }
    
        const isCorrect = answer === question.correctAnswer;
        const feedback = isCorrect
            ? 'Correct!'
            : `Incorrect! The correct answer is: ${question.correctAnswer}`;
    
        const userAnswer = {
            questionId,
            questionIndex,
            answer,
            isCorrect 
          };
    
        userAnswers.get(Answer).push(userAnswer);
        res.status(201).json({ message: feedback });
    }
    catch(error){
        console.error('Error in answering a question:', error);
    res.status(500).json({ message: 'Error in answering a question', error });
    }
}

//calculate user score for a quiz and show the quiz result
exports.userScore = async function (req,res) {
    try{
const { userId, quizId } = req.params;

var Answer = `${Number(userId)}_${Number(quizId)}`
    const answers = userAnswers.get(Answer);
    const quiz = quizzes.get(Number(quizId));

    if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!answers) {
        return res.status(404).json({ message: 'No answers found for this user' });
    }
    if (!userResults.has(Answer)) {
        userResults.set(Answer, []);
    }
    let score = 0;
    const totalQuestions = quiz.questions.length;
   
    // Calculate score
    answers.forEach(answer => {
        if (answer.isCorrect) {
            score++;
        }
    });
 
    const summary = answers.map(answer => {
        const question = quiz.questions[answer.questionIndex];
        return {
            questionText: question.questionText,
            userAnswer: answer.answer,
            correctAnswer: question.correctAnswer,
            isCorrect: answer.isCorrect
        };
    });
     var userResult = {  "user_id":userId,
        "quiz_id":quizId,
        "Score":score,
        "Answer":summary
    }
    userResults.get(Answer).push(userResult)
    res.status(200).json({
        "user_id":userId,
        "quiz_id":quizId,
        "Score":score,
        "Answer":summary
    });
}
catch(error){
    console.error('Error in result saving:', error);
    res.status(500).json({ message: 'Error in result saving', error });
}

}