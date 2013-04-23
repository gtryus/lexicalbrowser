App = Ember.Application.create();

App.Router.map(function() {
    // this.route('search')
})

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return {hello: 'World'};
  }
});


App.IndexController = Ember.Controller.extend({
    search: function(){
        alert('You have pressed search')
        // this.transitionToRoute('search', this.get('query'));
    }
});