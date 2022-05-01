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
const { Movie } = require('../models/movies')

module.exports = function(app) {
    //get all movie information
    app.get('/movie', async (req, res) => {
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        }

        try {
            const movies = await Movie.find()
            res.send(movies)
        }
        catch(error) {
            log(error)
            res.status(500).send("Internal Server Error")
        }
    })

    // get info on one movie by id
    app.get('/movie/:id', async (req,res) => {
        const id = req.params.id
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        }
        if (!ObjectID.isValid(id)) {
            res.status(404).send()  
            return;  
        }
        
        try {
            const movie = await Movie.findById(id);
            if (!movie) {
                res.status(404).send("Movie not found")
            }
            else {
                res.send(movie)
            }
        } catch(error) {
            log(error)
            if (isMongoError(error)) { 
                res.status(500).send('Internal server error')
            } else {
                res.status(400).send('Bad Request') 
            }
        }

    })

    //add new movie to db
    app.post('/movie', async (req,res) => {
        if (mongoose.connection.readyState != 1) {
            log('Issue with mongoose connection')
            res.status(500).send('Internal server error')
            return;
        }

        const movie = new Movie({
            title: req.body.title,
            synopsis: req.body.synopsis,
            runtime: req.body.runtime,
            ageRating: req.body.ageRating,
            date: req.body.date,
            genre: req.body.genre,
            image: req.body.image
        })

        try {
            const result = await movie.save()
            res.send(result)
        } catch(error) {
            log(error)
            if (isMongoError(error)) { 
                res.status(500).send('Internal server error')
            } else {
                res.status(400).send('Bad Request') 
            }
        }
    })

    // Delete movie from db
    app.delete('/movie/:id', async (req, res) => {

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
            const movie = await Movie.findOneAndDelete({ _id: id }, {useFindAndModify: false});
            if (!movie) {
                res.status(404).send()
            } else {   
                res.send()
            }
        } catch(error) {
            console.log(error)
            res.status(500).send() // server error, could not delete.
        }

    })
}