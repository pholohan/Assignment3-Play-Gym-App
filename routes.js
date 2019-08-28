"use strict";

const express = require("express");
const router = express.Router();

const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const member = require("./controllers/member.js")
const accounts = require('./controllers/accounts.js');
const trainerdashboard = require("./controllers/trainerdashboard.js");

// Home Page
router.get("/dashboard", dashboard.index);
router.post("/member/:id/addassessment", member.addAssessment);
router.get("/about", about.index);
router.get("/member/:id",member.index);
router.get("/member/:id/deleteassessment/:assessmentid", member.deleteAssessment);
//router.get("/dashboard/deletemember/:id", dashboard.deleteMember);

// Accounts
router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);
router.get('/settings', accounts.settings);
router.post('/settings',accounts.updateSettings);

// Trainer Page
router.get('/trainerdashboard', trainerdashboard.index);
router.get('/trainerassessment/:id', trainerdashboard.trainerAssessment);
router.post('/member/:id/editcomment/:assessmentid', trainerdashboard.editComment);
router.get('/trainerdashboard/deletemember/:id', trainerdashboard.deleteMember);
//router.post('/dashboard/addmember', dashboard.addMember);

module.exports = router;
