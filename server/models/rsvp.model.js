const mongoose = require('mongoose');

const RsvpSchema = new mongoose.Schema({
    attending: {
       type: Boolean,
       required: true
    },
    comments : {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
});


const Rsvp = module.exports = mongoose.model('Rsvp', RsvpSchema);