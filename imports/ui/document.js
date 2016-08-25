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

Router.route('/editor/:id', function () {
  this.render('editor', {
    data: function () {
      return Projects.findOne({ _id: this.params._id});
    }
  });
});

Router.route('/instructor');

Router.route('/previewview');