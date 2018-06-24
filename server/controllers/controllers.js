const express = require('express');
const router = require('express').Router();

const ExampleController = require('./example.controller.js');
const UserController = require('./user.controller');

const exampleController = new ExampleController(router);
const userController = new UserController(router);

module.exports = router;