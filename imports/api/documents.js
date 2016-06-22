import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


export const Projects = new Mongo.Collection('projects');//projects 


if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('projects', function documentPublication() {
  	 return Projects.find({});
    });
}

Meteor.methods({
	'project.find'(){
       return Projects.find({}).fetch()[0];
	}
});
