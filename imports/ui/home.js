import { Template } from 'meteor/templating';
import { Projects } from '../api/documents.js';
import './home.html';

Template.home.onCreated(function bodyOnCreated() {
});

Template.home.helpers({
  projects() {
    return Projects.find({}).fetch();
  }
});

Template.home.onRendered( function() {
  this.autorun(() => {
    var subscriptions = Meteor.subscribe('projects');
    const isReady = subscriptions.ready();
    var docs = Projects.find({});
    if (isReady && docs) {
      // data has arrived
    }
  });
});