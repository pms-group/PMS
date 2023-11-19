const User = require('../models/userModel');
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

    if(!username || !password){
        return res.status(400).json({error: 'Fill out all blanks'});
    }

    const user = await User.findOne({username});
    if(!user){
        return res.status(400).json({error: 'Incorrect Username'});
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.status(400).json({error: 'Incorrect Password'});
    }

    // create token
    const token = createToken(user._id);
    const fn = user.fullname;
    const pvg = user.privilege;
    const _id = user._id;

    res.status(200).json({fullname: fn, privilege: pvg, _id, token});
};

// client signup route
const signupClient = async (req, res) => {
    const {username, fullname, email, password} = req.body;

    // validation
    if(!username || !fullname || !email || !password){
        return res.status(400).json({error: 'Fill out all'});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({error: 'Invalid email format'});
    }
    if(!validator.isStrongPassword(password)){
        return res.status(400).json({error: 'Weak password. The password should contain UPPER case, lower case, number and symbol keys.'});
    }

    const exists = await User.findOne({username});
    
    if(exists){
        return res.status(400).json({error: 'Username already in use'});
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
    const {username, fullname, email, password, privilege='admin'} = req.body;

    // validation
    if(!username || !fullname || !email || !password){
        return res.status(400).json({error: 'Fill out all'});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({error: 'Invalid email format'});
    }
    if(!validator.isStrongPassword(password)){
        return res.status(400).json({error: 'Weak password. The password should contain UPPER case, lower case, number and symbol keys.'});
    }

    const exists = await User.findOne({username});
    
    if(exists){
        return res.status(400).json({error: 'Username already in use'});
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const admin = await User.create({username, fullname, email, password: hash, privilege});

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

    const fn = admin.fullname;
    const pvg = admin.privilege;

    res.status(200).json({fullname: fn, privilege: pvg});
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