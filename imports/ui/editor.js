import { Projects } from '../api/documents.js';

export const Editor = {
  readLines: (docs) => {
    var files = docs.fetch()[0].files;
    var result = "";
    var lines;
    if (files.length > 0) {
      lines = files[0].lines;
      for (var i = 0; i < lines.length; i++) {
        if (result) result += "\n";
        result = result+lines[i].text;
      }
    }
    
    return result;
  },
  search: (docs, filename) => {
    var files  = docs.files;
    var result = "";
    var nameExtension, lines;
    for (var i = 0; i < files.length; i++) {
      nameExtension = files[i].name + "." + files[i].extension;
      if (filename == nameExtension) {
        lines = files[i].lines;
        for (var j = 0; j < lines.length; j++) {
          if (result) result += "\n";
          result = result + lines[j].text;
        }
        break;
      }
    }

    nameExtension = filename.split(".")[1];
    var editor = $('.CodeMirror')[0].CodeMirror;
    if (nameExtension == "html") {
       editor.setOption("mode","text/html");
    } else if(nameExtension == "css") {
       editor.setOption("mode","text/css");    
    } else if(nameExtension == "js") {
       editor.setOption("mode","text/javascript");  
    } else if(nameExtension == "php") {
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

      Projects.update(projectId, setModifier);
      Editor.notification("Proyecto ha sido guardado...");
    }

    var menu = $(".collapse");
    if (menu.hasClass('in')) menu.collapse('toggle');
  },
  notification: (message) => {
    $("#notification").text(message).fadeIn().delay(2000).fadeOut();
  },
  isMobile: () => {
    return window.innerWidth < 768;
  },
  find: (serverFind, filename) => {
    var projectId = $(".save").attr("data-projectId") || $("#projectName").attr("data-projectId");
    var doc = Projects.find({_id: projectId}).fetch()[0];
    var text = Editor.search(doc, filename);
    var editor = $('.CodeMirror')[0].CodeMirror;
    editor.setValue(text);

    if (Editor.isMobile()) $('#wrapper').toggleClass('toggled');
    
    var menu = $(".collapse");
    if (menu.hasClass('in')) menu.collapse('toggle');
  },
  create: (filename) => {
    var filePart = filename.split(".");
    if (filePart[0] && filePart[1]) {
      var file = {
        name: filePart[0],
        extension: filePart[1],
        lines: []
      };
      var projectId = $(".save").attr("data-projectId");
      Projects.update(projectId, {$push: {files: file}});

      var menu = $(".collapse");
      if (menu.hasClass('in')) menu.collapse('toggle');
      Editor.notification("Archivo creado: " + filename);
    } else {
      alert("El nombre de archivo es incorrecto.");
    }
  },
  remove: (filename) => {
    var filePart = filename.split(".");
    if (filePart[0] && filePart[1]) {
      var file = {
        name: filePart[0],
        extension: filePart[1]
      }
      var projectId = $(".save").attr("data-projectId");
      Projects.update(projectId, {$pull: {files: file}});
      Editor.notification("Archivo '" + filename + "', ha sido eliminado.");
    }
  },
  updateFileName: (index, newName) => {
    var filePart = newName.split(".");
    if (filePart[0] && filePart[1]) {
      var setModifier = { $set: {} };
      setModifier.$set['files.'+index+'.name'] = filePart[0];
      setModifier.$set['files.'+index+'.extension'] = filePart[1];
      
      var projectId = $(".save").attr("data-projectId");
      Projects.update(projectId, setModifier);
      Editor.notification("Nombre de archivo guardado: " + newName);
    } else {
      alert("El nombre de archivo es incorrecto.");
    }
  }
};