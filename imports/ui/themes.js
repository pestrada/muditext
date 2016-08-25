import { Template } from 'meteor/templating';
import './themes.html';

Template.themes.events({
  'change #selectTheme' () {
    var input = document.getElementById("selectTheme");
    var theme = input.options[input.selectedIndex].innerHTML;
    var editor = $('.CodeMirror')[0].CodeMirror;
    editor.setOption('theme', theme);
  }
});