var express = require('express');
var router = express.Router();
const db = require('./queries')

/* GET home page. */
router.get('/', async function (req, res, next) {
    // Ensure the DB is setup properly
    db.checkIfDbSetup().then(async () => {
        // Get all the peeps
        let peeps = await db.getAllPeepsForDisplay().catch(err => {
            console.log(err)
        })
        // Check if there is currently a logged in user
        const loggedIn = req.session.loggedIn;
        // If logged in, get their likes as a list of IDs
        let likes = [];
        if (loggedIn) {
            let user = await db.getUserByID(req.session.user.id).catch(err => {
                console.log(err)
            });
            likes = await user.getLikesAsListOfIds();
        }
        res.render('index', {
            title: 'Home',
            peeps: peeps,
            likes: likes,
        });
    });
});


module.exports = router;
