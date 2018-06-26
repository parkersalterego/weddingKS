const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    sendInvitation: {
        type: Boolean,
        required: true
    },
    rsvp: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

const Guest = module.exports = mongoose.model('Guest', GuestSchema);