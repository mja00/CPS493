var express = require('express');
var router = express.Router();
const db = require('./queries')

/* GET home page. */
router.get('/', function(req, res, next) {
  db.getUserByID(1).then(user => {
    res.render('index', { title: 'Home' });
  });
});


module.exports = router;
