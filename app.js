App = Ember.Application.create();

App.Router.map(function() {
    // this.route('search')
})

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return {name: 'World'};
  }
});

