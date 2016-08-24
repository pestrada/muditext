import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Projects } from '../api/documents.js';
import './document.js'
import { Editor } from './editor.js'
import './body.html';


Template.editor.onCreated(function bodyOnCreated() {
});

Template.editor.helpers({
  projects() {
    return Projects.find({}).fetch();
  },
});

Template.editor.events({
  'click #optionNew' (event) {
    var filename = prompt("Nombre del archivo", "");
    if (filename) Editor.create(filename);
  },
  'click #optionFiles' (event) {
    $('#wrapper').toggleClass('toggled');
    $('.collapse').toggleClass('in');
  },
  'click #menuToggler' (event){
    $('.collapse').collapse('toggle');
  },
  'click .save' (event){
    Editor.save();
  },
  'click .records' (event){
    var numberIndex = $(event.target).attr("data-recordId");
    var currentFile= $("#editorcode").attr("data-currentFile",numberIndex);
    var filename= event.target.innerText;
    document.getElementById('valores').innerHTML =""+filename;
    Editor.find('project.find', filename);
  },
  'click .action-icon' (event) {
    var action = $(event.target).attr("data-action");
    if (action == "edit") {

    } else if (action == 'remove') {
      var remove = confirm("¿deseas eliminar el archivo?");
      var filename = $(event.target).parent().parent()
                      .children("[data-recordId]").text().trim();
      if (remove) Editor.remove(filename);
    }
  }
});

Template.editor.onRendered( function() {
  this.editor = CodeMirror.fromTextArea( this.find( "#editorcode" ), {
    lineNumbers: true,
    fixedGutter: true,
    theme:"monokai",
    mode:"text/html",
    lineWrapping: true,
    cursorHeight: 0.90
  });

  this.autorun(() => {
     var subscriptions = Meteor.subscribe('projects');
     const isReady = subscriptions.ready();
     var docs = Projects.find({});
     if (isReady && docs) {
      var lines = Editor.readLines(docs);
      this.editor.setValue(lines);
      $(".save").attr("data-projectId",docs.fetch()[0]._id);
      $("#projectName").text(docs.fetch()[0].folder);
      $("#editorcode").attr("data-currentFile", 0);
      document.getElementById('valores').innerHTML ="index.html";
     }
  });
});