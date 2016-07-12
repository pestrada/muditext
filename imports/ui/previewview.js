import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Projects } from '../api/documents.js';
import './document.js'
import './previewview.html';

Template.previewview.onCreated(function bodyOnCreated() {
});


Template.previewview.helpers({
  previewview() {
    return Projects.find({}).fetch();
    },
});

  var readLines = function (docs){
  var lines = docs.fetch()[0].files[0].lines;
  var result="";
  for (var i=0; i<lines.length; i++) {
   result = result+lines[i].text+"\n";
  document.getElementById("prevew").innerHTML=result;
  }
  return result;
}



  //styleTag = $('<style></style>').appendTo(contents.find('head'));


 var readLinescss = function (docs){
  var lines = docs.fetch()[0].files[1].lines;
  var result="";
  for (var i=0; i<lines.length; i++) {
   result = result+lines[i].text+"\n";
   document.getElementById("prevew").attr=result;
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
  return result;
}



Template.previewview.onRendered( function() {
  this.autorun(() => {
     var subscriptions = Meteor.subscribe('projects');
     const isReady = subscriptions.ready();
     var docs = Projects.find({});
     if (isReady && docs) {
      var lines = readLines(docs);
     }
  });
});

