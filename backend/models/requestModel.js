const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requestSchema = new Schema({
    realestate_id: {
        type: String,
        required: true
    },
    apartment_id: {
        type: String,
        required: true
    },
    client_id: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    reply_message: {
        tyoe: String,
    },
    status: {
        type: String, // pending, accepted, rejected
        default: 'pending'
    }
}, {timestamps: true});

module.exports = mongoose.model('Request', requestSchema);