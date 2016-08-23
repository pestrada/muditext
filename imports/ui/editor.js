import { Projects } from '../api/documents.js';

export const Editor = {
  readLines: (docs) => {
    var lines = docs.fetch()[0].files[0].lines;
    var result="";
    for (var i=0; i<lines.length; i++) {
      if (result) result += "\n";
      result = result+lines[i].text;
    }
    return result;
  },
  search: (docs, filename) => {
    var files = docs.files;
    var result = "";
    for (var i=0; i<files.length; i++) {  
      var name= docs.files[i].name;
      var extension= docs.files[i].extension;
      var nameExtencion = name+"."+extension;
      if (filename==nameExtencion) {
        var lines = docs.files[i].lines;
        for (var j=0; j<lines.length; j++) {
          if (result) result += "\n";
          result = result+lines[j].text;
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
  },
  save: () => {
    var editor = $('.CodeMirror')[0].CodeMirror;
    var data = editor.getValue("\n"); 
    var arrayData= data.split("\n");
    var projectId = $(".save").attr("data-projectId"); 
    var arrayMongo =[];

    for (var i=0; i<arrayData.length; i++) {
      arrayMongo[i] = { text: arrayData[i] };
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
  },
  isMobile: () => {
    return window.innerWidth < 768;
  },
  find: (serverFind, filename) => {
    Meteor.call(serverFind, (err, res) => {
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
};