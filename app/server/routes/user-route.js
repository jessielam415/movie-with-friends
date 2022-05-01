'use strict';
const log = console.log;

// Express
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());

// Mongo and Mongoose
const { ObjectID } = require('mongodb')
const { mongoose } = require('../db/mongoose');

// helpers/middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");

//env
const { env, USE_TEST_USER, TEST_USER_ID, TEST_USER_EMAIL} = require("./../server.js")

// Get user schema
const { User } = require('../models/users')

module.exports = function(app) {

    // Route for adding a new user to the database
    app.post('/user', async (req, res) => {

        // check mongoose connection established
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        }  


        // Create a new user using the user mongoose model
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            age: req.body.age,
            gender: req.body.gender,
            following: [],
            followers: [],
            is_admin: req.body.is_admin,
            avatar: "unknown.jpg"
        })

        // save user to database (normal promise version):
        try {
            // Save the user
            const newUser = await user.save()
            res.send(newUser)
        } catch (error) {
            if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
                res.status(500).send('Internal server error')
            } else {
                res.status(400).send('Bad Request')
            }
        }

    })

    // Route for adding a new admin user to the database
    app.post('/user/admin', (req, res) => {

        // check mongoose connection established
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        }  

        // Create a new user using the user mongoose model
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            age: req.body.age,
            gender: req.body.gender,
            following: [],
            followers: [],
            is_admin: req.body.is_admin
        })

        // save user to database (normal promise version):
        user.save().then((result) => {
            res.status(200).send(result)
        
        }).catch((error) => {
            log(error) // log server error to the console, not to the client
            if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request
                res.status(500).send('Internal server error')
            } else {
                res.status(400).send('Bad Request') // 400 for bad request gets sent to client
            }
        })

    })

    /// Route for getting all user information
    app.get('/user', (req, res) => {

        // check mongoose connection established.
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        } 

        // get users (normal promise version)
        User.find().then((users) => {
            res.send(users) 
        })
        .catch((error) => {
            log(error)
            res.status(500).send("Internal Server Error")
        }) 

    })


    /// Route for getting information for one user
    app.get('/user/:id', (req, res) => {

        // get user id from params
        const id = req.params.id

        // validate id immediately
        if (!ObjectID.isValid(id)) {
            res.status(404).send()  // if invalid id, definitely can't find resource, 404.
            return;  // so that we don't run the rest of the handler.
        }

        // check mongoose connection established.
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        }

        // find by id (normal promise version):
        User.findById(id).then((user) => {
            if (!user) {
                res.status(404).send('Resource not found')  // could not find this restaurant
            } else {   
                res.send(user)
            }
        })
        .catch((error) => {
            log(error)
            res.status(500).send('Internal Server Error')  // server error
        })
    })

    // Route for finding a user by its username
    app.get('/findUser/:username', async (req, res) => {

        // get user id from params
        const name = req.params.username

        // check mongoose connection established.
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        }

        try {
            // Use the static method on the User model to find a user
            // by their email and password.
            const user = await User.findOne({username:name});
            if (!user) {
                res.status(404).send('No such user')
            } else {
                // Add the user's id and email to the session.
                // We can check later if the session exists to ensure we are logged in.
                res.status(200).send(user)
            }
        } catch (error) {
            // redirect to login if can't login for any reason
            res.status(500).send('server error')
        }

    })

    /// Route for updating a users first name
    app.patch('/user/firstname/:userid', (req, res) => {

        const id = req.params.userid

        // Good practise: Validate id immediately.
        if (!ObjectID.isValid(id)) {
            res.status(404).send()  // if invalid id, definitely can't find resource, 404.
            return;  // so that we don't run the rest of the handler.
        }

        // check mongoose connection established.
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        } 

        User.findById(id).then((user) => {
            if (!user) {
                res.status(404).send()
            } else {
                user.firstName = req.body.firstName
                const result = user.save()
                res.status(200).send(user)
            } 
        })
        .catch((error) => {
            log(error)
            res.status(500).send() // server error, could not delete.
        })
    })

    /// Route for updating a users last name
    app.patch('/user/lastname/:userid', (req, res) => {

        const id = req.params.userid

        // Good practise: Validate id immediately.
        if (!ObjectID.isValid(id)) {
            res.status(404).send()  // if invalid id, definitely can't find resource, 404.
            return;  // so that we don't run the rest of the handler.
        }

        // check mongoose connection established.
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        } 

        User.findById(id).then((user) => {
            if (!user) {
                res.status(404).send()
            } else {
                user.lastName = req.body.lastName
                const result = user.save()
                res.status(200).send(user)
            } 
        })
        .catch((error) => {
            log(error)
            res.status(500).send() // server error, could not delete.
        }) 
    })

    /// Route for updating a users profile image
    app.patch('/user/avatar/:userid', (req, res) => {

        const id = req.params.userid

        // Good practise: Validate id immediately.
        if (!ObjectID.isValid(id)) {
            res.status(404).send()  // if invalid id, definitely can't find resource, 404.
            return;  // so that we don't run the rest of the handler.
        }

        // check mongoose connection established.
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        } 

        User.findById(id).then((user) => {
            if (!user) {
                res.status(404).send()
            } else {
                user.avatar = req.body.avatar
                const result = user.save()
                res.status(200).send(user)
            } 
        })
        .catch((error) => {
            log(error)
            res.status(500).send() // server error, could not delete.
        }) 
    })


    // Route for updating a users password
    app.patch('/user/password/:username', (req, res) => {

        const username = req.params.username
        const curPassword = req.body.curPassword
        const newPassword = req.body.newPassword
        log(username)
        log(curPassword)
        log(newPassword)
        // check mongoose connection established.
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        } 

        User.findByUsernamePassword(username, curPassword).then((user) => {
            
            if (!user) {
                res.status(404).send()
            } else {
                user.password = newPassword
                const result = user.save()
                res.status(200).send("Found username password match and password updated")
            } 
        })
        .catch((error) => {
            log(error.toString())
            res.status(500).send("Error caught") // server error, could not delete.
        }) 
    })

    // Route for updating a users password
    app.patch('/user/password/admin/:username', async (req, res) => {

        const username = req.params.username
        const newPassword = req.body.newPassword

        // check mongoose connection established.
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        } 

        const user = await User.findOne({username: username});
        if (!user) {
            res.status(404).send()
        } else {
            user.password = newPassword
            const result = user.save()
            res.status(200).send("Found username password match and password updated")
        } 
    })


    /*** Login and Logout routes ***/
    // A route to login and create a session
    app.post('/user/login', mongoChecker, async (req, res) => {
        const username = req.body.username
        const password = req.body.password
        
        try {
            // Use the static method on the User model to find a user
            // by their email and password.
            User.findByUsernamePassword(username, password)
                .then(user => {
                    // Add the user's id to the session.
                    // We can check later if this exists to ensure we are logged in.
                    req.session.user = user;
                    res.send({ currentUser: user });
                })
                .catch(error => {
                    res.status(400).send()
                });
        } catch (error) {
            // redirect to login if can't login for any reason
            if (isMongoError(error)) { 
                res.status(500).redirect('/login');
            } else {
                res.status(400).redirect('/login');
            }
            alert("Username or Password is Incorrect. Please try again.")
        }

    })

    // A route to logout a user
    app.get('/user/logout', (req, res) => {
        // Remove the session
        req.session.destroy((error) => {
            if (error) {
                res.status(500).send(error)
            } else {
                res.redirect('/')
            }
        })
    })

    // A route to check if a user is logged in on the session
    app.get("/users/check-session", (req, res) => {
        if (env !== 'production' && USE_TEST_USER) { // test user on development environment.
            req.session.user = TEST_USER_ID;
            req.session.email = TEST_USER_EMAIL;
            res.send({ currentUser: TEST_USER_EMAIL })
            return;
        }
       
        if (req.session.user) {
            res.send({ currentUser: req.session.user });
        } else {
            res.status(401).send();
        }
    })

    app.post('/user/:username/:follow_username', async (req, res) => {
        const username = req.params.username
        const follow_username = req.params.follow_username
        
        // check mongoose connection established
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        }
    
        try { 
            const user = await User.findOne({username: username});
            const follow = await User.findOne({username: follow_username})
            if (!user || !follow) {
                res.status(404).send('Resource not found')  // could not find this user
            } else {   
                if (!user.following.includes(follow_username)) {
                    user.following.push(follow_username);
                }
                if (!follow.followers.includes(username)) {
                    follow.followers.push(username);
                }

                const userUp = await user.save();
                const followUp = await follow.save();
                const allUsers = await User.find();
                res.send({'user': userUp, 'followed': followUp, "allUsers": allUsers})
            }
        }
        catch(error) {
            res.status(500).send('Internal Server Error: ' + error.toString())  // server error
        }
    
    })
    
    app.delete('/user/:username/:following_username', async (req, res) => {
        const user_username = req.params.username
        const following_username = req.params.following_username

        try {
            const user = await User.findOne({username: user_username});
            const followed = await User.findOne({username: following_username});

            if (!user || !followed) {
                res.status(404).send("user not found")
            } else {
                user.following.remove(following_username);
                followed.followers.remove(user_username);
                
                const userUpdate = await user.save();
                const followedUpdate = await followed.save();
                const allUsers = await User.find()
                res.send({"user": userUpdate, "unfollowed": followedUpdate, "allUsers": allUsers})
            }
        } catch(error) {
            if (isMongoError(error)) { 
                res.status(500).send('Internal server error')
            } else {
                res.status(400).send('Bad Request') 
            }
        }
    })
    
    // Route deleting a user by username
    app.delete('/deleteUser/:username', async (req, res) => {

        const name = req.params.username

        // check mongoose connection established.
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        }

        // Delete a user by their username
        try {
            const user = await User.findOneAndDelete({ username: name }, {useFindAndModify: false});
            if (!user) {
                res.status(404).send()
            } else {   
                res.send()
            }
        } catch(error) {
            log(error)
            res.status(500).send() // server error, could not delete.
        }

    })

    // Make changes to user info based on user id
    app.patch('/user/:id', async (req, res) => {
        const id = req.params.id

        if (!ObjectID.isValid(id)) {
            res.status(404).send()
            return;  // so that we don't run the rest of the handler.
        }

        // check mongoose connection established.
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        }

        const fieldToUpdate = {}
        const propertyToChange = req.body.path
        fieldToUpdate[propertyToChange] = req.body.value
        // Update the user by their id.
        try {
            const user = await User.findOneAndUpdate({ _id: id }, {$set: fieldToUpdate }, {new: true, useFindAndModify: false})
            if (!user) {
                res.status(404).send('Resource not found')
            } else {   
                res.send(user)
            }
        } catch (error) {
            log(error)
            if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
                res.status(500).send('Internal server error')
            } else {
                res.status(400).send('Bad Request') 
            }
        }
    })

    app.delete('/delete/user/follow/:username', async (req, res) => {

        const username = req.params.username
        log(username)
        // check mongoose connection established.
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        }

        try {
            var users = await User.find();
            for (var i = 0; i < users.length; i++) {
                users[i].following.remove(username)
                users[i].followers.remove(username)
                users[i].save()
            }
            res.sendStatus(200)
            
        } catch(error) {
            console.log(error)
            res.status(500).send() // server error, could not delete.
        }

    })
}
