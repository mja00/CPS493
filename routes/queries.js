const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'web-dev-project',
  password: 'postgres',
  port: 5432,
})

// Our user class
class User {
  constructor(username, password, firstName, lastName, birthdate) {
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
  }

  // Getters
  getUsername = () => this.username;
  getPassword = () => this.password;
  getFirstName = () => this.firstName;
  getLastName = () => this.lastName;
  getFullName = () => this.firstName + ' ' + this.lastName;
  getBirthdate = () => this.birthdate;

  // Setters
  setUsername = (username) => this.username = username;
  setPassword = (password) => this.password = password;
  setFirstName = (firstName) => this.firstName = firstName;
  setLastName = (lastName) => this.lastName = lastName;
  setFullName = (firstName, lastName) => {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  setBirthdate = (birthdate) => this.birthdate = birthdate;
}


const getUserByID = (userID) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE id = $1', [userID], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows[0])
        });
    })
}

const createNewUser = (user) => {
    let username = user.getUsername();
    let password = user.getPassword();
    let firstName = user.getFirstName();
    let lastName = user.getLastName();
    let birthdate = user.getBirthdate();

    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (username, password, firstname, lastname, birthdate) VALUES ($1, $2, $3, $4, $5)', [username, password, firstName, lastName, birthdate], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows[0])
        });
    });
}

const getUserByUsernameAndPassword = (username, password) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (error, results) => {
            if (error) {
                reject("Error getting user")
            }
            // Convert the results to a user object
            let resultsObj = results.rows[0];
            // Check to see if the user exists
            if (resultsObj) {
                // Create a new user object
                let user = new User(resultsObj.username, resultsObj.password, resultsObj.firstname, resultsObj.lastname, resultsObj.birthdate);
                // Resolve the user object
                resolve(user);
            } else {
                // Reject the promise
                reject("No user found");
            }
        });
    });
}

const getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
            if (error) {
                reject("Error getting user")
            }
            // Convert the results to a user object
            let resultsObj = results.rows[0];
            // Check to see if the user exists
            if (resultsObj) {
                // Create a new user object
                let user = new User(resultsObj.username, resultsObj.password, resultsObj.firstname, resultsObj.lastname, resultsObj.birthdate);
                // Resolve the user object
                resolve(user);
            } else {
                // Reject the promise
                reject("No user found");
            }
        });
    });
}

const updateUser = (user) => {
    let username = user.getUsername();
    let password = user.getPassword();
    let firstName = user.getFirstName();
    let lastName = user.getLastName();
    let birthdate = user.getBirthdate();

    return new Promise((resolve, reject) => {
        pool.query('UPDATE users SET username = $1, password = $2, firstname = $3, lastname = $4, birthdate = $5 WHERE username = $1', [username, password, firstName, lastName, birthdate], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows[0])
        });
    });
}

module.exports = {
    User,
    getUserByID,
    createNewUser,
    getUserByUsernameAndPassword,
    getUserByUsername,
}