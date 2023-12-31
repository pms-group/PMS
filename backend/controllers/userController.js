const User = require('../models/userModel');
const Apartment = require('../models/apartmentModel');
const Request = require('../models/requestModel');
const upload = require('../middleware/uploadImage')

const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const mongoose = require('mongoose');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d'})
};

// login user
const loginUser = async (req, res) => {
    const {username, password} = req.body;
    let emptyFields = [];
    emptyFields = checkEmptyFields({username, password})

    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Fill out all blanks', emptyFields});
    }

    const user = await User.findOne({username})
    if(!user){
        return res.status(400).json({error: 'Incorrect Username', emptyFields: ['username']});
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.status(400).json({error: 'Incorrect Password', emptyFields: ['password']});
    }

    // create token
    const token = createToken(user._id);
    const fullname = user.fullname;
    const email = user.email;
    const contact = user.contact;
    const address = user.address;
    const description = user.description;
    const gender = user.gender;
    const privilege = user.privilege;
    const _id = user._id;
    const imageUrl = user.imageUrl;
    res.status(200).json({username, fullname, email, contact, address, description, gender, privilege, _id, imageUrl, token});
};

// client signup route
const signupClient = async (req, res) => {
    const {username, fullname, email, password} = req.body;
    let emptyFields = [];
    emptyFields = checkEmptyFields({username, fullname, email, password})

    // validation
    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Fill out all blanks', emptyFields});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({error: 'Invalid email format', emptyFields: ['email']});
    }
    if(!validator.isStrongPassword(password)){
        return res.status(400).json({error: 'Weak password. The password should contain UPPER case, lower case, number and symbol keys.', emptyFields: ['password']});
    }

    const exists = await User.findOne({username});
    
    if(exists){
        return res.status(400).json({error: 'Username already in use', emptyFields: ['username']});
    }

    const exists1 = await User.findOne({email});
    
    if(exists1){
        return res.status(400).json({error: 'Email already in use', emptyFields: ['email']});
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const client = await User.create({username, fullname, email, password: hash});
    const fn = client.fullname;
    const pvg = client.privilege;

    res.status(200).json({fullname: fn, privilege: pvg});
};

// update profile route
const updateProfile = async (req, res) => {
    upload.single('image')(req, res, async err => {
        if(err){
            return res.status(400).json({error: err.message, emptyFields: []});
        }
        const {username, fullname, email, contact, address, description, gender, changePWD, oldPWD, newPWD, removePic} = req.body;
        let emptyFields = [];
        emptyFields = checkEmptyFields({username, fullname, email, contact, gender});
        emptyFields = changePWD.toString() === 'true' ? 
            checkEmptyFields({username, fullname, email, contact, gender, oldPWD, newPWD}) : 
            checkEmptyFields({username, fullname, email, contact, gender});

        // validation
        if(emptyFields.length > 0){
            req.file && fs.unlink(req.file.path, imageDeleteError);
            return res.status(400).json({error: 'Fill out all blanks', emptyFields});
        }
        if(!validator.isEmail(email)){
            req.file && fs.unlink(req.file.path, imageDeleteError);
            return res.status(400).json({error: 'Invalid email format', emptyFields: ['email']});
        }
        if(newPWD && !validator.isStrongPassword(newPWD)){
            req.file && fs.unlink(req.file.path, imageDeleteError);
            return res.status(400).json({error: 'Weak password. The password should contain UPPER case, lower case, number and symbol keys.', emptyFields: ['password']});
        }

        const exists = await User.findOne({username});
        
        if(exists && exists._id.toString() !== req.user._id.toString()){
            req.file && fs.unlink(req.file.path, imageDeleteError);
            return res.status(400).json({error: 'Username already in use', emptyFields: ['username']});
        }

        const exists1 = await User.findOne({email});
        
        if(exists1 && exists1._id.toString() !== req.user._id.toString()){
            req.file && fs.unlink(req.file.path, imageDeleteError);
            return res.status(400).json({error: 'Email already in use', emptyFields: ['email']});
        }

        const exists2 = await User.findOne({contact});
        
        if(exists2 && exists2._id.toString() !== req.user._id.toString()){
            req.file && fs.unlink(req.file.path, imageDeleteError);
            return res.status(400).json({error: 'Phone Number already in use', emptyFields: ['contact']});
        }

        const exists3 = await User.findOne({fullname, privilege: 'admin'});
        
        if(exists3 && req.user.privilege === 'admin' && exists3._id.toString() !== req.user._id.toString()){
            req.file && fs.unlink(req.file.path, imageDeleteError);
            return res.status(400).json({error: 'RealEstate name already in use', emptyFields: ['fullname']});
        }

        let hash;
        if(changePWD.toString() === 'true'){
            const user = await User.findById(req.user._id).select('password');

            const match = await bcrypt.compare(oldPWD, user.password);
            if(!match){
                req.file && fs.unlink(req.file.path, imageDeleteError);
                return res.status(400).json({error: 'Incorrect Password', emptyFields: ['password']});
            }
            const salt = await bcrypt.genSalt(10);
            hash = await bcrypt.hash(newPWD, salt);
        }

        let imageUrl;
        if(req.file){
            imageUrl = req.file.path;
        }
        if(removePic.toString() === 'true'){
            imageUrl = '';
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id, {username, fullname, email, contact, address, description, gender, password: hash, imageUrl});
        const oldImageUrl = updatedUser.imageUrl;
        if(oldImageUrl && (removePic.toString() === 'true' || imageUrl) && fs.existsSync(oldImageUrl)){
            fs.unlink(oldImageUrl, imageDeleteError);
        } else{
            console.log('No Image Deleted');
        }

        const fn = updatedUser.fullname;
        const pvg = updatedUser.privilege;

        res.status(200).json({fullname: fn, privilege: pvg});
    });
}

// admin signup route
const signupAdmin = async (req, res) => {
    const {username, fullname, email, contact, password, privilege='admin'} = req.body;
    let emptyFields = [];
    emptyFields = checkEmptyFields({username, fullname, email, contact, password});

    // validation
    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Fill out all', emptyFields});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({error: 'Invalid email format', emptyFields: ['email']});
    }
    if(!validator.isStrongPassword(password)){
        return res.status(400).json({error: 'Weak password. The password should contain UPPER case, lower case, number and symbol keys.', emptyFields: ['password']});
    }

    const exists = await User.findOne({username});
    
    if(exists){
        return res.status(400).json({error: 'Username already in use', emptyFields: ['']});
    }
    const exists1 = await User.findOne({contact});
    
    if(exists1){
        return res.status(400).json({error: 'Phone Number already in use', emptyFields: ['contact']});
    }
    const exists2 = await User.findOne({fullname, privilege: 'admin'});
    
    if(exists2){
        return res.status(400).json({error: 'RealEstate name already in use', emptyFields: ['fullname']});
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const admin = (await User.create({username, fullname, contact, email, password: hash, privilege}));

    const cr_at = admin.createdAt;
    const id= admin._id;
    const fn = admin.fullname;
    const pvg = admin.privilege;
    const ctc = admin.contact;
    const eml = admin.email;


    res.status(200).json({_id: id, fullname: fn, privilege: pvg, email: eml, contact: ctc, createdAt: cr_at});
}

// admin delete route
const deleteAdmin = async (req, res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID'});
    }

    const user = await User.findById(id);
    if(!user){
        return res.status(400).json({error: 'No admin found'});
    }
    if(user.privilege !== 'admin'){
        return res.status(400).json({error: 'You can only delete an admin'});
    }

    const admin = await User.findByIdAndDelete(id);
    

    let apartments = await Apartment.find({realestate_id: id}).select('imageUrls');
    if(apartments && apartments.length > 0){
        apartments.forEach(apartment => {
            const imageUrls = apartment.imageUrls;
            if(imageUrls && imageUrls > 0){
                imageUrls.forEach(imageUrl => fs.existsSync(imageUrl) && fs.unlink(imageUrl, imageDeleteError));
            } else{
                console.log('No Image Deleted');
            }
        });
    }

    apartments = await Apartment.deleteMany({realestate_id: id});
    const request = await Request.updateMany({realestate_id: id}, {
        realestate_name: 'Sorry, This Apartment has been removed', 
        status: 'pending'
    });
    
    if(admin.imageUrl && fs.existsSync(admin.imageUrl)){
        fs.unlink(admin.imageUrl, imageDeleteError);
    }

    res.status(200).json({_id: admin._id});
}

// get admin route
const getAdmins = async (req, res) => {
    const privilege = 'admin'
    const page = parseInt(req.query.page) || 1;
    const pageSize = 3;
    const _id = req.query.id;
    if(_id){
        const admin = await User.findOne({_id, privilege}).select('-username -password');
        return res.status(200).json(admin);
    }
    const admins = await User.find({privilege}).select('-username -password').sort({createdAt: -1}).skip((page - 1) * pageSize).limit(pageSize);

    const documentsCount = await User.countDocuments({privilege});
    res.set('X-Total-Count', documentsCount);
    res.set('X-Total-Pages', Math.ceil(documentsCount / pageSize));
    res.status(200).json(admins);
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

module.exports = { loginUser, signupClient, updateProfile, signupAdmin, deleteAdmin, getAdmins };