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
  'click #btnNew' (event) {
    var projectName = prompt("Nombre del nuevo proyecto:");
    if (projectName) Projects.insert({folder: projectName, files: [] });
  },
  'click .action-icon' (event) {
    var action = $(event.target).attr("data-action");
    var projectId = $(event.target).parent().find("[data-projectId]").attr("data-projectId");
    if (action == "edit") {
      var newName = prompt("Nuevo nombre del proyecto:");
      if (newName) Projects.update(projectId, {$set: {folder: newName}});
    } else if (action == 'remove') {
      var remove = confirm("¿deseas eliminar el proyecto?");
      if (remove) Projects.remove(projectId);
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