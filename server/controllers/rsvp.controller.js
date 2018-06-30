const express = require('express');
const Rsvp = require('../models/rsvp.model');
const User = require('../models/user.model');
const Guest = require('../models/guest.model');

class RsvpController {
    constructor(router) {
        router.route('/rsvp')
            .post(this.submitRsvp);
    }


    async submitRsvp(req, res, next) {
        try{
            console.log(req.body);
            const checkRsvp = await Rsvp.findOne({'user' : req.body.user});
            if (checkRsvp === null || checkRsvp === undefined) {
                const rsvp = await Rsvp.create(req.body);
                const updatesUser = await User.findOneAndUpdate({'_id' : req.body.userId, 'is_deleted' : false}, {'rsvp' : true}, {'new' : true});
                const updatedGuest = await Guest.findOneAndUpdate({'firstName' : req.body.firstName, 'lastName' : req.body.lastName}, {'rsvp' : req.body.attending}, {'new': true});

                res.status(200).json(rsvp);
            } else {
                res.status(403).json({'Error' : 'Rsvp already exists please choose edit rsvp'});
            }
        } catch(err) {
            next(err);
        }
    }

}

module.exports = RsvpController;