import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Items} from '../database/items.js';
import './routes.js';

import './main.html';
import './homePage.html';
import './header.html';
import './footer.html';

// var conn=DDP.connect('localhost:3030');
// export const Items=new Mongo.Collection('items',conn);

var i;
Session.set('i',6);

Template.header.helpers({
bringbackcart:function(){
  return Session.get('i');
}
})

Template.header.events({
'click #incrementCart':function(){
  Session.set('i',Session.get('i')+1);
}
})

Template.homePage.events({
  'submit #addItems':function(event){
    event.preventDefault();
    var title=document.getElementById('productTitle').value;
    var id=document.getElementById('productId').value;
    var img=event.target.featured.files;
    var featuredurl;
    Cloudinary.upload(img, {
           api_key: 'xxxxxxxxxxxxxxx'
       }, function(err, res) {
      featuredurl=res.secure_url;
       });
    Items.insert({
      productTitle:title,
      productId:id,
      featuredurl
    })
  },
  //Payment Gateway
  'click .js-pay-bundle' :function() {
  	var itemId = $(this).data('itemid'),
  			amount = $(this).data('amount'),
  			processorId = $(this).data('processorid'),
  			qty = $(this).data('qty');
        var merchangeName = "Merchant Name",
            img = "https://s3.amazonaws.com/uifaces/faces/twitter/jsa/128.jpg",
            name = "Harshil Hill",
            description = "Purchase Description",
            amount = amount,
            qty = qty;
        loadExternalScript('https://checkout.razorpay.com/v1/checkout.js').then(function() {
          var options = {
            key: 'rzp_test_YWcTcoftHXZdxo',
            protocol: 'https',
            hostname: 'api.razorpay.com',
            amount: amount,
            name: merchangeName,
            description: description,
            image: img,
            prefill: {
              name: name,
            },
            theme: {
              color: '#b9a76e'
            },
            handler: function (transaction, response){
              Enquiries.insert({
                payment:transaction.razorpay_payment_id
              })
            }
          };

          window.rzpay = new Razorpay(options);

          rzpay.open();
        });
  }
})

var search,i;
Session.set('search','');

Template.list.helpers({
  'items':function(){
    var query=new RegExp( Session.get('search'),'i');
    return Items.find({productTitle:query}, {sort: {productTitle: 1}});
  },
  'itsabook':function(){
    var id=this._id;
    var item=Items.findOne({_id:id});
    if(item.productTitle=="A book"){
      return true;
    }
    else {
      return true;
    }
  }
})

Template.listOne.helpers({
  'items':function(){
    var id=FlowRouter.getParam('id');
    return Items.findOne({_id:id});
  }
})

Template.list.events({
  'click #updateList':function(){
    Items.update({_id:this._id},{$set:{
      color:'Red'
    }})
    Meteor.call('sendEmail','raghu@celebraton.in','admin@celebraton.in','Hi its successful','hi success');
    Meteor.call('sendsms',1234567890);
  },
  'click #deleteList':function(){
    Items.remove({_id:this._id});
  },
  'keyup #searchEnquiries':function(){
    Session.set('search',document.getElementById('searchEnquiries').value);
  }
})

SEO=new FlowRouterSEO();
Template.list.onCreated(function(){
  Meteor.call('updateSiteMap');
  var self=this;
  self.autorun(function(){
    self.subscribe('allItems');
    //SEO
    var title = "The MVP of Amazon";
    var description = "The MVP of Amazon";
    var keywords = "The MVP of Amazon";
    SEO.set({
      title: title,
      description: description,
      keywords: keywords,
      meta: {
            'property="og:image"': "https://res.cloudinary.com/celebraton/image/upload/v1520579176/logo_for_opengraph_new_tj7c6s.jpg",
            'property="og:title"': title,
            'property="og:url"': 'www.rookieamazon.com',
            'property="og:description"': description,
            'name="keywords"': keywords,
            'name="description"': description
          }
    });
})
})


Template.listOne.onCreated(function(){
  var id=FlowRouter.getParam('id');
  var self=this;
  self.autorun(function(){
    self.subscribe('oneItem',id);
  })
})
