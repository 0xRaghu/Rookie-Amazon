FlowRouter.route('/', {
  name: 'homePage',
  action() {
    BlazeLayout.render('applicationLayout', {main: 'homePage'});
  }
});

FlowRouter.route('/list', {
  name: 'list',
  action() {
    BlazeLayout.render('applicationLayout', {main: 'list'});
  }
});

FlowRouter.route('/list/:id', {
  name: 'listOne',
  action() {
    BlazeLayout.render('applicationLayout', {main: 'listOne'});
  }
});
