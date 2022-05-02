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
    constructor(username, password, firstName, lastName, birthdate, id) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthdate = birthdate;
        this.id = id;
    }

    // Getters
    getUsername = () => this.username;
    getPassword = () => this.password;
    getFirstName = () => this.firstName;
    getLastName = () => this.lastName;
    getFullName = () => this.firstName + ' ' + this.lastName;
    getBirthdate = () => this.birthdate;
    getId = () => this.id;

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

    getAsJSON = () => {
        return {
            id: this.id,
            username: this.username,
            firstName: this.firstName,
            lastName: this.lastName,
            birthdate: this.birthdate
        }
    }
}


const getUserByID = (userID) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE id = $1', [userID], (error, results) => {
            if (error) {
                reject(error)
            }
            // Convert the results to a user object
            let resultsObj = results.rows[0];
            // Check to see if the user exists
            if (resultsObj) {
                // Create a new user object
                let user = new User(resultsObj.username, resultsObj.password, resultsObj.firstname, resultsObj.lastname, resultsObj.birthdate, resultsObj.id);
                // Resolve the user object
                resolve(user);
            } else {
                // Reject the promise
                reject("No user found");
            }
        });
    })
}

const deleteUserByID = (userID) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM users WHERE id = $1', [userID], (error, results) => {
            if (error) {
                reject(error)
            }
            console.log(results);
            // Check to see if the user exists
            if (results.rowCount > 0) {
                // Resolve the user object
                resolve(results);
            } else {
                // Reject the promise
                reject("No user found");
            }
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
        pool.query('INSERT INTO users (username, password, firstname, lastname, birthdate) VALUES ($1, $2, $3, $4, $5) RETURNING *', [username, password, firstName, lastName, birthdate], (error, results) => {
            if (error) {
                reject(error)
            }
            let resultsObj = results.rows[0];
            console.log(results);
            if (results.rowCount > 0) {
                // Create a new user object
                let user = new User(resultsObj.username, resultsObj.password, resultsObj.firstname, resultsObj.lastname, resultsObj.birthdate, resultsObj.id);
                // Resolve the user object
                resolve(user);
            } else {
                // Reject the promise
                reject("No user found");
            }
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
                let user = new User(resultsObj.username, resultsObj.password, resultsObj.firstname, resultsObj.lastname, resultsObj.birthdate, resultsObj.id);
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
                let user = new User(resultsObj.username, resultsObj.password, resultsObj.firstname, resultsObj.lastname, resultsObj.birthdate, resultsObj.id);
                // Resolve the user object
                resolve(user);
            } else {
                // Reject the promise
                reject("No user found");
            }
        });
    });
}

const doesUsernameExist = (username) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
            if (error) {
                reject("Error getting user")
            }
            // Convert the results to a user object
            let resultsObj = results.rows[0];
            // Check to see if the user exists
            if (resultsObj) {
                // Resolve the user object
                resolve(true);
            } else {
                // Reject the promise
                resolve(false);
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
    console.log(user);

    return new Promise((resolve, reject) => {
        pool.query('UPDATE users SET username = $1, password = $2, firstname = $3, lastname = $4, birthdate = $5 WHERE username = $1', [username, password, firstName, lastName, birthdate], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows[0])
        });
    });
}

// Our Peep class
class Peep {
    // Constructor
    constructor(userID, message, createdAt) {
        this.userID = userID;
        this.message = message;
        this.createdAt = new Date(createdAt);
    }

    // Getters
    getUserID = () => this.userID;
    getMessage = () => this.message;

    // Setters
    setUserID = (userID) => this.userID = userID;
    setMessage = (message) => this.message = message;

    getAuthor = async () => {
        return await getUserByID(this.userID);
    }

    getTimeDifference = () => {
        let now = new Date();
        let elapsed = now - this.createdAt;

        let msPerMinute = 60 * 1000;
        let msPerHour = msPerMinute * 60;
        let msPerDay = msPerHour * 24;
        let msPerMonth = msPerDay * 30;
        let msPerYear = msPerDay * 365;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        } else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        } else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        } else if (elapsed < msPerMonth) {
            return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
        } else if (elapsed < msPerYear) {
            return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
        } else {
            return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
        }
    }

}


const getAllPeepsForDisplay = async () => {
    let peeps = [];
    let rows = await pool.query('SELECT * FROM peeps');
    for (let row of rows.rows) {
        let peep = new Peep(row.user_id, row.message, row.created_at);
        peep.author = await peep.getAuthor();
        peeps.push(peep);
    }
    return peeps;
}


const createNewPeep = async (user_id, message) => {
    console.log(user_id, message);
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO peeps (user_id, message) VALUES ($1, $2) RETURNING *', [user_id, message], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows[0])
        });
    });
}

module.exports = {
    User,
    Peep,
    getUserByID,
    createNewUser,
    getUserByUsernameAndPassword,
    getUserByUsername,
    getAllPeepsForDisplay,
    updateUser,
    deleteUserByID,
    doesUsernameExist,
    createNewPeep
}