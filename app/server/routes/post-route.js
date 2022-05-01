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

// get post schema objects
const { User } = require('../models/users')
const { Base, List, Rating, WWM, Poll } = require('../models/posts')


module.exports = function(app){

	app.post('/post/list', (req, res) => {

		if (mongoose.connection.readyState != 1) {
			log('Issue with mongoose connection')
			res.status(500).send('Internal server error')
			return;
		}

		const list = new List({
		   	title: req.body.title,
		    options: req.body.options,
		    author: req.body.author,
		    timestamp: req.body.timestamp
		});

		try {
			list.save()	
			res.status(200).send(list)
		} catch(error) {
			if (typeof error === 'object' && error !== null && error.name === "MongoNetworkError") {
				res.status(500).send('Internal server error')
			} else {
				res.status(400).send('Bad Request')
			}
		}
	})

	app.post('/post/rating', (req, res) => {
	
		if (mongoose.connection.readyState != 1) {
			log('Issue with mongoose connection')
			res.status(500).send('Internal server error')
			return;
		}

		const rating = new Rating({
		    movie: req.body.movie,
			rating: req.body.rating,
			description: req.body.description,
		    author: req.body.author,
		    timestamp: req.body.timestamp
		});

		try {
			rating.save()	
			res.status(200).send(rating)
		} catch(error) {
			if (typeof error === 'object' && error !== null && error.name === "MongoNetworkError") {
				res.status(500).send('Internal server error')
			} else {
				res.status(400).send('Bad Request')
			}
		}
	})

	app.post('/post/wwm', (req, res) => {
	
		if (mongoose.connection.readyState != 1) {
			log('Issue with mongoose connection')
			res.status(500).send('Internal server error')
			return;
		}

		const wwm = new WWM({
		    movie: req.body.movie,
			time: req.body.time,
			date: req.body.date,
			url: req.body.url,
			description: req.body.description,
		    author: req.body.author,
		    timestamp: req.body.timestamp
		});

		try {
			wwm.save()	
			res.status(200).send(wwm)
		} catch(error) {
			if (typeof error === 'object' && error !== null && error.name === "MongoNetworkError") {
				res.status(500).send('Internal server error')
			} else {
				res.status(400).send('Bad Request')
			}
		}
	})

	app.post('/post/poll', (req, res) => {
	
		if (mongoose.connection.readyState != 1) {
			log('Issue with mongoose connection')
			res.status(500).send('Internal server error')
			return;
		}

		const poll = new Poll({
		    title: req.body.title,
		    options: req.body.options,
		    author: req.body.author,
		    timestamp: req.body.timestamp
		});

		try {
			poll.save()	
			res.status(200).send(poll)
		} catch(error) {
			if (typeof error === 'object' && error !== null && error.name === "MongoNetworkError") {
				res.status(500).send('Internal server error')
			} else {
				res.status(400).send('Bad Request')
			}
		}
	})

	app.patch('/post/poll/update', async (req, res) => {
	
		var name = req.body.name
		var id = req.body.id
		var author = req.body.user

		if (!ObjectID.isValid(id)) {
			res.status(404).send() 
			return; 
		}

		if (mongoose.connection.readyState != 1) {
			log('Issue with mongoose connection')
			res.status(500).send('Internal server error')
			return;
		}

		try {
			const post = await Base.findById(id)
			if (!post) {
				res.status(404).send('Resource not found')
			} else {
				
				for (var i = 0; i < post.options.length; i++) {
					if (post.options[i].option === name) {
						post.options[i].voters = post.options[i].voters.concat(author)
						break 
					}
				}

				post.save()	
				res.status(200).send(post)				
			}
		} catch(error) {
			if (typeof error === 'object' && error !== null && error.name === "MongoNetworkError") {
				res.status(500).send('Internal server error')
			} else {
				res.status(400).send('Bad Request')
			}
		}
	})


	// get all posts of all types
	app.get('/post', async (req, res) => {

		if (mongoose.connection.readyState != 1) {
			log('Issue with mongoose connection')
			res.status(500).send('Internal server error')
			return;
		} 

		try {
			const posts = await Base.find() /* Base is like the parent class of all posts */
			res.send(posts) 
		} catch(error) {
			res.status(500).send("Internal Server Error")
		}
	})

	app.get('/post/:type', async (req, res) => {

		const type = req.params.type

		if (mongoose.connection.readyState != 1) {
			log('Issue with mongoose connection')
			res.status(500).send('Internal server error')
			return;
		} 

		try {
			if (type !== "List" && type !== "Rating" && type !== "WWM" && type !== "Poll") {
				res.status(404).send('Resource not found')
			} else {
				const posts = await Base.find({__type: type})
				res.send(posts) 
			}
		} catch(error) {
			res.status(500).send("Internal Server Error")
		}
	})

	app.get('/post/:username/:limit', async (req, res) => {
	
		const username = req.params.username
		const limit = req.params.limit
		
		if (mongoose.connection.readyState != 1) {
			log('Issue with mongoose connection')
			res.status(500).send('Internal server error')
			return;
		}

		try {
			const user_posts = await Base.find({author: username})

			if (!user_posts) {
				res.status(404).send('Resource not found')
			} else {
				var list = user_posts.sort(function (a, b) {
					return Date.parse(b.timestamp) - Date.parse(a.timestamp)
				}).slice(0, parseInt(limit))

				res.send({list: list, length: user_posts.length})
			}
		} catch(error) {
			res.status(500).send(error.toString())
		}
	})

	app.get('/post/:username', async (req, res) => {
	
		const username = req.params.username
		
		if (mongoose.connection.readyState != 1) {
			log('Issue with mongoose connection')
			res.status(500).send('Internal server error')
			return;
		}

		try {
			const user_posts = await Base.find({author: username})
			log(user_posts)
			if (!user_posts) {
				res.status(404).send('Resource not found')
			} else {
				res.send(user_posts)
			}
		} catch(error) {
			res.status(500).send('Internal Server Error')
		}
	})

	app.get('/timeline/:username/:limit', async (req, res) => {
	
		const username = req.params.username
		const limit = req.params.limit

		if (mongoose.connection.readyState != 1) {
			log('Issue with mongoose connection')
			res.status(500).send('Internal server error')
			return;
		}
	
		try {
			const user = await User.find({username: username})
			if (!user) {
				res.status(404).send('Resource not found')
			} else {
				
				const admins = await User.find({is_admin: true})
				if (!admins) {
					res.status(404).send('Resource not found')
				} else {
					var admin_criteria = admins.map((admin) => { return {author: admin.username}})
					var following = user[0].following.map((a) =>{ return {author: a} })
					var criteria = [{author: username}, {is_admin: true}].concat(following).concat(admin_criteria)
					
					const posts = await Base.find().or(criteria)

					var list = posts.sort(function (a, b) {
						return Date.parse(b.timestamp) - Date.parse(a.timestamp)
					}).slice(0, parseInt(limit))

					var user_to_img = {}
					for (var i = 0; i < list.length; i++) {
						var inner_user = await User.findOne({username: list[i].author})
						user_to_img[inner_user.username] = inner_user.avatar 
					}
					
					res.send({list: list, length: posts.length, user_to_img: user_to_img})
				}
			}
			
		} catch(error) {
			res.status(500).send(error)
		}
	})

	// Delete a post from db
    app.delete('/post/:id', async (req, res) => {

        const id = req.params.id

        // check mongoose connection established.
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        }
        
        // check if movie id is valid
        if (!ObjectID.isValid(id)) {
            res.status(404).send()  
            return;  
        }

        // Delete a movie by its id
        try {
            const post = await Base.findOneAndDelete({ _id: id }, {useFindAndModify: false});
            if (!post) {
                res.status(404).send()
            } else {   
                res.send()
            }
        } catch(error) {
            console.log(error)
            res.status(500).send() // server error, could not delete.
        }

    })

    app.delete('/posts/:username', async (req, res) => {
    	
	    const username = req.params.username
	    
        // check mongoose connection established.
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        }
        
        // Delete all posts by user with username
        try {
            await Base.deleteMany({ author: username });
            res.sendStatus(200)
            
        } catch(error) {
            console.log(error)
            res.status(500).send() // server error, could not delete.
        }

    })
}