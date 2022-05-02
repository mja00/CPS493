var express = require('express');
var router = express.Router();
const db = require('./queries')

/* GET home page. */
router.get('/', async function(req, res, next) {
    // Get all the peeps
  let peeps = await db.getAllPeepsForDisplay().catch(err => {
    console.log(err)
  })
  res.render('index', {
    title: 'Home' ,
    peeps: peeps,
  });
});


module.exports = router;
