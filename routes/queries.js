const Pool = require('pg').Pool

/*
*
* Below are the DB Settings for the Postgresql Database.
* Make sure to set these to your own DB settings.
*
* */

const dbUser = 'postgres'
const dbPassword = 'postgres'
const dbHost = 'localhost'
const dbPort = 5432
const dbName = 'web-dev-project'

const pool = new Pool({
    user: dbUser,
    host: dbHost,
    database: dbName,
    password: dbPassword,
    port: dbPort,
})

const checkIfDbSetup = async () => {
    // Try to select from the users table to check if the database is setup
    const query = 'SELECT * FROM users'
    pool.query(query, (err, res) => {
        if (err) {
            setUpDb();
        }
    });
}

const setUpDb = async () => {
    const client = await pool.connect()
    // Create tables
    // Create users table
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL NOT NULL PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          firstname VARCHAR(255) NOT NULL,
          lastname VARCHAR(255) NOT NULL,
          birthdate VARCHAR(255) NOT NULL
        );
    `)

    // Create peeps table
    await client.query(`
        CREATE TABLE IF NOT EXISTS peeps (
            id SERIAL NOT NULL PRIMARY KEY,
            user_id integer NOT NULL,
            message text NOT NULL,
            created_at timestamp without time zone DEFAULT now()
        );
    `)
    // Create likes table
    await client.query(`
        CREATE TABLE IF NOT EXISTS likes (
            id SERIAL NOT NULL PRIMARY KEY,
            peep_id integer NOT NULL,
            user_id integer
        );
    `)

    // Create replies table
    await client.query(`
        CREATE TABLE IF NOT EXISTS replies (
            id SERIAL NOT NULL PRIMARY KEY,
            peep_id integer NOT NULL,
            user_id integer NOT NULL,
            message text NOT NULL
        );
    `)

    // Return the client to the pool
    client.release();
}

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

    getLikes = () => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM likes WHERE user_id = $1', [this.id], (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.rows);
            });
        });
    }

    getLikesAsListOfIds = async () => {
        const likesList = await this.getLikes();
        return likesList.map(like => like.peep_id);
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
    constructor(userID, message, createdAt, id) {
        this.userID = userID;
        this.message = message;
        this.createdAt = new Date(createdAt);
        this.id = id;
    }

    // Getters
    getUserID = () => this.userID;
    getMessage = () => this.message;

    // Setters
    setUserID = (userID) => this.userID = userID;
    setMessage = (message) => this.message = message;

    getLikes = async () => {
        return await getLikesForPeep(this.id);
    }

    getLikesCount = async () => {
        let likes = await this.getLikes();
        return likes.length;
    }

    getReplies = async () => {
        return await getRepliesForPeep(this.id);
    }

    getRepliesCount = async () => {
        let replies = await this.getReplies();
        return replies.length;
    }

    getMostRecentReplies = async (limit) => {
        return await getMostRecentRepliesForPeep(this.id, limit);
    }

    getAuthor = async () => {
        let user = await getUserByID(this.userID);
        return user.getAsJSON();
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
    let rows = await pool.query('SELECT * FROM peeps ORDER BY created_at DESC');
    for (let row of rows.rows) {
        let peep = new Peep(row.user_id, row.message, row.created_at, row.id);
        peep.author = await peep.getAuthor();
        peep.likesCount = await peep.getLikesCount();
        peep.replies = await peep.getMostRecentReplies(3);
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

const getPeepByID = async (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM peeps WHERE id = $1', [id], async (error, results) => {
            if (error) {
                reject(error)
            }
            let resultsObj = results.rows[0];
            if (resultsObj) {
                let peep = new Peep(resultsObj.user_id, resultsObj.message, resultsObj.created_at, resultsObj.id);
                peep.author = await peep.getAuthor();
                peep.likes = await peep.getLikes();
                peep.likesCount = await peep.getLikesCount();
                resolve(peep);
            } else {
                reject('Peep not found');
            }
        });
    });
}

const deletePeepByID = async (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM peeps WHERE id = $1', [id], (error, results) => {
            if (error) {
                reject(error)
            }
            // Check to see if the user exists
            if (results.rowCount > 0) {
                // Resolve the user object
                resolve(results);
            } else {
                // Reject the promise
                reject("No peep found");
            }
        });
    });
}

// Our likes class
class Like {
    constructor(id, peep_id, user_id) {
        this.id = id;
        this.peep_id = peep_id;
        this.user_id = user_id;
    }

    // Getters
    getId() {
        return this.id;
    }

    getPeepId() {
        return this.peep_id;
    }

    getUserId() {
        return this.user_id;
    }

    getPeep() {
        return getPeepByID(this.peep_id);
    }

    getLiker() {
        return getUserByID(this.user_id);
    }

    // Setters
    setId(id) {
        this.id = id;
    }

    setPeepId(peep_id) {
        this.peep_id = peep_id;
    }

    setUserId(user_id) {
        this.user_id = user_id;
    }
}

const getLikeByID = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM likes WHERE id = $1', [id], (error, results) => {
            if (error) {
                reject(error)
            }
            // Check to see if the user exists
            if (results.rowCount > 0) {
                // Resolve the user object
                resolve(results.rows[0]);
            } else {
                // Reject the promise
                reject("No like found");
            }
        });
    });
}

const likePeep = async (user_id, peep_id) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO likes (user_id, peep_id) VALUES ($1, $2) RETURNING *', [user_id, peep_id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows[0])
        });
    });
}

const deleteLikeByID = async (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM likes WHERE id = $1', [id], (error, results) => {
            if (error) {
                reject(error)
            }
            // Check to see if the like exists
            if (results.rowCount > 0) {
                // Resolve the like object
                resolve(results);
            } else {
                // Reject the promise
                reject("No like found");
            }
        });
    });
}

const getLikesForPeep = async (peep_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM likes WHERE peep_id = $1', [peep_id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        });
    });
}

const hasUserLikedPeep = async (user_id, peep_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM likes WHERE user_id = $1 AND peep_id = $2', [user_id, peep_id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rowCount > 0);
        });
    });
}

const deleteLikeByUserForPeep = async (user_id, peep_id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM likes WHERE user_id = $1 AND peep_id = $2', [user_id, peep_id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results);
        });
    });
}

// Our replies class
class Reply {
    constructor(id, peep_id, user_id, message) {
        this.id = id;
        this.peep_id = peep_id;
        this.user_id = user_id;
        this.message = message;
    }

    // Getters
    getId = () => this.id;
    getPeepId = () => this.peep_id;
    getUserId = () => this.user_id;
    getMessage = () => this.message;

    // Setters
    setId = (id) => this.id = id;
    setPeepId = (peep_id) => this.peep_id = peep_id;
    setUserId = (user_id) => this.user_id = user_id;
    setMessage = (message) => this.message = message;

    getAuthor = async () => {
        return await getUserByID(this.user_id);
    }

    getAuthorAsJson = async () => {
        const author = await getUserByID(this.user_id);
        return author.getAsJSON();
    }
}

const getReplyByID = async (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM replies WHERE id = $1', [id], (error, results) => {
            if (error) {
                reject(error)
            }
            // Check to see if the reply exists
            if (results.rowCount > 0) {
                // Convert the results to a reply object
                let resultObj = results.rows[0];
                let reply = new Reply(resultObj.id, resultObj.peep_id, resultObj.user_id, resultObj.message);
                resolve(reply);

            } else {
                // Reject the promise
                reject("No reply found");
            }
        });
    });
}

const getRepliesForPeep = async (peep_id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM replies WHERE peep_id = $1', [peep_id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows);
        });
    });
}

const getMostRecentRepliesForPeep = async (peep_id, limit) => {
    return new Promise((resolve, reject) => {
       pool.query('SELECT * FROM replies WHERE peep_id = $1 ORDER BY id DESC LIMIT $2', [peep_id, limit], (error, results) => {
           if (error) {
               reject(error)
           }
           // Convert the replies to a reply object
           // Check if rows is empty and resolve an empty array if it is
           if (results.rowCount > 0) {
               let replies = [];
               results.rows.forEach(async (row) => {
                   let reply = new Reply(row.id, row.peep_id, row.user_id, row.message);
                   let author = await getUserByID(reply.getUserId());
                   reply.author = author.getAsJSON();
                   replies.push(reply);
               })
               resolve(replies);
           } else {
               resolve([]);
           }
       });
    });
}

const addReply = async (peep_id, user_id, message) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO replies (peep_id, user_id, message) VALUES ($1, $2, $3) RETURNING *', [peep_id, user_id, message], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results.rows[0]);
        });
    });
}

const deleteReplyByID = async (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM replies WHERE id = $1', [id], (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results);
        });
    });
}


module.exports = {
    User,
    Peep,
    Like,
    Reply,
    getUserByID,
    createNewUser,
    getUserByUsernameAndPassword,
    getUserByUsername,
    getAllPeepsForDisplay,
    updateUser,
    deleteUserByID,
    doesUsernameExist,
    createNewPeep,
    getPeepByID,
    deletePeepByID,
    getLikesForPeep,
    likePeep,
    deleteLikeByID,
    getLikeByID,
    hasUserLikedPeep,
    deleteLikeByUserForPeep,
    setUpDb,
    checkIfDbSetup,
    getRepliesForPeep,
    addReply,
    getReplyByID,
    deleteReplyByID,
    getMostRecentRepliesForPeep
}