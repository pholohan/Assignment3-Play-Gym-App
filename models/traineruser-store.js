'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const trainerUserStore = {

  store: new JsonStore('./models/traineruser-store.json', { trainerusers: [] }),
  collection: 'trainerusers',

  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  addUser(traineruser) {
    this.store.add(this.collection, traineruser);
    this.store.save();
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },
  
  checkPassword(trainer, password){
    const trainercheck = trainer;
    if(trainercheck.password === password)
      return true;
    else
      return false;
  }
  
};

module.exports = trainerUserStore;