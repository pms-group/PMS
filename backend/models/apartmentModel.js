const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
    realestate_id: {
        type: String,
        required: true
    },
    roomnumber: {
        type: Number,
        required: true,
    },
    floornumber: {
        type: Number,
        required: true
    },
    blocknumber: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    furnished: {
        type: Boolean,
        required: true
    },
    parking: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    imageurls: {
        type: Array,
    },
    available: {
        type: Boolean,
        default: true
    }

}, {timestamps: true});

module.exports = mongoose.model('Apartment', apartmentSchema);