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

var readLines = function (docs, extension){
  var lines = docs.fetch()[0].files[0].lines;
  var result="";
  for (var i=0; i<lines.length; i++) {
    if (result) result += "\n";
    result = result+lines[i].text;
  }
  document.getElementById("preview").innerHTML=result;
  return result;
}

var readLinesCSS = function (docs){
  var lines = docs.fetch()[0].files[1].lines;
  var result="";
  for (var i=0; i<lines.length; i++) {
    if (result) result += "\n";
    result = result+lines[i].text;
  }
  var css = document.createElement("style");
  css.innerHTML = result;
  document.head.appendChild(css);
  return result;
}

var readLinesJS = function (docs){
  var lines = docs.fetch()[0].files[2].lines;
  var result = "";
  for (var i=0; i<lines.length; i++) {
    if (result) result += "\n";
    result = result+lines[i].text;
  }
  var js = document.createElement("script");
  js.innerHTML = result;
  document.head.appendChild(js);
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
      readLinesCSS(docs);
      readLinesJS(docs);
     }
  });
});

