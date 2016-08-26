import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Instructor } from '../api/documents.js';
import './document.js'
import { Editor } from './editor.js'
import './themes.js'
import './instructor.html';

Template.instructor.onCreated(function bodyOnCreated() {
});

Template.instructor.helpers({
  instructor() {
    return Instructor.find({}).fetch();
    },
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

  this.autorun(() => {
    var subscriptions = Meteor.subscribe('instructor');
    const isReady = subscriptions.ready();
    var docs = Instructor.find({});
    if (isReady && docs) {
      var lines = Editor.readLines(docs);
      this.editor.setValue(lines);
      $('#valores').html("index.html");
      var projectName = docs.fetch()[0].folder;
      $("#projectName").text(projectName);

      var optionMyView = $("#optionMyView");
      var myId = window.location.search.substr(1).split("=")[1];
      var urlMyView = optionMyView.attr("href") + "/" + myId;
      $("#optionMyView").attr("href", urlMyView);
    }
  });
});