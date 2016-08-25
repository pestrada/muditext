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

Template.home.events({
  'click .action-icon' (event) {
    var action = $(event.target).attr("data-action");
    var projectId = $(event.target).parent().find("[data-projectId]").attr("data-projectId");
    if (action == "edit") {
      var newName = prompt("Nuevo nombre del proyecto:");
      if (newName) {
        Projects.update(new Mongo.ObjectID(projectId), {$set: {folder: newName}});
      }
    } else if (action == 'remove') {
      var remove = confirm("¿deseas eliminar el proyecto?");
      var id = $(event.target).parent().find("[data-projectId]").attr("data-projectId");
      // remove by Id
    }
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