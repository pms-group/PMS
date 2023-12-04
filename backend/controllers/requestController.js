const Request = require('../models/requestModel');
const User = require('../models/userModel')
const Apartment = require('../models/apartmentModel');
const mongoose = require('mongoose');

// GET all requests for super admin
const getRequests = async (req, res) => {
    const requests = await Request.find().sort({createdAt: -1});
    const result = await Promise.all(
        requests.map(async request => {
            const realestate_name = await User.findById(request.realestate_id);
            if(realestate_name){
                request.realestate_name = realestate_name.fullname;
            }
            const client_name = (await User.findById(request.client_id)).fullname;
            request.client_name = client_name;
            return request;
        })
    );
    res.status(200).json(result);
}

// GET all requests for admin within own realestate
const getRealEstateRequests = async (req, res) => {
    const _id = req.user._id.toString();
    const requests = await Request.find({realestate_id: _id}).sort({createdAt: -1});
    const result = await Promise.all(
        requests.map(async request => {
            const realestate_name = (await User.findById(request.realestate_id)).fullname;
            const client_name = (await User.findById(request.client_id)).fullname;
            request.realestate_name = realestate_name;
            request.client_name = client_name;
            return request;
        })
    );
    res.status(200).json(result);
}

// GET all requests for client
const getClientRequests = async (req, res) => {
    const _id = req.user._id.toString();
    const requests = await Request.find({client_id: _id}).sort({createdAt: -1});
    const result = await Promise.all(
        requests.map(async request => {
            const realestate_name = (await User.findById(request.realestate_id)).fullname;
            const client_name = (await User.findById(request.client_id)).fullname;
            request.realestate_name = realestate_name;
            request.client_name = client_name;
            return request;
        })
    );
    res.status(200).json(result);
}

// add a request for client
const addClientRequest = async (req, res) => {
    const {message} = req.body;
    if(!message){
        return res.status(400).json({error: 'Fill out the message property'});
    }

    const client_id = req.user._id;
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({error: 'Invalid ID'});
    }
    const check1 = await Apartment.findById(req.params.id);
    if(!check1){
        return res.status(400).json({error: 'The selected apartment does not exist'});
    }
    const apartment_id = check1._id;

    const check2 = await Request.findOne({apartment_id, client_id});
    if(check2 && check2.status !== 'rejected'){
        return res.status(400).json({error: 'Unless you are rejected, you can only request an apartment once'});
    }
    const realestate_id = check1.realestate_id;
    
    const request = await Request.create({realestate_id, apartment_id, client_id, message});
    request.realestate_name = (await User.findById(realestate_id)).fullname;
    request.client_name = (await User.findById(client_id)).fullname;
    res.status(200).json(request);
}

// UPDATE a request for client
const updateClientRequest = async (req, res) => {
    const {message} = req.body;
    if(!message){
        return res.status(400).json({error: 'Fill out the message property'});
    }

    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID'});
    }
    const check = await Request.findById(id);
    if(!check){
        return res.status(400).json({error: 'The selected request does not exist'});
    }
    if(check.client_id.toString() !== req.user._id.toString()){
        return res.status(400).json({error: 'Not elegible to edit others request'});
    }
    if(check.status !== 'pending'){
        return res.status(400).json({error: 'Only pending requests can be modified'});
    }

    const request = await Request.findByIdAndUpdate(id, {message});
    res.status(200).json(request);
}

// DELETE a request for client
const deleteClientRequest = async (req, res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID'});
    }
    const check = await Request.findById(id);
    if(!check){
        return res.status(400).json({error: 'The selected request does not exist'});
    }
    if(check.client_id.toString() !== req.user._id.toString()){
        return res.status(400).json({error: 'Not elegible to edit others request'});
    }
    if(check.status !== 'pending'){
        return res.status(400).json({error: 'Only pending requests can be deleted'});
    }

    const request = await Request.findByIdAndDelete(id);
    res.status(200).json(request);
}

// respond for a request by admin
const updateRealEstateRequest = async (req, res) =>{
    const {reply_message, status} = req.body;
    if(!reply_message || !status){
        return res.status(400).json({error: 'Fill out all'});
    }

    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: 'Invalid ID'});
    }
    const check = await Request.findById(id);
    
    if(!check){
        return res.status(400).json({error: 'The selected request does not exist'});
    }
    if(check.realestate_id.toString() !== req.user._id.toString()){
        return res.status(400).json({error: 'Not elegible to edit other realestates request', a: check.realestate_id, b: req.user._id.toString()});
    }
    if(check.status !== 'pending'){
        return res.status(400).json({error: 'Only pending requests can be replied to'});
    }

    const request = await Request.findByIdAndUpdate(id, req.body);
    if(status === 'accepted'){
        const apartment = await Apartment.findById(request.apartment_id);
        if(!apartment){
            return res.status(400).json({error: 'Apartment not found'});
        }
        if(apartment.available === 0){
            return res.status(400).json({error: 'This Apartment is sold out'});
        }
        await Apartment.findByIdAndUpdate(request.apartment_id, {$inc: {available: -1}});
    }
    res.status(200).json(request);
}

module.exports = {
    getRequests, getRealEstateRequests, getClientRequests, addClientRequest, updateClientRequest, deleteClientRequest, updateRealEstateRequest
};