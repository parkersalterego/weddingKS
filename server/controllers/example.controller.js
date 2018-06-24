const express = require('express');
const Example = require('../models/example.model');

class ExampleController {
    constructor(router) {
        router.route('/example')
        .post(this.savePdf);
    }

    async savePdf(req, res, next) {
        try {
            let pdf = req.body;
            const base64 = new Buffer(pdf, 'base64');
            res.json(tokenBase64);
            // const tokenData = JSON.parse(tokenBase64.toString('ascii'));
            // const newPdf = await Example.create(new Example(tokenData));
            // // res.status(200).json(newPdf);
            // if(!newPdf) {
            //     res.status(404).json('Suitable pdf link not found');
            // } else {
            //     res.status(200).json(newPdf);
            // }
        } catch(err) {
            next(err);
        }
    }

}

module.exports = ExampleController;