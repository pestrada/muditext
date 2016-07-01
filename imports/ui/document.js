import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Projects } from '../api/documents.js';
import { Instructor } from '../api/documents.js';
import './document.html';
Router.route('/instructor');

Router.route('/',{
	name:'home',
	template: 'editor'
});
