const express = require('express');
const Guest = require('../models/guest.model');

class GuestController {
    constructor(router) {
        router.route('/guests')
            .get(this.getAllGuests);
        router.route('/guests/add')
            .post(this.addGuest);
        router.route('/guests/update')
            .post(this.updateGuest);
        router.route('/guests/:_id')
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
            const softDeletedGuest = await Guest.findOneAndUpdate({'_id' : req.params._id, 'is_deleted' : false}, {'is_deleted' : true}, {'new' : true});
            res.status(200).json(softDeletedGuest);
        } catch(err) {
            next(err);
        }
    }

    async updateGuest(req, res, next) {
        try {
            const guest = await Guest.findOneAndUpdate({'_id' : req.body._id, 'is_deleted' : false}, req.body, {'new' : true});
            if (guest) {
                res.status(200).json(guest);
            }else {
                res.status(403).json({'Error' : 'Unable to update guest'});
            }
        } catch(err) {
            next(err);
        }
    }

}

module.exports = GuestController;
