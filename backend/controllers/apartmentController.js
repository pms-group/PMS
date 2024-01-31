const Apartment = require('../models/apartmentModel');
const Request = require('../models/requestModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const upload = require('../middleware/uploadImage');
const fs = require('fs');


// GET all apartments
const getApartments = async (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = 4;
    const _id = req.query.id;
    if(_id){
        const apartment = await Apartment.findById(_id);
        const realestate_name = (await User.findById(apartment.realestate_id)).fullname;
        apartment.realestate_name = realestate_name;
        return res.status(200).json(apartment);
    }

    const documentsCount = await Apartment.countDocuments();
    const totalPage = Math.ceil(documentsCount / pageSize);

    const apartments = await Apartment.find().sort({createdAt: -1}).skip((currentPage - 1) * pageSize).limit(pageSize);
    const result = await Promise.all(
        apartments.map(async apartment => {
            const realestate_name = (await User.findById(apartment.realestate_id)).fullname;
            apartment.realestate_name = realestate_name;
            return apartment;
        })
    );
    
    
    res.set('X-Current-Page', currentPage);
    res.set('X-Total-Count', documentsCount);
    res.set('X-Total-Pages', totalPage);
    res.status(200).json(result);
}

// GET one realestate's apartments
const getAdminApartments = async (req, res) => {
    const _id = req.query.id;
    const currentPage = parseInt(req.query.page) || 1;
    const pageSize = 4;

    const documentsCount = await Apartment.countDocuments({realestate_id: _id});
    const totalPage = Math.ceil(documentsCount / pageSize);
    
    const apartments = await Apartment.find({realestate_id: _id}).sort({createdAt: -1}).skip((currentPage - 1) * pageSize).limit(pageSize);
    const realestate_name = (await User.findById(_id)).fullname;
    const result = apartments.map(apartment => {
        apartment.realestate_name = realestate_name;
        return apartment;
    });
    
    
    res.set('X-Current-Page', currentPage);
    res.set('X-Total-Count', documentsCount);
    res.set('X-Total-Pages', totalPage);
    res.status(200).json(result);
}

// add apartment
const addApartment = async (req, res) => {
    upload.array('images', 5)(req, res, async err => {
        if(err){
            return res.status(400).json({error: err.message, emptyFields: []});
        }
        const {bedrooms, bathrooms, type, price, available, description} = req.body;
        let emptyFields = [];
        emptyFields = checkEmptyFields({bedrooms, bathrooms, type, price, available});
        
        if(emptyFields.length > 0){
            req.files.length > 0 && req.files.forEach(deleteImages);
            return res.status(400).json({error: 'Fill out all', emptyFields});
        }

        let imageUrls = [];
        req.files.length > 0 && req.files.forEach(file => imageUrls.push(file.path));

        const realestate_id = req.user._id;
        
        const apartment = await Apartment.create({realestate_id, bedrooms, bathrooms, type, price, available, imageUrls, description});
        apartment.realestate_name = (await User.findById(realestate_id)).fullname;
        res.status(200).json(apartment);
    });
}

// UPDATE apartment
const updateApartment = async (req, res) => {
    upload.array('images', 5)(req, res, async err => {
        if(err){
            return res.status(400).json({error: err.message, emptyFields: []});
        }
        const _id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(_id)){
            return res.status(400).json({error: 'Invalid ID', emptyFields: []});
        }

        const {bedrooms, bathrooms, type, price, available, description, removePics} = req.body;
        let emptyFields = []; 
        emptyFields = checkEmptyFields({bedrooms, bathrooms, type, price, available});

        if(emptyFields.length > 0){
            req.files.length > 0 && req.files.forEach(deleteImages);
            return res.status(400).json({error: 'Fill out all', emptyFields});
        }

        const realestate_id = req.user._id;

        const check = await Apartment.findById(_id);
        if(!check){
            req.files.length > 0 && req.files.forEach(deleteImages);
            return res.status(400).json({error: 'No Apartment found with this ID', emptyFields});
        }
        if(check && realestate_id.toString() !== check.realestate_id.toString()){
            req.files.length > 0 && req.files.forEach(deleteImages);
            return res.status(400).json({error: 'You are only allowed to update apartments of your own RealEstate', emptyFields});
        }

        let imageUrls = check.imageUrls;
        if(removePics.toString() === 'true'){
            if(imageUrls && imageUrls.length > 0){
                imageUrls.forEach(deleteImages)
            } else{
                console.log('No Image Deleted');
            }
            imageUrls = []
        }
        if(req.files.length > 0){
            const remaining = 5 - imageUrls.length;
            if(req.files.length > remaining){
                const rmImages = imageUrls.slice(5-req.files.length);
                rmImages.forEach(deleteImages);
                imageUrls = imageUrls.slice(0, (5-req.files.length));
            }
            req.files.forEach((file) => imageUrls.push(file.path));
        }

        const apartment = await Apartment.findByIdAndUpdate(_id, {bedrooms, bathrooms, type, price, available, imageUrls, description}, {new: true});
        const realestate_name = (await User.findById(apartment.realestate_id)).fullname;
        apartment.realestate_name = realestate_name;
        res.status(200).json(apartment);
    });
    
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

    if(apartment.imageUrls && apartment.imageUrls.length > 0){
        apartment.imageUrls.forEach(deleteImages)
    }

    await Request.updateMany({apartment_id: id}, {
        realestate_name: 'Sorry, This Apartment has been removed', 
        status: 'pending'
    });

    res.status(200).json(apartment);
}

// commonly used functions
const checkEmptyFields = elements => {
    let emptyFields = []
    for(let key in elements){
        const value = elements[key];
        !value && emptyFields.push(key);
    }
    return emptyFields;
}
const imageDeleteError = err => {
    err ? console.log(`Error deleting Image: ${err}`) : console.log('Image deleted successfully');
}
const deleteImages = image => {
    if(fs.existsSync(image)){
        fs.unlink(image, imageDeleteError);
    }
}

module.exports = {
    getApartments, getAdminApartments, addApartment, updateApartment, deleteApartment
};