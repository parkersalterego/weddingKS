const express = require('express');
const router = require('express').Router();

const UserController = require('./user.controller');
const GuestController = require('./guest.controller');
const HelpController = require('./help.controller');
const RsvpController = require('./rsvp.controller');

const userController = new UserController(router);
const guestController = new GuestController(router);
const helpController = new HelpController(router);
const rsvpController = new RsvpController(router);

module.exports = router;