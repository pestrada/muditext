import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Projects } from '../api/documents.js';
import './document.js'
import './body.html';

Template.editor.onCreated(function bodyOnCreated() {
});

Template.editor.helpers({
  projects() {
    return Projects.find({}).fetch();
    },

});


var readLines = function (docs){
  var lines = docs.fetch()[0].files[0].lines;
  var result="";
  for (var i=0; i<lines.length; i++) {
   result = result+lines[i].text+"\n";
  }
  return result;
}

    
var searchs = function (docs,filename){
  var files = docs.files;
  var result="";
  for (var i=0; i<files.length; i++) {  
if (filename==files[i]) {
  //files.name+"."+extension;
    result = result+lines[i].text+"\n";
}

  }
  return result;
}
  

  Template.editor.events({
  'click .records' (event){
    /* var docs = Projects.find({
      "folder":"projectname"
    }); */ 
  var filename= event.target.innerText;
  Meteor.call('project.find',(err, res) => {
    if (err) {
      alert(err);
    } else {
      console.log(res);
     var text = searchs(res, filename);
      var editor = $('.CodeMirror')[0].CodeMirror;
      editor.setValue(text);   
    }
  });
  /*var proof = searchs(docs);
     var editor = $('.CodeMirror')[0].CodeMirror;
      editor.setValue("");   */
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
      var lines = readLines(docs);
      this.editor.setValue(lines);
     }
  });
});


 