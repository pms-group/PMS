const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    contact: {
        type: String
    },
    privilege: {
        type: String,
        required: true,
        default: 'client'
    },
    imageUrl: {
        type: String,
        default: ''
    },
    address: {
        type: String
    },
    description: {
        type: String
    },
    gender: {
        type: String
    }
}, {timestamps: true});


module.exports = mongoose.model('User', userSchema);