var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const flash = require('connect-flash/lib/flash');

var users = [
  {
    username: "amogus",
    password: getHashedPassword("password"),
    firstName: "Among",
    lastName: "Us",
    birthdate: "2000-04-20"
  }
];

const authTokens = {};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('user/login', { title: 'Login' });
});

router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  const hashedPassword = getHashedPassword(password);

  // Check for the user and password
  const user = users.find(u => {
    return u.username === username && u.password === hashedPassword;
  });

  if (user) {
    const authToken = generateAuthToken();

    // Store the token in the array
    authTokens[authToken] = user;

    // Store the cookie
    res.cookie('authToken', authToken);

    // Redirect to the home page
    req.flash('success', `Welcome ${user.firstName}!`);
    res.redirect('/');
  } else {
    req.flash('error', 'Invalid username or password');
    res.redirect('/user/login');
  }

  res.render("user/login", { title: "Login"})
});

router.get('/register', function(req, res, next) {
  res.render('user/register', { title: 'Register' });
});

router.post('/register', function(req, res, next) {
  const { username, password, firstName, lastName, birthdate, confirmPassword} = req.body; 

  // Check if passwords match
  if (password === confirmPassword) {

    // Check if username is already taken
    if (users.find(user => user.username === username)) {
      req.flash('error', 'Username is already taken');
      res.redirect('/user/register');
      return;
    }

     const hashedPassword = getHashedPassword(password);

      // Add user to users array
      users.push({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        birthdate
      });

      // Flash success message and redirect to login
      req.flash('success', 'You are now registered and can log in');
      res.redirect('/user/login');

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
