const express =  require('express')
var quiz = require('../routes/quiz')
var router = express.Router();

router.use('/quiz',quiz)
module.exports = router;
