require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const apartmentRoutes = require('./routes/apartments');
const requestRoutes = require('./routes/requests');
const userRoutes = require('./routes/user');

// express app
const app = express();

// middleware
app.use(express.json());
app.use((req, res, next) =>{
    console.log(req.path, req.method);
    next();
});

// routes
app.use('/api/apartments', apartmentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/user', userRoutes);
app.use((req, res) => {
    res.status(404).json({error: 'Page not found'});
})

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT);
        });
    })
    .catch( err => console.log(err));
