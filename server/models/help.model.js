const mongoose = require('mongoose');

const HelpSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String, 
        required: true
    },
    comments : {
        type: String,
        required: true
    }
});

HelpSchema.path('email').validate((email) => {
    let emailRegex = /^([\w-]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}, 'Please input a valid email address');

const Help = module.exports = mongoose.model('Help', HelpSchema);