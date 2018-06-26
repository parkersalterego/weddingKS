const express = require('express');
const Guest = require('../models/guest.model');

class GuestController {
    constructor(router) {
        router.route('/guests')
            .get(this.getAllGuests);
        router.route('/guests/add')
            .post(this.addGuest);
        router.route('/guests/delete/:_id')
            .delete(this.softDeleteGuest);
    }

    async addGuest(req, res, next) {
        try {
            const newGuest = await Guest.create(req.body);
            if (newGuest) {
                res.status(200).json(newGuest);
            } else {
                res.status(403).json({'Error' : 'Unable to create guest'});
            }
            
        } catch (err) {
            next(err);
        }
    }

    async getAllGuests(req, res, next) {
        try {
            const guests = await Guest.find({'is_deleted' : false});
            if(guests) {
                res.status(200).json(guests);
            } else {
                res.status(403).json({'Error' : 'Unable to get guests'});
            }
        } catch(err) {
            next(err);
        }
    }

    async softDeleteGuest(req, res, next) {
        try {
            console.log(req.params._id);
            const softDelete = await Guest.findOneAndUpdate(req.params._id, {'is_deleted' : true}, {'new' : true});
            res.status(200).json(softDelete);
        } catch(err) {
            next(err);
        }
    }

}

module.exports = GuestController;
