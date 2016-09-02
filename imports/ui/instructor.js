import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Projects } from '../api/documents.js';
import { Editor } from './editor.js'
import './themes.js'
import './instructor.html';

Template.instructor.onCreated(function () {
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
    var fileIndex = $(event.target).attr("data-recordId");
    $("#editorcode").attr("data-currentFile", fileIndex);
    var filename = event.target.innerText;
    $("#valores").html(filename);
    Editor.find(filename);
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

  var projectName = window.location.pathname.split("/")[2];
  this.autorun(() => {
    var subscriptions = Meteor.subscribe('instructorProject', projectName);
    const isReady = subscriptions.ready();
    var docs = Projects.find({folder: projectName});
    if (isReady && docs) {
      if (docs.fetch().length > 0) {
        if (docs.fetch()[0].files) {
          var fileIndex = $("#editorcode").attr("data-currentFile") || 0;
          var lines = Editor.readLines(docs, fileIndex);
          if (lines) {
            var file = docs.fetch()[0].files[fileIndex];
            this.editor.setValue(lines);
            this.editor.setOption("mode","text/" + file.extension);
            $("#valores").html(file.name + "." + file.extension);
          }
        }

        $("#projectName").text(docs.fetch()[0].folder);
        $("#projectName").attr("data-projectId", docs.fetch()[0]._id);
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