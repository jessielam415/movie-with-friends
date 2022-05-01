const mongoose = require('mongoose');

const baseOptions = {
    discriminatorKey: '__type',
    collection: 'posts'
}
const Base = mongoose.model('Base', new mongoose.Schema({}, baseOptions));


 /* 
	Type: (List, Rating, Poll, WWM) already included as per the definition for all post types
	Id: Also included
 */

const ListOptionSchema = new mongoose.Schema({
    id: String,
    option: String
});

const List = Base.discriminator('List', new mongoose.Schema({
    title: String,
    options: [ListOptionSchema],
    author: String, /* Username of whoever made the post */
    timestamp: {type: Date, default: Date.now}
}));

const Rating = Base.discriminator('Rating', new mongoose.Schema({
	movie: String,
	rating: String,
	description: String,
    author: String, /* Username of whoever made the post */
    timestamp: {type: Date, default: Date.now}
}));

const WWM = Base.discriminator('WWM', new mongoose.Schema({
    movie: String,
	time: String,
	date: String,
	url: String,
	description: String,
    author: String, /* Username of whoever made the post */
    timestamp: {type: Date, default: Date.now}
}));

const VotedSchema = new mongoose.Schema({
	id: String,
    option: String,
    voters: Array
});

const Poll = Base.discriminator('Poll', new mongoose.Schema({
    title: String,
    options: [VotedSchema],
    author: String, /* Username of whoever made the post */
    timestamp: {type: Date, default: Date.now}
}));


module.exports = { Base, Rating, List, WWM, Poll };