const express = require('express');
const Rsvp = require('../models/rsvp.model');
const User = require('../models/user.model');
const Guest = require('../models/guest.model');

class RsvpController {
    constructor(router) {
        router.route('/rsvp')
            .post(this.submitRsvp)
            .get(this.getAll)
            .put(this.editRsvp);
        router.route('/rsvp/check')
            .post(this.checkRsvp);
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
                res.status(500).json('Unable to send rsvp');
            }
        } catch(err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        try {
           const rsvps = await Rsvp.find();

           res.status(200).json(rsvps);
        } catch(err) {
            next(err);
        }
    }

    async checkRsvp(req, res, next) {
        try {
            const rsvp = await Rsvp.findOne({'firstName' : req.body.firstName, 'lastName' : req.body.lastName})
            if (!rsvp) {
                res.status(200).json(false);
            } else {
                const rsvp = await Rsvp.findOne({'firstName' : req.body.firstName, 'lastName' : req.body.lastName})
                res.status(200).json(rsvp);
            }
        } catch (err) {
            next(err);
        }

    }

    async editRsvp(req, res, next) {
        try {
            const rsvp = await Rsvp.update({'firstName' : req.body.firstName, 'lastName' : req.body.lastName}, req.body);
            const updatedRsvp = await Rsvp.findOne({'firstName' : req.body.firstName, 'lastName' : req.body.lastName})
            res.status(200).json(updatedRsvp);


        } catch(err) {
            next(err);
        }
    }

}

module.exports = RsvpController;