var FAKE_DATA = []

App = Ember.Application.create();

App.Router.map(function() {
    this.route('search', {'path': '/search/:q'})
})


App.SearchRoute = Ember.Route.extend({
    model: function(){
        return []
    }
})


App.IndexController = Ember.Controller.extend({
    search: function(){
        this.transitionToRoute('search', this.get('query'));
    }
});

