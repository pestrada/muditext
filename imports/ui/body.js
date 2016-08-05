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

  Template.editor.events({
    'click .view' (event){
      var url ='http://localhost:3000/previewview';
      window.open(url, '_blank');
     }
  });



  Template.editor.events({
    'click #menuToggler' (event){
  $('#wrapper').toggleClass('toggled');
     }
  });

var readLines = function (docs){
  var num = 0;
  var lines = docs.fetch()[0].files[num].lines;
  var result="";
  var editor = $('.CodeMirror')[0].CodeMirror;
  editor.setOption("mode","text/html"); 
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
       for (var j=0; j<lines.length; j++) {
        result = result+lines[j].text+"\n";
      }

    }
  }

     var extension=filename.split(".")[1];

        if(extension=="html"){
           var editor = $('.CodeMirror')[0].CodeMirror;
           editor.setOption("mode","text/html");    
        }else if(extension=="css"){
           var editor = $('.CodeMirror')[0].CodeMirror;
           editor.setOption("mode","text/css");    
        }else if(extension=="js"){
           var editor = $('.CodeMirror')[0].CodeMirror;
           editor.setOption("mode","text/javascript");  
        }else if(extension=="php"){
           var editor = $('.CodeMirror')[0].CodeMirror;
           editor.setOption("mode","text/x-php"); 
        }
  return result;

}
var save = function (){
      var editor = $('.CodeMirror')[0].CodeMirror;
      var data = editor.getValue("\n"); 
      var arrayData= data.split("\n");
      var projectId = $(".save").attr("data-projectId"); 
      var arrayMongo =[];

  for (var i=0; i<arrayData.length; i++) {
    result = { 
      text: arrayData[i]
    };
    arrayMongo[i] = result;
 }


var index= $("#editorcode").attr("data-currentFile");
if (index ==""){
  alert("Seleccione un archivo");
}else{


var setModifier = { $set: {} };
setModifier.$set['files.'+index+'.lines'] = arrayMongo;

Projects.update(new Mongo.ObjectID(projectId),
  setModifier);
  alert("\"Guardado\"");
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
    var text = searchs(res, filename);
    var editor = $('.CodeMirror')[0].CodeMirror;
        editor.setValue(text);   
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
    // var lines = readLines(docs)

      $(".save").attr("data-projectId",docs.fetch()[0]._id);
     }
  });
});