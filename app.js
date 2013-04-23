App = Ember.Application.create();

App.Router.map(function() {
    this.route('search', {'path': '/search/:query'})
})


App.SearchRoute = Ember.Route.extend({
    model: function(params){ // Only called when the user changes the url, not when the url is transitioned to.
        return {query: params.query}
    },
    setupController: function(controller, model) {
        // I wonder if there might be a better way to do the below
        if(_.isString(model)){
            controller.set('query', model);
        }else if(model.query != undefined){
            controller.set('query', model.query);
        }
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
    },
    
    results: function(){
        return search(this.get('query'))
    }.property('query'),

    clear: function(){
        this.set('query', '')
    }
});



// Data
var entries = DATA.database.entry // DATA comes from a json file loaded from the HTML

// Takes a query, and returns a list of results
function search(query){
    if(query.length < 2){ return [] }
    var matches = _.filter(entries, function(entry){
        return (entry.sense.gloss && entry.sense.gloss.indexOf(query) !== -1) || entry.form.indexOf(query) !== -1
    })
    var synonyms = []
    for (i = 0; i < matches.length; i++) {
        var results = _.filter(entries, function(entry) {
            return (entry.sense.id == matches[i].sense.synonyms.ref)
        })
        synonyms = synonyms.concat(results);
    }
    return synonyms
}
