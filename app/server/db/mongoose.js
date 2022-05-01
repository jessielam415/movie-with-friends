'use strict';

const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://dbUser:dbUserPassword@cluster0.zyky9.mongodb.net/Team12?retryWrites=true&w=majority", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

module.exports = { mongoose }