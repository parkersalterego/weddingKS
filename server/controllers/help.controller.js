const express = require('express');
const Help = require('../models/help.model');

class HelpController {
    constructor(router) {
        router.route('/help')
            .post(this.submitHelpForm);
    }


    async submitHelpForm(req, res, next) {
        try{
            const helpForm = await Help.create(req.body);
            res.status(200).json(helpForm);
        } catch(err) {
            next(err);
        }
    }

}

module.exports = HelpController;