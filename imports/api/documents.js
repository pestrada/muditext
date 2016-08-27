import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Projects = new Mongo.Collection('projects');//projects 

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('projects', function () {
    return Projects.find({});
  });

  Meteor.publish('projectById', function (id) {
    return Projects.find({_id: id});
  });

  Meteor.publish('instructorProject', function (folder) {
    return Projects.find({folder: folder, owner: "instructor"});
  });
}

Meteor.methods({
	'project.find'(id){
    return Projects.find({_id: id});
	},
  'instructor.find'(){
    return Instructor.find({}).fetch()[0];
  },
  'project.update' (){
    
  }

});