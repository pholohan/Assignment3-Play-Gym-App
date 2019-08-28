'use strict';

const logger = require('../utils/logger');
const memberStore = require('../models/member-store.js');
const uuid = require('uuid');


const member = {
  index(request, response) {
  const memberId = request.params.id;
  const assessmentId = request.params.assessmentid;
  logger.info('Member Id = ' +memberId);
    const viewData = {
      title: 'Member',
      member: memberStore.getMember(memberId),
      bmi: memberStore.calcBMI(memberId),
      bmiCat: memberStore.determineBMICategory(memberId),
      idealBodyWeight: memberStore.isIdealBodyWeight(memberId),
    };
    response.render('member', viewData);
  },
  
  deleteAssessment(request, response){
    const memberId = request.params.id;
    const assessmentId = request.params.assessmentid;
    logger.debug('Deleting Assessment ${assessmentId} from Member ${memberId}');
    memberStore.removeAssessment(memberId, assessmentId);
    response.redirect("/member/"+memberId);
  },
  
  addAssessment(request, response) {
    const memberId = request.params.id;
    const member = memberStore.getMember(memberId);
    const newAssessment = {
      id: uuid(),
      weight: request.body.weight,
      chest: request.body.chest,
      thigh: request.body.thigh,
      upperarm: request.body.upperarm,
      waist: request.body.waist,
      hips: request.body.hips
    };
    memberStore.addAssessment(memberId, newAssessment);
    response.redirect('/member/' + memberId);
  },
  
};

module.exports = member;