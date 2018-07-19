const express = require('express');
const Help = require('../models/help.model');

class HelpController {
    constructor(router) {
        router.route('/help')
            .post(this.submitHelpForm)
            .get(this.getAll);
    }


    async submitHelpForm(req, res, next) {
        try{
            const helpForm = await Help.create(req.body);
            res.status(200).json(helpForm);
        } catch(err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        try {
            const helpReqs = await Help.find();

            if(helpReqs === null || helpReqs === undefined) {
                res.status(403).json({'Error' : 'Unable to retreive messages please contact an administrator'});
            } else {
                res.status(200).json(helpReqs);
            }
        } catch(err) {
            next(err);
        }
    }

}

module.exports = HelpController;