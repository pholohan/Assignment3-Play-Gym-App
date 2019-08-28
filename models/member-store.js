'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');
const logger = require("../utils/logger");

const memberStore = {

  store: new JsonStore('./models/member-store.json', { memberCollection: [] }),
  collection: 'memberCollection',

  getAllMembers(){
    return this.store.findAll(this.collection);
  },
  
  getAllAssessments()
  {
    return this.store.findAll(this.collection, member.assessment)
  },
    
  getMember(id){
        return this.store.findOneBy(this.collection, { id: id });
  },
  
  getAssessment(id){
        return this.store.findOneBy(this.collection, { id: id });
  },
  
   removeAssessment(id, assessmentId){
    const member = this.getMember(id);
    const assessment = member.assessment;
    _.remove(assessment, { id: assessmentId});
    this.store.save();
  },
  
  removeMember(id) {
    const member = this.getMember(id);
    this.store.remove(this.collection, member);
    this.store.save();
  },
  
  addAssessment(id, assessment) {
    const member = this.getMember(id);
    member.assessment.push(assessment);
    this.store.save();
  },
  
  addMember(member) {
    this.store.add(this.collection, member);
    this.store.save();
  },
  
  saveMember(member){
    this.store.save(this.collection, member);
  },
  
  addComment(memberid, assessmentid, comment){
    const member = this.getMember(memberid);
    const assessment = _.find(member.assessment, { id: assessmentid});
    logger.info(`Adding Comment to ${assessment}`);
    assessment.comment = comment;
    this.store.save();
  },
  
  calcBMI(id){
    const member = this.getMember(id);
    const assessmentarray = member.assessment;
    const latestassessment = assessmentarray[assessmentarray.length-1];
    logger.info(`BMI Calculation is running`);
    if (member.height <= 0)
      return 0;
    else
      return (latestassessment.weight / (member.height * member.height)).toFixed(2);
  },
  
  determineBMICategory(id){
      const bmiValue = this.calcBMI(id);
      logger.info(`BMI CAT Calculation is running`);
      if (bmiValue >= 0 && bmiValue < 15)
        return "Very Severly Underweight";
      else if (bmiValue >= 15 && bmiValue < 16)
        return "Severly Underweight";
      else if (bmiValue >= 16 && bmiValue < 18.5)
        return "Underweight";
     else if (bmiValue >= 18.5 && bmiValue < 25)
        return "Normal";
     else if (bmiValue >= 25 && bmiValue < 30)
        return "Overweight";
     else if (bmiValue >= 30 && bmiValue < 35)
        return "Moderately Obese";
     else if (bmiValue >= 35 && bmiValue < 40)
        return "Severly Obese";
     else if (bmiValue >= 40 && bmiValue < 1000)
        return "Very Severly Obese";
  },
  
  isIdealBodyWeight(id){
    const member = this.getMember(id);
    const fiveFeet = 60.0;
    var idealBodyWeight;
    const inches = member.height * 39.37;
    logger.info(`Ideal BodyWeight is running`);
    if (inches <= fiveFeet)
      {
        if (member.gender === "male")
          {
            idealBodyWeight = 50;                 
          }
        else
          {
            idealBodyWeight = 45.5;
          }
      }
    else
      {
       if (member.gender === "male")
          {
            idealBodyWeight = 50 + ((inches - fiveFeet)*2.3);                 
          }
        else
          {
            idealBodyWeight = 45.5 ((inches - fiveFeet)*2.3);
          }
      }
    return ((idealBodyWeight <= (member.weight + 2.0))) && ((idealBodyWeight >= (member.weight - 2.0)))
   },

  
  
  getUserMembers(userid) {
    return this.store.findBy(this.collection, { userid: userid });
  },
  
  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },
  
  checkPassword(member, password){
    const membercheck = member;
    logger.info(`Checking password of ${membercheck}`);
    if(membercheck.password === password)
      return true;
    else
      return false;
  }
  
};

module.exports = memberStore;
           
             