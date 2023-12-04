const Apartment = require('../models/apartmentModel');
const User = require('../models/userModel')
const mongoose = require('mongoose');

// GET all apartments
const getApartments = async (req, res) => {
    const apartments = await Apartment.find().sort({createdAt: -1});
    const result = await Promise.all(
        apartments.map(async apartment => {
            const realestate_name = (await User.findById(apartment.realestate_id)).fullname;
            apartment.realestate_name = realestate_name;
            return apartment;
        })
    )
    res.status(200).json(result);
}

// GET one realestates apartments
const getAdminApartments = async (req, res) => {
    const _id = req.user._id.toString();
    const apartments = await Apartment.find({realestate_id: _id}).sort({createdAt: -1});

    const realestate_name = (await User.findById(_id)).fullname;
    const result = apartments.map(apartment => {
        apartment.realestate_name = realestate_name;
        return apartment;
    });
    res.status(200).json(result);
}

// add apartment
const addApartment = async (req, res) => {
    const {bedrooms, bathrooms, type, price, available, imageurls, discription} = req.body;
    let emptyFields = [];

    if(!bedrooms){
        emptyFields.push('bedrooms')
    }
    if(!bathrooms){
        emptyFields.push('bathrooms')
    }
    if(!type){
        emptyFields.push('type')
    }
    if(!price){
        emptyFields.push('price')
    }
    if(!available){
        emptyFields.push('available')
    }
    
    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Fill out all', emptyFields});
    }

    const realestate_id = req.user._id;
    
    const apartment = await Apartment.create({realestate_id, bedrooms, bathrooms, type, price, available, imageurls, discription});
    apartment.realestate_name = (await User.findById(realestate_id)).fullname;
    res.status(200).json(apartment);
    
}

// UPDATE apartment
const updateApartment = async (req, res) => {
    const _id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).json({error: 'Invalid ID'});
    }

    const {bedrooms, bathrooms, type, price, available, imageurls, discription} = req.body;
    let emptyFields = [];

    if(!bedrooms){
        emptyFields.push('bedrooms')
    }
    if(!bathrooms){
        emptyFields.push('bathrooms')
    }
    if(!type){
        emptyFields.push('type')
    }
    if(!price){
        emptyFields.push('price')
    }
    if(!available){
        emptyFields.push('available')
    }
    
    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Fill out all', emptyFields});
    }

    const realestate_id = req.user._id;

    const check = await Apartment.findById(_id).select('realestate_id');
    if(check && realestate_id.toString() !== check.realestate_id.toString()){
        return res.status(400).json({error: 'You are only allowed to update apartments of your own RealEstate', emptyFields});
    }
    

    const apartment = await Apartment.findByIdAndUpdate(_id, {bedrooms, bathrooms, type, price, available, imageurls, discription});
    if(!apartment){
        return res.status(400).json({error: 'No Apartment found with this ID'});
    }
    res.status(200).json(apartment);
}

// Delete Apartment
const deleteApartment = async (req, res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID'});
    }
    const check = await Apartment.findById(id);
    if(!check){
        return res.status(400).json({error: 'The selected apartment does not exist'});
    }
    if(check.realestate_id.toString() !== req.user._id.toString()){
        return res.status(400).json({error: 'Not elegible to edit others Apartments'});
    }
    const apartment = await Apartment.findByIdAndDelete(id);
    res.status(200).json(apartment);
}

module.exports = {
    getApartments, getAdminApartments, addApartment, updateApartment, deleteApartment
};