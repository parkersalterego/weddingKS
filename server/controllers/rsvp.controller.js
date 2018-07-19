const express = require('express');
const Rsvp = require('../models/rsvp.model');
const User = require('../models/user.model');
const Guest = require('../models/guest.model');

class RsvpController {
    constructor(router) {
        router.route('/rsvp')
            .post(this.submitRsvp)
            .get(this.getAll);

    }


    async submitRsvp(req, res, next) {
        try{
            const checkRsvp = await Rsvp.findOne({'firstName' : req.body.firstName, 'lastName' : req.body.lastName});
            if (checkRsvp === null || checkRsvp === undefined) {
                console.log(req.body);
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

    async getAll(req, res, next) {
        try {
            const rsvps = await Rsvp.find();
            if (rsvps === null || rsvps === undefined) {
                res.status(403).json({'Error' : 'Unable to get rsvps'});
            } else {
                res.status(200).json(rsvps);
            }
        } catch(err) {
            next(err);
        }
    }

}

module.exports = RsvpController;