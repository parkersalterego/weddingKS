const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'generalUser'
    },
    secStamp: String,
    refreshToken: String,
    is_deleted: {
        type: Boolean,
        default: false
    }
});

const User = module.exports = mongoose.model('User', UserSchema);