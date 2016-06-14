import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Documentos } from '../api/documentos.js';
import './documento.js'
import './body.html';

Template.editor.onCreated(function bodyOnCreated() {
});

Template.editor.helpers({
  documentos() {
    return Documentos.find({}).fetch();
    },
});

// ver la forma de que los datos que llegan en coSolA los tome y los guade en una variable y que esa varieble tome  los demas que lleguen y porner  el resutdo en la 
//varieble resultado
//esa variueble resulado es la que muestra el texto en el text area


var leerLineas = function (docs){
  var lineas = docs.fetch()[0].files[0].lines;
  var resultado="";
  for (var i=0; i<lineas.length; i++) {
   resultado = resultado+lineas[i].text+"\n";
  }
  return resultado;
}
  

//buscar la manera de hacer la busqueda en mongo y filtrarla 
//sino hacer la busqueda y desues el filtrado 

  Template.editor.events({
  'click .archivo' (event){
     var lineas = Documentos.find({name:"index",extension:"html"});
//db.bios.find( { files}, { name: 1 , lines:1} )      
     console.log(lineas)
  }


 });

Template.editor.onRendered( function() {
  this.editor = CodeMirror.fromTextArea( this.find( "#editorcode" ), {
    lineNumbers: true,
    fixedGutter: true,
    theme:"monokai",
    mode:"text/html",
    lineWrapping: true,
    cursorHeight: 0.85
  });

  this.autorun(() => {
     var subscriptions = Meteor.subscribe('documentos');
     const isReady = subscriptions.ready();
     var docs = Documentos.find({});
     if (isReady && docs) {
      var lineas = leerLineas(docs);

      this.editor.setValue(lineas);
     }
  });
});

 
/*Template.registerHelper('prueba',function () {
    return Documentos.find({});
  });*/
/*Template.registerHelper( 'allCaps', ( string ) => {
  return Documentos.find({});
});*/
