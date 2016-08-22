import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Instructor } from '../api/documents.js';
import './document.js'
import { Editor } from './editor.js'
import './instructor.html';

Template.instructor.onCreated(function bodyOnCreated() {
});

Template.instructor.helpers({
  instructor() {
    return Instructor.find({}).fetch();
    },
});

Template.instructor.events({
  'click .records' (event){
    var filename= event.target.innerText;
    document.getElementById('valores').innerHTML =" "+filename;
    Meteor.call('instructor.find',(err, res) => {
      if (err) {
        alert(err);
      } else {
        var text = Editor.search(res, filename);
        var editor = $('.CodeMirror')[0].CodeMirror;
        editor.setValue(text);   
      }
    });
  }
});

Template.instructor.events({
  'click #menuToggler' (event){
    $('#wrapper').toggleClass('toggled');
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
     }
  });
});