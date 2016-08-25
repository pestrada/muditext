import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Projects } from '../api/documents.js';
import { Instructor } from '../api/documents.js';
import './document.html';

Router.route('/', function () {
  this.render('home');
});

Router.route('/home');

Router.route('/editor');

Router.route('/instructor');

Router.route('/previewview');