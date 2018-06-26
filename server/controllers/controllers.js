const express = require('express');
const router = require('express').Router();

const UserController = require('./user.controller');
const GuestController = require('./guest.controller');

const userController = new UserController(router);
const guestController = new GuestController(router);

module.exports = router;