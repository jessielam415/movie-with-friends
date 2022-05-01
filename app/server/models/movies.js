const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: String,
    runtime: String,
    ageRating: String,
    synopsis: String,
    date: String,
    genre: String,
    image: String
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = { Movie };