var express = require('express');
var router = express.Router();
const db = require('./queries')


router.get('/user/:id', async function(req, res, next) {
  const user = await db.getUserByID(req.params.id)
  res.json(user.getAsJSON())
})

router.post('/user/:id', async function(req, res, next) {
    // Get the request body
    const body = req.body
    console.log(body);
    if (Object.keys(body).length !== 0) {
        // Get the user id
        const userID = req.params.id
        let user = await db.getUserByID(userID)
        if (user != null) {
            // Only update the specific fields that were sent
            if (body.firstName) {
                user.firstName = body.firstName
            }
            if (body.lastName) {
                user.lastName = body.lastName
            }
            if (body.username) {
                user.username = body.username
            }
            if (body.birthdate) {
                user.birthdate = body.birthdate
            }
            if (body.password) {
                user.password = body.password
            }
            await db.updateUser(user)
            res.json({
                message: 'User updated successfully'
            })
        }
    } else {
        res.status(400).json({
            message: 'No body found'
        })
    }

});

router.put('/user/', async function(req, res,next) {
   const body = req.body
   if (Object.keys(body).length === 5) {
       let newUser = new db.User(body.username, body.password, body.firstName, body.lastName, body.birthdate)
       let newUserObj = await db.createNewUser(newUser)
       res.json({
           message: 'User created successfully',
           user: newUserObj.getAsJSON()
       })
   } else {
       res.status(400).json({
           message: 'No body found'
       })
   }
});

router.delete('/user/:id', async function(req, res, next) {
    const userID = req.params.id
    await db.deleteUserByID(userID)
    res.json({
        message: 'User deleted successfully'
    })
});

module.exports = router;