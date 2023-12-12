const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
    realestate_name: {
        type: mongoose.Schema.Types.String,
        ref: 'User'
    },
    realestate_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    type: {
        type: String, // Sell, Rent
        required: true
    },
    price: {
        type: String,
        required: true
    },
    available: {
        type: Number,
        required: true
    },
    imageUrls: {
        type: Array,
    },
    description: {
        type: String, // Furnished ?, Parking ?
    }
    

}, {timestamps: true});

module.exports = mongoose.model('Apartment', apartmentSchema);