const Request = require('../models/requestModel');
const Apartment = require('../models/apartmentModel');
const mongoose = require('mongoose');

// GET all requests for super admin
const getRequests = async (req, res) => {
    const requests = await Request.find().sort({createdAt: -1});
    res.status(200).json(requests);
}

// GET all requests for admin within own realestate
const getRealEstateRequests = async (req, res) => {
    const _id = req.user._id.toString();
    const request = await Request.find({realestate_id: _id}).sort({createdAt: -1});
    res.status(200).json(request);
}

// GET all requests for client
const getClientRequests = async (req, res) => {
    const _id = req.user._id.toString();
    const request = await Request.find({user_id: _id}).sort({createdAt: -1});
    res.status(200).json(request);
}

// add a request for client
const addClientRequest = async (req, res) => {
    const {message} = req.body;
    if(!message){
        return res.status(400).json({error: 'Fill out the message property'});
    }

    const client_id = req.user._id.toString();
    const apartment_id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(apartment_id)){
        return res.status(400).json({error: 'Invalid ID'});
    }
    const check1 = await Apartment.findById(apartment_id).select('realestate_id');
    if(!check1){
        return res.status(400).json({error: 'The selected apartment does not exist'});
    }

    const check2 = await Request.findOne({apartment_id, client_id});
    if(check2 && check2.status !== 'rejected'){
        return res.status(400).json({error: 'Unless you are rejected, you can only request an apartment once'});
    }
    const realestate_id = check1.realestate_id;
    
    const request = await Request.create({realestate_id, apartment_id, client_id, message});
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
    if(check.client_id !== req.user._id.toString()){
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
    if(check.client_id !== req.user._id.toString()){
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
    if(check.realestate_id !== req.user._id.toString()){
        return res.status(400).json({error: 'Not elegible to edit other realestates request', a: check.realestate_id, b: req.user._id.toString()});
    }
    if(check.status !== 'pending'){
        return res.status(400).json({error: 'Only pending requests can be replied to'});
    }

    const request = await Request.findByIdAndUpdate(id, req.body);
    res.status(200).json(request);
}

module.exports = {
    getRequests, getRealEstateRequests, getClientRequests, addClientRequest, updateClientRequest, deleteClientRequest, updateRealEstateRequest
};