import { Meteor } from 'meteor/meteor';
import {Items} from '../database/items.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Cloudinary.config({
    cloud_name: 'xxxxxxxx',
    api_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    api_secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
});

Meteor.publish('allItems', function(){
  return Items.find({}, {sort: {productTitle: 1}});
});

Meteor.publish('oneItem', function(id){
  return Items.find({_id:id});
});


Meteor.methods({

    'sendEmail':function(to, from, subject, html) {
    this.unblock();
    var elasticemail = require('elasticemail');
    var client = elasticemail.createClient({
      username: 'xxxxxxxxxxxxxxxx',
      apiKey: 'xxxxxxxxxxxxxx'
    });

    var msg = {
      from: from,
      from_name: 'Test App',
      to: to,
      subject: subject,
      body_html: html
    };

    client.mailer.send(msg, function(err, result) {
    if (err) {
      return console.error(err);
    }
    });
  },

  sendsms:function(number){
    var http = require("http");
  var options = {
  "method": "POST",
  "hostname": "api.msg91.com",
  "port": null,
  "path": "/api/v2/sendsms",
  "headers": {
    "authkey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "content-type": "application/json"
  }
  };
  var req = http.request(options, function (res) {
  var chunks = [];
  res.on("data", function (chunk) {
    chunks.push(chunk);
  });
  res.on("end", function () {
    var body = Buffer.concat(chunks);
  });
  });
  req.write(JSON.stringify({ sender: 'CBRTON',
  route: '4',
  country: '91',
  sms:
   [ { message: 'Successful', to: number } ] }));
  req.end();
},
//sitemaps
updateSiteMap:function(){
  sitemaps.add('/sitemap.xml', function() {
  var Items=Items.find({}).fetch();
  var count=Items.find({}).count();
  var nums=[];
  nums.push({page:'https://www.rookieamazon.com/product/'+Items[0].productTitle});
  return nums;
});
}
});

WebApp.connectHandlers.use('/webcall', (req, res, next) => {
  console.log('hi done');
});

var schedule = require('node-schedule');
Fiber = Npm.require('fibers');
  var j = schedule.scheduleJob('00 30 13 * * *', function(){
    var today = new Date();
    var todayDate = today.toLocaleDateString('en-IN', {
        day : 'numeric',
        month : 'numeric',
        year : 'numeric'
    }).split(' ').join(' ');
    Fiber(function() {
      //this is where we code the action
      var items=Items.find({}).fetch();
      console.log(items[0]);
      for(i=0;i<Items.find({}).count();i++){

      }
    console.log('sent');
    }).run();
  });
