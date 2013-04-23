var FAKE_DATA = []

App = Ember.Application.create();

App.Router.map(function() {
    this.route('search', {'path': '/search/:query'})
})


App.SearchRoute = Ember.Route.extend({
    model: function(params){
        return {query: params.query}
    },
    setupController: function(controller, model) {
        controller.set('query', model.query);
        controller.set('content', search(model.query));
      }
})


App.IndexController = Ember.Controller.extend({
    query: '',
    search: function(){
        this.transitionToRoute('search', this.get('query'));
    }
});

App.SearchController = Ember.Controller.extend({
    query: '',
    search: function(){
        this.transitionToRoute('search', this.get('query'));
    }
});


// Takes a query, and returns a list of results
// Faked out for now
function search(query){
    return [
        {'form':'Ixqupu', 'gloss': 'Test'},
        {'form':'HzOoo', 'gloss': 'Running'},
        {'form':'Lnxx', 'gloss': 'Cooking'},
    ]
}