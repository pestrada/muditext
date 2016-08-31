import { Template } from 'meteor/templating';
import { Projects } from '../api/documents.js';
import './home.html';

Template.home.onCreated(function bodyOnCreated() {
  Meteor.subscribe('projects');
});

Template.home.helpers({
  projects() {
    return Projects.find({});
  }
});

Template.home.events({
  'click #btnNew' (event) {
    var projectName = prompt("Nombre del nuevo proyecto:");
    if (projectName) {
      Projects.insert({
        folder: projectName,
        owner: Meteor.user().username == "instructor" ? "instructor" : "student",
        userId: Meteor.userId(),
        files: []
      });
    }
  },
  'click .project-name' (event) {
    var projectId = $(event.target).attr("data-projectId");
    window.open(window.location.origin + "/editor/" + projectId);
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