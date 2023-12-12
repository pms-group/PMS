const Apartment = require('../models/apartmentModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const upload = require('../middleware/uploadImage');
const fs = require('fs');


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
    upload.array('images', 5)(req, res, async err => {
        if(err){
            return res.status(400).json({error: err.message});
        }
        const {bedrooms, bathrooms, type, price, available, description} = req.body;
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

        let imageUrls;
        if(req.files.length > 0){
            req.files.forEach((file) => {
                imageUrls.push(file.path)
            });
        }

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
            return res.status(400).json({error: err.message});
        }
        const _id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(_id)){
            return res.status(400).json({error: 'Invalid ID'});
        }

        const {bedrooms, bathrooms, type, price, available, description, removePics} = req.body;
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

        const check = await Apartment.findById(_id);
        if(!check){
            return res.status(400).json({error: 'No Apartment found with this ID'});
        }
        if(check && realestate_id.toString() !== check.realestate_id.toString()){
            return res.status(400).json({error: 'You are only allowed to update apartments of your own RealEstate', emptyFields});
        }

        let imageUrls = check.imageUrls;
        if(removePics){
            if(imageUrls && imageUrls.length > 0){
                imageUrls.forEach(imageUrl => {
                    if(fs.existsSync(imageUrl)){
                        fs.unlink(imageUrl, err => {
                            if(err){
                                console.log(`Error deleting Image: ${err}`);
                            } else{
                                console.log('Image deleted successfully');
                            }
                        });
                    }
                })
            } else{
                console.log('No Image Deleted');
            }
            imageUrls = []
        }
        if(req.files.length > 0){
            const remaining = 5 - imageUrls.length;
            if(req.files.length > remaining){
                const rmImages = imageUrls.slice(5-req.files.length);
                rmImages.forEach(rmImage => {
                    if(fs.existsSync(rmImage, err => {
                        if(err){
                            console.log(`Error deleting Image: ${err}`);
                        } else{
                            console.log('Image deleted successfully');
                        }
                    }));
                });
                imageUrls = imageUrls.slice(0, (5-req.files.length));
            }
            req.files.forEach((file) => {
                imageUrls.push(file.path);
            });
        }

        const apartment = await Apartment.findByIdAndUpdate(_id, {bedrooms, bathrooms, type, price, available, imageUrls, description});
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
        apartment.imageUrls.forEach(imageUrl => {
            if(fs.existsSync(imageUrl)){
                fs.unlink(imageUrl, err => {
                    if(err){
                        console.log(`Error deleting Image: ${err}`);
                    } else{
                        console.log('Image deleted successfully');
                    }
                });
            }
        })
    } else{
        console.log('No Image Deleted');
    }
    res.status(200).json(apartment);
}

module.exports = {
    getApartments, getAdminApartments, addApartment, updateApartment, deleteApartment
};