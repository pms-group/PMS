const User = require('../models/userModel');
const Apartment = require('../models/apartmentModel');
const Request = require('../models/requestModel');

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
    const emptyFields = [];

    if(!username){
        emptyFields.push('username');
    }
    if(!password){
        emptyFields.push('password');
    }

    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Fill out all blanks', emptyFields});
    }

    const user = await User.findOne({username});
    if(!user){
        return res.status(400).json({error: 'Incorrect Username', emptyFields});
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.status(400).json({error: 'Incorrect Password', emptyFields});
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
    const imageurl = user.imageurl;

    res.status(200).json({username,fullname, email, contact, address, description, gender, privilege, imageurl, _id, token});
};

// client signup route
const signupClient = async (req, res) => {
    const {username, fullname, email, password} = req.body;

    const emptyFields = [];

    if(!username){
        emptyFields.push('username');
    }
    if(!password){
        emptyFields.push('password');
    }
    if(!fullname){
        emptyFields.push('fullname');
    }
    if(!email){
        emptyFields.push('email');
    }

    // validation
    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Fill out all blanks', emptyFields});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({error: 'Invalid email format', emptyFields});
    }
    if(!validator.isStrongPassword(password)){
        return res.status(400).json({error: 'Weak password. The password should contain UPPER case, lower case, number and symbol keys.', emptyFields});
    }

    const exists = await User.findOne({username});
    
    if(exists){
        return res.status(400).json({error: 'Username already in use', emptyFields});
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const client = await User.create({username, fullname, email, password: hash});
    const fn = client.fullname;
    const pvg = client.privilege;

    res.status(200).json({fullname: fn, privilege: pvg});
};

// client update route
const updateClient = async (req, res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID'});
    }

    if(req.body.email && !validator.isEmail(req.body.email)){
        return res.status(400).json({error: 'Invalid email format'});
    }
    if(req.body.username){
        const check = await User.findOne({username: req.body.username});
        if(check && check.id !== id){
            return res.status(400).json({error: 'This username is taken'});        }
    }
    if(req.body.password){
        if(!validator.isStrongPassword(req.body.password)){
            return res.status(400).json({error: 'Weak password. The password should contain UPPER case, lower case, number and symbol keys.'});
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
    }

    if(id !== req.user._id.toString()){
        return res.status(400).json({error: 'You can only update your own'});
    }
    
    const client = await User.findByIdAndUpdate(id, req.body);
    if(!client){
        return res.status(400).json({error: 'No client found'});
    }

    const fn = client.fullname;
    const pvg = client.privilege;

    res.status(200).json({fullname: fn, privilege: pvg});
};

// superadmin update route
const updateSuper = async (req, res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID'});
    }

    if(req.body.email && !validator.isEmail(req.body.email)){
        return res.status(400).json({error: 'Invalid email format'});
    }
    if(req.body.username){
        const check = await User.findOne({username: req.body.username});
        if(check && check.id !== id){
            return res.status(400).json({error: 'This username is taken'});        }
    }
    if(req.body.password){
        if(!validator.isStrongPassword(req.body.password)){
            return res.status(400).json({error: 'Weak password. The password should contain UPPER case, lower case, number and symbol keys.'});
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
    }

    if(id !== req.user._id.toString()){
        return res.status(400).json({error: 'You can only update your own'});
    }

    const superadmin = await User.findByIdAndUpdate(id, req.body);
    if(!superadmin){
        return res.status(400).json({error: 'No superadmin found'});
    }

    const fn = superadmin.fullname;
    const pvg = superadmin.privilege;

    res.status(200).json({fullname: fn, privilege: pvg});
}

// admin signup route
const signupAdmin = async (req, res) => {
    const {username, fullname, email, contact, password, privilege='admin'} = req.body;
    const emptyFields = [];
    if(!username){
        emptyFields.push('username');
    }
    if(!fullname){
        emptyFields.push('fullname');
    }
    if(!contact){
        emptyFields.push('contact');
    }
    if(!email){
        emptyFields.push('email');
    }
    if(!password){
        emptyFields.push('password');
    }

    // validation
    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Fill out all', emptyFields});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({error: 'Invalid email format', emptyFields});
    }
    if(!validator.isStrongPassword(password)){
        return res.status(400).json({error: 'Weak password. The password should contain UPPER case, lower case, number and symbol keys.', emptyFields});
    }

    const exists = await User.findOne({username});
    
    if(exists){
        return res.status(400).json({error: 'Username already in use', emptyFields});
    }
    const exists1 = await User.findOne({contact});
    
    if(exists1){
        return res.status(400).json({error: 'Phone Number already in use', emptyFields});
    }
    const exists2 = await User.findOne({fullname, privilege: 'admin'});
    
    if(exists2){
        return res.status(400).json({error: 'RealEstate name already in use', emptyFields});
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const admin = await User.create({username, fullname, contact, email, password: hash, privilege});

    const fn = admin.fullname;
    const pvg = admin.privilege;

    res.status(200).json({fullname: fn, privilege: pvg});
}

// admin delete route
const deleteAdmin = async (req, res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID'});
    }

    const user = await User.findById(id);
    if(user.privilege !== 'admin'){
        return res.status(400).json({error: 'You can only delete an admin'});
    }

    const admin = await User.findByIdAndDelete(id);
    if(!admin){
        return res.status(400).json({error: 'No admin found'});
    }
    const apartment = await Apartment.deleteMany({realestate_id: id});
    const request = await Request.updateMany({realestate_id: id}, {realestate_name: 'Sorry, This Apartment has been removed', status: 'pending'});
    
    const fn = admin.fullname;
    const pvg = admin.privilege;

    res.status(200).json({fullname: fn, privilege: pvg}, apartment, request);
}

// get admin route
const getAdmins = async (req, res) => {
    const privilege = 'admin'
    const admins = await User.find({privilege}).select('-password').sort({createdAt: -1});

    res.status(200).json(admins);
}

// admin update route
const updateAdmin = async (req, res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID'});
    }

    if(req.body.email && !validator.isEmail(req.body.email)){
        return res.status(400).json({error: 'Invalid email format'});
    }
    if(req.body.username){
        const check = await User.findOne({username: req.body.username});
        if(check && check.id !== id){
            return res.status(400).json({error: 'This username is taken'});        }
    }
    if(req.body.password){
        if(!validator.isStrongPassword(req.body.password)){
            return res.status(400).json({error: 'Weak password. The password should contain UPPER case, lower case, number and symbol keys.'});
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
    }
    if(id !== req.user._id.toString()){
        return res.status(400).json({error: 'You can only update your own'});
    }

    const admin = await User.findByIdAndUpdate(id, req.body);
    if(!admin){
        return res.status(400).json({error: 'No admin found'});
    }

    const fn = admin.fullname;
    const pvg = admin.privilege;

    res.status(200).json({fullname: fn, privilege: pvg});
}



module.exports = { loginUser, signupClient, updateClient, updateSuper, signupAdmin, deleteAdmin, getAdmins, updateAdmin };