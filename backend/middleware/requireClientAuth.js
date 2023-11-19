const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireClientAuth = async (req, res, next) => {
    
    // verify authentication
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).json({error: 'Authorization token required'});
    }

    const token = authorization.split(' ')[1];

    try{
        const {_id} = jwt.verify(token, process.env.SECRET);
        
        req.user = await User.findOne({_id}).select('privilege');
        req.user._id = _id;

        if(req.user.privilege !== 'user'){
            return res.status(401).json({error: 'Unauthorized privilege'});
        }
        next();

    } catch(error){
        console.log(error);
        return res.status(401).json({error: 'Request is not authorized'});
    }
}

module.exports = requireClientAuth;