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
  'click .view' (event){
    var url ='http://localhost:3000/previewview';
    window.open(url, '_blank');
   }
});

Template.editor.events({
  'click #menuToggler' (event){
    $('.collapse').collapse('toggle');
    var wrapper = $('#wrapper');
    if (!wrapper.hasClass('toggled')) {
      wrapper.toggleClass('toggled');
    }
  }
});

var save = function (){
  var editor = $('.CodeMirror')[0].CodeMirror;
  var data = editor.getValue("\n"); 
  var arrayData= data.split("\n");
  var projectId = $(".save").attr("data-projectId"); 
  var arrayMongo =[];

  var result;
  for (var i=0; i<arrayData.length; i++) {
    result = { 
      text: arrayData[i]
    };
    arrayMongo[i] = result;
  }


  var index= $("#editorcode").attr("data-currentFile");
  if (index ==""){
    alert("Seleccione un archivo");
  } else {
    var setModifier = { $set: {} };
    setModifier.$set['files.'+index+'.lines'] = arrayMongo;

    Projects.update(new Mongo.ObjectID(projectId), setModifier);
    console.log("\"Guardado\"");
  }
}

Template.editor.events({
  'click .save' (event){
    save();
   }
});

Template.editor.events({
  'click .records' (event){
    var numberIndex = $(event.target).attr("data-recorId");
    var currentFile= $("#editorcode").attr("data-currentFile",numberIndex);
    var filename= event.target.innerText;
    var tu=document.getElementById('valores').innerHTML =" "+filename;
    Meteor.call('project.find',(err, res) => {
      if (err) {
        alert(err);
      } else {
        var text = Editor.search(res, filename);
        var editor = $('.CodeMirror')[0].CodeMirror;
        editor.setValue(text);
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
      $(".save").attr("data-projectId",docs.fetch()[0]._id);
     }
  });
});