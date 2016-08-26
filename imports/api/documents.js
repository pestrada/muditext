import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Projects = new Mongo.Collection('projects');//projects 
export const Instructor = new Mongo.Collection('instructor');//instructor 

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('projects', function () {
    return Projects.find({});
  });

  Meteor.publish('projectById', function (id) {
    return Projects.find({_id: id});
  });

  Meteor.publish('instructor', function () {
    return Instructor.find({});
  });
}

Meteor.methods({
	'project.find'(){
    return Projects.find({}).fetch()[0];
	},
  'instructor.find'(){
    return Instructor.find({}).fetch()[0];
  },
  'project.update' (){
    
  }

});