import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Projects } from '../api/documents.js';
import './document.js'
import { Editor } from './editor.js'
import './themes.js'
import './body.html';

Template.editor.onCreated(function () {
  this.autoSave = null;
  this.editorCursor = { line: 0, ch: 0 }
});

Template.editor.helpers({
  projects() {
    return Projects.find({});
  }
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
    var fileIndex = $(event.target).attr("data-recordId");
    $("#editorcode").attr("data-currentFile", fileIndex);
    var filename = event.target.innerText;
    $("#valores").html(filename);
    Editor.find(filename);
  },
  'click .action-icon' (event) {
    var action = $(event.target).attr("data-action");
    var record = $(event.target).parent().parent().find("[data-recordId]");
    var filename = record.text().trim();
    if (action == "edit") {
      var index   = $(record[0]).attr("data-recordId");
      var newName = prompt("Nuevo nombre del archivo:", filename);
      if (newName) Editor.updateFileName(index, newName);
    } else if (action == 'remove') {
      var remove = confirm("¿Eliminar el archivo: " + filename + "?");
      if (remove) Editor.remove(filename);
    }
  },
  'keydown .content' (event, instance) {
    if (Meteor.user().username == "instructor") {
      if (instance.autoSave) {
        Meteor.clearTimeout(instance.autoSave);
        instance.autoSave = null;
      }
      instance.autoSave = Meteor.setTimeout(() => {
        Editor.save();
        instance.editorCursor = instance.editor.getCursor("to");
      }, 1500);
    }
  }
});

Template.editor.onRendered( function() {
  this.editor = CodeMirror.fromTextArea( this.find( "#editorcode" ), {
    cursorHeight: 0.90,
    fixedGutter: true,
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    mode:"text/html",
    selectionPointer: true,
    styleActiveLine: true,
    theme:"monokai"
  });

  var id = window.location.pathname.split("/")[2];
  this.autorun(() => {
    var subscriptions = this.subscribe('projectById', id);
    const isReady = subscriptions.ready();
    var docs = Projects.find({ _id: id });
    if (isReady && docs) {
      if (docs.fetch()[0].files) {
        var fileIndex = $("#editorcode").attr("data-currentFile") || 0;
        var lines = Editor.readLines(docs, fileIndex);
        if (lines) {
          var file = docs.fetch()[0].files[fileIndex];
          this.editor.setValue(lines);
          this.editor.setOption("mode","text/" + file.extension);
          this.editor.setCursor(this.editorCursor.line, this.editorCursor.ch);
          $("#valores").html(file.name + "." + file.extension);
          $("#editorcode").attr("data-currentFile", fileIndex);
        }
      }

      $(".save").attr("data-projectId",docs.fetch()[0]._id);
      var projectName = docs.fetch()[0].folder;
      $("#projectName").text(projectName);
      var urlInstructor = window.location.origin + "/instructor/" + projectName + "?myView=" + id;
      $("#optionInstructor").attr("href", urlInstructor);
      var urlPreview = window.location.origin + "/preview/" + id;
      $("#optionPreview").attr("href", urlPreview);
    }
  });
});