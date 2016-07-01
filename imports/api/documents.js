import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


export const Projects = new Mongo.Collection('projects');//projects 
export const Instructor = new Mongo.Collection('instructor');//instructor 

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('projects', function documentPublication() {
  	 return Projects.find({});
    });


    Meteor.publish('instructor', function documentPublications() {
  	 return Instructor.find({});
    });
}

Meteor.methods({
	'project.find'(){
       return Projects.find({}).fetch()[0];
	}
});


Meteor.methods({
	'instructor.find'(){
       return Instructor.find({}).fetch()[0];
	}
});

