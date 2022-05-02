var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const flash = require('connect-flash/lib/flash');
const db = require('./queries');

const authTokens = {};

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/login', function (req, res, next) {
    res.render('user/login', {title: 'Login'});
});

router.get('/logout', function (req, res, next) {
    // Check if user is logged in
    if (req.session.user) {
        // Remove auth token from session
        delete authTokens[req.session.authToken];
        // Remove user from session
        delete req.session.user;
        // Destroy session
        req.session.destroy();
        // Redirect to login
        res.redirect('/');
    } else {
        // Redirect to login page
        res.redirect('/user/login');
    }
});

router.post('/login', function (req, res, next) {
    const {username, password} = req.body;
    const hashedPassword = getHashedPassword(password);

    // Check for the user and password
    db.getUserByUsernameAndPassword(username, hashedPassword).then(user => {
        // Check if user exists
        if (user) {
            console.log(user);
            const authToken = generateAuthToken();

            // Store the token in the array
            authTokens[authToken] = user;

            // Store the cookie
            res.cookie('authToken', authToken);

            // Redirect to the home page
            let firstName = user.getFirstName();
            req.flash('success', `Welcome ${firstName}!`);
            req.session.user = user;
            req.session.loggedIn = true;
            res.redirect('/');
        } else {
            req.flash('error', 'Invalid username or password');
            res.redirect('/user/login');
        }
    }).catch(error => {
        console.log(error);
        req.flash('error', error)
        res.redirect('/user/login');
    });

});

router.get('/register', function (req, res, next) {
    res.render('user/register', {title: 'Register'});
});

router.post('/register', async function (req, res, next) {
    const {username, password, firstName, lastName, birthdate, confirmPassword} = req.body;

    // Check if passwords match
    if (password === confirmPassword) {

        // Check if username is already taken
        const doesUserExist = await db.doesUsernameExist(username);
        if (doesUserExist) {
            req.flash('error', 'Username is already taken');
            res.redirect('/user/register');
        } else {
            const hashedPassword = getHashedPassword(password);
            let tempUser = new db.User(username, hashedPassword, firstName, lastName, birthdate);

            // Insert into database
            db.createNewUser(tempUser).then(user => {
                // Flash success message and redirect to login
                req.flash('success', 'You are now registered and can log in');
                res.redirect('/user/login');
            });
        }

    } else {
        // Flash a message and reditect to register page
        req.flash('error', 'Passwords do not match');
        res.redirect('/user/register');
    }

})

// Password hashing
function getHashedPassword(password) {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// Auth token generator
function generateAuthToken() {
    return crypto.randomBytes(30).toString('hex');
}

module.exports = router;
