import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Items=new Mongo.Collection('items');

function allow() {return true}

Items.allow({
  insert:allow,
  remove:allow,
  update:allow
});
