import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


export const Documentos = new Mongo.Collection('documentos');


if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('documentos', function documentPublication() {
     return Documentos.find({});
    });
}


