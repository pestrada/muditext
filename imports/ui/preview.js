import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Projects } from '../api/documents.js';
import './document.js'
import './preview.html';

Template.preview.onCreated(function bodyOnCreated() {
  var id = window.location.pathname.split("/")[2];
  this.autorun(() => {
    var subscriptions = Meteor.subscribe('projectById', id);
    const isReady = subscriptions.ready();
    var docs = Projects.find({ _id: id });
    if (isReady && docs) {
      buildPreview(docs);
    }
  });
});

Template.preview.helpers({
  preview() {
    return Projects.find({}).fetch();
  }
});

var readLines = function (lines) {
  var result = "";
  for (var i = 0; i < lines.length; i++) {
    if (result) result += "\n";
    result = result + lines[i].text;
  }
  return result;
};

var Injector = {
  html: (result) => {
    document.getElementById("preview").innerHTML = result;
  },
  css: (result) => {
    var css = document.createElement("style");
    css.innerHTML = result;
    document.head.appendChild(css);
  },
  js: (result) => {
    var js = document.createElement("script");
    js.innerHTML = result;
    document.head.appendChild(js);
  }
};

var buildPreview = function (docs){
  var files = docs.fetch()[0].files;
  var result = "";
  for (var i = 0; i < files.length; i++) {
    result = readLines(files[i].lines);
    Injector[files[i].extension](result);
  }
};