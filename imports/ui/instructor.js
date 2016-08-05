import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Instructor } from '../api/documents.js';
import './document.js'
import './instructor.html';


Template.instructor.onCreated(function bodyOnCreated() {
});

Template.instructor.helpers({
  instructor() {
    return Instructor.find({}).fetch();
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
    var name= docs.files[i].name;
    var extension= docs.files[i].extension;
    var nameExtencion = name+"."+extension;
    if (filename==nameExtencion) {
     var lines = docs.files[i].lines;
       for (var i=0; i<lines.length; i++) {
        result = result+lines[i].text+"\n";
      }

    }
  }


   if(extension=="css"){
           var editor = $('.CodeMirror')[0].CodeMirror;
           editor.setOption("mode","text/css");    
        }else{
          if(extension=="js"){
           var editor = $('.CodeMirror')[0].CodeMirror;
           editor.setOption("mode","text/javascript");  
        }else{
          if(extension=="php"){
           var editor = $('.CodeMirror')[0].CodeMirror;
           editor.setOption("mode","text/x-php");  
        }else{
          if(extension=="html"){
           var editor = $('.CodeMirror')[0].CodeMirror;
           editor.setOption("mode","text/html");  
            }
        }
     }
  }
  return result;
}

   Template.instructor.events({
    'click .records' (event){
    var filename= event.target.innerText;
        var tu=document.getElementById('valores').innerHTML =" "+filename;
    Meteor.call('instructor.find',(err, res) => {
    if (err) {
      alert(err);
    } else {
        var text = searchs(res, filename);
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
      var lines = readLines(docs);
      this.editor.setValue(lines);
     }
  });
});

