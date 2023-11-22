const Apartment = require('../models/apartmentModel');
const User = require('../models/userModel')
const mongoose = require('mongoose');

// GET all apartments
const getApartments = async (req, res) => {
    const apartments = await Apartment.find().sort({createdAt: -1});
    res.status(200).json(apartments);
}

// add apartment
const addApartment = async (req, res) => {
    const {roomnumber, floornumber, blocknumber, bedrooms, bathrooms, furnished, parking, type, price, imageurls, available} = req.body;
    if(!roomnumber || !floornumber || !blocknumber || !bedrooms || !bathrooms || furnished==null || parking==null || !type || !price){
        return res.status(400).json({error: 'Fill out all'});
    }

    const realestate_id = req.user._id.toString();
    const realestate = await User.findById(realestate_id).select('fullname');
    const realestate_name = realestate.fullname;
    const check = await Apartment.find({realestate_id, roomnumber});
    if(check.length > 0){
        return res.status(400).json({error: 'This apartment is already registered'});
    }

    const apartment = await Apartment.create({realestate_name, realestate_id, roomnumber, floornumber, blocknumber, bedrooms, bathrooms, furnished, parking, type, price, imageurls, available});
    res.status(200).json(apartment);
    
}

// UPDATE apartment
const updateApartment = async (req, res) => {
    const _id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID'});
    }
    const {roomnumber} = req.body;
    
    const realestate_id = req.user._id.toString();
    const check1 = await Apartment.findOne({realestate_id, roomnumber}).select('roomnumber');
    
    if(check1){
        if(roomnumber === check1.roomnumber && _id !== check1._id.toString()){
            return res.status(400).json({error: 'This room number is already registered with'});
        }
    }
    const check2 = await Apartment.findById(_id).select('realestate_id');
    if(realestate_id !== check2.realestate_id){
        return res.status(400).json({error: 'You are only allowed to update apartments of your own RealEstate'});
    }
    

    const apartment = await Apartment.findByIdAndUpdate(_id, req.body);
    res.status(200).json(apartment);
}

module.exports = {
    getApartments, addApartment, updateApartment
};