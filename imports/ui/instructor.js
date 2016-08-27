import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Projects } from '../api/documents.js';
import { Editor } from './editor.js'
import './themes.js'
import './instructor.html';

Template.instructor.onCreated(function bodyOnCreated() {
  var projectName = window.location.pathname.split("/")[2];
  this.autorun(() => {
    var subscriptions = Meteor.subscribe('instructorProject', projectName);
    const isReady = subscriptions.ready();
    var docs = Projects.find({folder: projectName});
    if (isReady && docs) {
      if (docs.fetch().length > 0) {
        var lines = Editor.readLines(docs);
        if (lines) {
          this.editor.setValue(lines);
          $("#valores").html(docs.fetch()[0].name + docs.fetch()[0].extension);
          $("#projectName").text(docs.fetch()[0].folder);
          $("#projectName").attr("data-projectId",docs.fetch()[0]._id);
        }
      } else {
        $("#valores").html("Proyecto vacio.");
      }
      
      var optionMyView = $("#optionMyView");
      var myId = window.location.search.substr(1).split("=")[1];
      var urlMyView = window.location.origin + "/editor/" + myId;
      optionMyView.attr("href", urlMyView);
    }
  });
});

Template.instructor.helpers({
  projects() {
    return Projects.find({}).fetch();
  }
});

Template.instructor.events({
  'click #optionFiles' (event) {
    $('#wrapper').toggleClass('toggled');
    $('.collapse').toggleClass('in');
  },
  'click #menuToggler' (event){
    $('.collapse').collapse('toggle');
  },
  'click .records' (event){
    var filename= event.target.innerText;
    document.getElementById('valores').innerHTML =" "+filename;
    Editor.find('instructor.find', filename);
  }
});

Template.instructor.onRendered( function() {
  this.editor = CodeMirror.fromTextArea( this.find( "#editorcode" ), {
    readOnly: true,
    lineNumbers: true,
    fixedGutter: true,
    theme:"monokai",
    mode:"text/html",
    lineWrapping: true,
    cursorHeight: 0.90
  });
});