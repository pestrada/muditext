import { Meteor } from 'meteor/meteor';
import '../imports/api/documents.js';

Meteor.startup(() => {
 // code to run on server at startup

 //Seed users
 // default instructor
 var noInstructor = Meteor.users.find({username: "instructor"}).count() == 0;
 if (noInstructor) Accounts.createUser({username: "instructor", password:"instructor"});
 
});
