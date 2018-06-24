const express = require('express');
const Nexmo = require('nexmo');
const User = require('../models/user.model');

const text = 'y';

const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_KEY,
    apiSecret: process.env.NEXMO_SECRET
}, {debug: true});

class MobileController {
    constructor(router) {
        // router.route('/mobile/sendSms')
        //     .post(this.sendSms);
        // router.route('/mobile/incomingSms')
        //     .post(this.incomingSms);
        router.route('/mobile/test/incomingSms')
            .post(this.incomingSmsTest);
    }

    async incomingSmsTest(req, res, next) {
        try {
            const commandObj = {
                command: {
                    command: 'schedule',
                    event: 'meeting'
                },
                contacts: [
                    {
                        username: 'kevin',
                        'is_contact' : false
                    },
                    {
                        username: 'thomas',
                        'is_contact' : false
                    },
                    {
                        username: 'guy',
                        'is_contact' : false
                    }
                ],
                date: '',
                startTime: '',
                endTime: ''
            }

            const user = await User.findOne({'phone' : req.body.from, 'is_deleted' : false});
            // check that the user exists
            if(user) {
                // check for ongoing command 
                if(user.currentRequest !== undefined) {
                    await MobileController.evalCommand(user, req.body.text);
                    res.status(200).json({'user' : user, 'step' : user.currentRequest.step});
                } else {
                    // set a currentRequest 
                    const currentRequest = {
                        commandObj: commandObj,
                        step: 0,
                        contactRequestsToSend : [],
                        invalidContacts: []
                    };
                    const updatedUser = await User.findOneAndUpdate({'_id' : user._id, 'is_deleted' : false}, {'currentRequest' : currentRequest}, {'new' : true});
                    await MobileController.evalCommand(updatedUser);
                    res.status(200).json({'user' : user, 'step' : user.currentRequest.step});
                }
            } else {
                // @TODO -- create response function that will handle all sending
                // MobileController.response()
            }
        } catch(err) {
            next(err);
        }
    }

    // UTILITY FUNCTIONS
    static async evalCommand(user, text) {
        if(user.currentRequest.commandObj.command.command === 'schedule') {
            switch(user.currentRequest.step) {
                case 0:
                    MobileController.evalContacts(user);
                    break;
                case 1:
                    MobileController.addContacts(user, text);
                    break;
            }
        }
    }

    static async evalContacts(user) {
        // check that contacts on currentRequest exist
        for (let i = 0; i < user.currentRequest.commandObj.contacts.length; i++) {
            const checkUser = await User.findOne({'username' : user.currentRequest.commandObj.contacts[i].username, 'is_deleted' : false});
            if (checkUser === null) {
                // notify user that contact does not exist
                user.currentRequest.invalidContacts.push(user.currentRequest.commandObj.contacts[i].username);
                user.currentRequest.commandObj.contacts.splice(i, 1);
            }
        }
        // check for contacts on currentRequest that are not contacts of the user
        user.currentRequest.commandObj.contacts.map(c => {
            user.contacts.forEach((contact) => {
                c.username === contact.username ? c.is_contact = true : c.is_contact = false;
            });
            // if not a contact of the user add to contactRequestsToSend array on currentRequestObj
            if(!c.is_contact) {
                // console.log(user.currentRequest.contactRequestsToSend);
                user.currentRequest.contactRequestsToSend.push(c.username);
            }
        });
        // @TODO -- send sms informing user of any mismatches and prompt to add from contactRequestsToSend
        user.currentRequest.step = 1;
        await User.findOneAndUpdate({'_id' : user._id, 'is_deleted' : false}, {'currentRequest' : user.currentRequest}, {'new' : true});
    }

    static async addContacts(user, text) {
        // check for yes or no response
        if(MobileController.evalResponse(text, 'addContacts')) {
            // user confirms to add contacts -- contact and user get a request object added
            for (let i = 0; i < user.currentRequest.contactRequestsToSend.length; i++) {
                const contact = await User.findOne({'username' : user.currentRequest.contactRequestsToSend[i], 'is_deleted' : false});
                const contactRequest = {
                    from: {
                        username: user.username,
                        organization: user.organization
                    },
                    to: {
                        username: contact.username,
                        organization: contact.organization
                    }
                };
                user.contactRequests.push(contactRequest);
                await User.findOneAndUpdate({'username' : user.currentRequest.contactRequestsToSend[i]}, {$push: {'contactRequests' : contactRequest}}, {'new' : true});
            }
            // set user contact requests to blank, increment currentRequest step, and update user
            user.contactRequestsToSend = [];
            user.currentRequest.step = 2;
            await User.update({'_id' : user._id}, user);
            MobileController.evalCommand(user, `Contact request/s sent`);
        } else {
            MobileController.evalCommand(user, '');
        }
    }

    static async evalResponse(text, func) {
        return true;
    }

}

module.exports = MobileController;