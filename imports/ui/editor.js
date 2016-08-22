export const Editor = {
  readLines: (docs) => {
    var lines = docs.fetch()[0].files[0].lines;
    var result="";
    for (var i=0; i<lines.length; i++) {
     result = result+lines[i].text+"\n";
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
  }
};