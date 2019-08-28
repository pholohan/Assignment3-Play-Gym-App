"use strict";

const logger = require("../utils/logger");
const memberStore = require("../models/member-store.js");
const uuid = require('uuid');
const accounts = require('./accounts.js');

const trainerdashboard = {
  index(request, response) {
    logger.info("trainerdashboard rendering");
      const viewData = {
      title: "Trainer Dashboard",
      member: memberStore.getAllMembers(),
    };
    logger.info('about to render', memberStore.getAllMembers());
    response.render("trainerdashboard", viewData);
  },
  
  trainerAssessment(request, response){
    const memberId = request.params.id;
    const viewData = {
    title: "Trainer Assessment",
    member: memberStore.getMember(memberId),
    bmi: memberStore.calcBMI(memberId),
    bmi: memberStore.calcBMI(memberId),
    bmiCat: memberStore.determineBMICategory(memberId),
    idealBodyWeight: memberStore.isIdealBodyWeight(memberId),
    }
    response.render("trainerassessment", viewData);
  },
  
  deleteMember(request, response) {
    const memberId = request.params.id;
    logger.debug(`Deleting Member ${memberId}`);
    memberStore.removeMember(memberId);
    response.redirect('/trainerdashboard');
  },
  
        
  editComment(request, response) {
      const memberId = request.params.id;
      const assessmentId = request.params.assessmentid;
      const comment = request.body.comment;
      logger.info(`Adding Comment to ${assessmentId}`);
      memberStore.addComment(memberId, assessmentId, comment);
      response.redirect('/trainerdashboard');
    },
  

  addMember(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newMember = {
      id: uuid(),
      userid: loggedInUser.id,
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      address: request.body.address,
      gender: request.body.gender,
      height: request.body.height,
      startingweight: request.body.startingweight,
      assessment: []
    };
    memberStore.addMember(newMember);
    response.redirect('/trainerdashboard');
  },
};

module.exports = trainerdashboard;