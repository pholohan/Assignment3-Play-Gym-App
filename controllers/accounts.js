'use strict';

const traineruserstore = require('../models/traineruser-store');
const memberstore = require('../models/member-store');
const logger = require('../utils/logger');
const uuid = require('uuid');



const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('member', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    const member = {
      id: uuid(),
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      address: request.body.address,
      gender: request.body.gender,
      height: request.body.height,
      startingweight: request.body.startingweight,
      assessment: [],
    };
    memberstore.addMember(member);
    logger.info(`registering ${member.email}`);
    response.redirect('/');
  },

  authenticate(request, response) {
    const member = memberstore.getUserByEmail(request.body.email);
    if (member) {
          const memberpassword = memberstore.checkPassword(member, request.body.password);
          logger.info(`Password ${memberpassword}`);
          if(memberpassword){
              response.cookie('member', member.email);
              logger.info(`logging in $member.email}`);
              response.redirect('/dashboard');}
              else{
            response.redirect('/login');
        }
    } 
    else {
          const trainer = traineruserstore.getUserByEmail(request.body.email);
          if (trainer) {
           const trainerpassword = traineruserstore.checkPassword(trainer, request.body.password);
              if(trainerpassword){
                  response.cookie('trainer', trainer.email);
                  logger.info(`logging in $trainer.email}`);
                  response.redirect('/trainerdashboard');}
         else{
            response.redirect('/login');
        }
      }
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.member;
    return memberstore.getUserByEmail(userEmail);
  },
  
  settings(request, response){
    const userEmail = request.cookies.member;
    const member = memberstore.getUserByEmail(userEmail);
    logger.info(`Current User is ${member.email}`);
    response.render('settings', member);
  },
  
  updateSettings(request,response){
    const userEmail = request.cookies.member;
    const currentmember = memberstore.getUserByEmail(userEmail);
    logger.info(`Updating User ${currentmember.email}`);
    currentmember.name = request.body.name,
    currentmember.email = request.body.email,
    currentmember.password = request.body.password,
    currentmember.address = request.body.address,
    currentmember.gender = request.body.gender,
    currentmember.height = request.body.height,
    currentmember.startingweight = request.body.startingweight
    memberstore.saveMember(currentmember);
    response.redirect('/settings');
  },
};

module.exports = accounts;