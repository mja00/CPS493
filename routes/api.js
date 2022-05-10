var express = require('express');
var router = express.Router();
const db = require('./queries')


/* User endpoints */

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

/* Peep endpoints */

router.post('/peep', async function(req, res, next) {
    if (!req.session.user) {
        res.json({
            message: 'You must be logged in to peep'
        })
        return;
    }
    const userID = req.session.user.id;
    const body = req.body;
    const message = body.peep;
    db.createNewPeep(userID, message).then(function() {
        res.json({
            message: 'Peep created successfully'
        })
    }).catch(function(err) {
        res.status(400).json({
            message: err
        })
    });
});

router.get('/peep/:id', async function(req, res, next) {
    const peepID = req.params.id;
    db.getPeepByID(peepID).then(function(peep) {
        res.json(peep)
    }).catch(function(err) {
        res.status(404).json({
            message: err
        })
    });
});

router.delete('/peep/:id', async function(req, res, next) {
    const peepID = req.params.id;
    db.deletePeepByID(peepID).then(function() {
        res.json({
            message: 'Peep deleted successfully'
        })
    }).catch(function(err) {
        res.status(400).json({
            message: err
        })
    });
});

// Peep Likes Endpoints

router.get('/peep/:id/likes', async function(req, res, next) {
    const peepID = req.params.id;
    let likes = await db.getLikesForPeep(peepID);
    res.json({
        likes: likes,
        count: likes.length
    });
});

router.post('/peep/:id/like', async function(req, res, next) {
    if (!req.session.user) {
        res.json({
            message: 'You must be logged in to like a peep'
        });
    } else {
        const userID = req.session.user.id;
        const peepID = req.params.id;
        // Check if user has already liked peep
        let hasLiked = await db.hasUserLikedPeep(userID, peepID);
        if (hasLiked) {
            res.json({
                message: 'You have already liked this peep'
            });
            return;
        }
        db.likePeep(userID, peepID).then(function() {
            res.json({
                message: 'Peep liked successfully'
            })
        }).catch(function(err) {
            res.status(400).json({
                message: err
            });
        });
    }
});

router.delete('/peep/:id/like', async function(req, res, next) {
    if (!req.session.user) {
        res.json({
            message: 'You must be logged in to unlike a peep'
        });
    } else {
        const userID = req.session.user.id;
        const peepID = req.params.id;
        // Check if user has already liked peep
        let hasLiked = await db.hasUserLikedPeep(userID, peepID);
        if (!hasLiked) {
            res.json({
                message: 'You have not liked this peep'
            });
        } else {
            db.deleteLikeByUserForPeep(userID, peepID).then(function() {
                res.json({
                    message: 'Peep unliked successfully'
                });
            }).catch(function(err) {
                res.status(400).json({
                    message: err
                });
            });
        }
    }
});

// Replies

router.get('/peep/:id/replies', async function(req, res, next) {
    const peepID = req.params.id;
    let replies = await db.getRepliesForPeep(peepID);
    res.json({
        replies: replies,
    });
});

router.get('/peep/:id/replies/:limit', async function(req, res, next) {
    const peepID = req.params.id;
    const limit = req.params.limit;
    let replies = await db.getMostRecentRepliesForPeep(peepID, limit);
    res.json({
        replies: replies
    });
});

router.get('/reply/:id', async function(req, res, next) {
    const replyID = req.params.id;
    db.getReplyByID(replyID).then(function(reply) {
        res.json(reply)
    }).catch(function(err) {
        res.status(404).json({
            message: err
        });
    });
});

router.post('/peep/:id/reply', async function(req, res, next) {
    if (!req.session.user) {
        res.json({
            message: 'You must be logged in to reply to a peep'
        });
    } else {
        const userID = req.session.user.id;
        const peepID = req.params.id;
        const reply = req.body.reply;
        db.addReply(peepID, userID, reply).then(function() {
            res.json({
                message: 'Reply added successfully'
            });
        });
    }
});

router.delete('/reply/:id', async function(req, res, next) {
    if (!req.session.user) {
        res.json({
            message: 'You must be logged in to delete a reply'
        });
    } else {
        //const userID = req.session.user.id;
        const replyID = req.params.id;
        db.deleteReplyByID(replyID).then(function() {
            res.json({
                message: 'Reply deleted successfully'
            });
        }).catch(function(err) {
            res.status(400).json({
                message: err
            });
        });
    }
});


module.exports = router;