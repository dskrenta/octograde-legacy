var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing', { title: 'Express' });
});

/* GET teacher dash */
router.get('/teacher', function(req, res, next) {
  res.render('teacher');
});

/* GET student dash */
router.get('/student', function(req, res, next) {
  res.render('student');
});

module.exports = router;
