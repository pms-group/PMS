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
        default: 'user'
    },
    imageurl: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
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