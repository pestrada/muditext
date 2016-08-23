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
    Meteor.call('project.find',(err, res) => {
      if (err) {
        alert(err);
      } else {
        var text = Editor.search(res, filename);
        var editor = $('.CodeMirror')[0].CodeMirror;
        editor.setValue(text);

        if (Editor.isMobile()) {
          $('#wrapper').toggleClass('toggled');
        }

        var menu = $(".collapse");
        if (menu.hasClass('in')) {
          $(".collapse").collapse('toggle');
        }
      }
    });
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