// DATA comes from a json file loaded from the HTML
var entries = DATA.database.entry; 
// create a dict of entries, organized by IDs.
var entriesById = _.chain(entries)
    .map(function(entry){ 
        if(entry.sense.id == undefined){ return ['',entry] }
        return [entry.sense.id, entry]
    }).object().value()
    
    
// Takes a query, and returns a list of synonym entries
function search(query) {
    var matches, synonyms
    if (query.length < 2) { return []; }
    // Select all matching entries
    matches = _.filter(entries, function(entry) {
        return (entry.sense.gloss && entry.sense.gloss.indexOf(query) !== -1) || entry.form.indexOf(query) !== -1;
    })
    // Now get the synonyms of those entries, instead of the entries themselves.
    synonyms = _.chain(matches).map(synonyms).flatten(true).value()
    return synonyms;
}

// Takes an entry, returns it's synonym entries
function synonyms(entry){
    return _.map(entry.sense.synonyms,  function(ref){ return entriesById[ref]} )
}


App = Ember.Application.create();

App.Router.map(function() {
    this.route('search', {'path': '/search/:query'});
});

App.SearchRoute = Ember.Route.extend({
    model: function(params) { // Only called when the user changes the url, not when the url is transitioned to.
        return {query: params.query};
    },
    setupController: function(controller, model) {
        // I wonder if there might be a better way to do the below
        if (_.isString(model)) {
            controller.set('query', model);
        } else if (model.query !== undefined) {
            controller.set('query', model.query);
        }
    }
});

App.IndexController = Ember.Controller.extend({
    query: '',
    search: function() {
        this.transitionToRoute('search', this.get('query'));
    }
});

App.SearchController = Ember.Controller.extend({
    query: '',
    search: function() {
        this.transitionToRoute('search', this.get('query'));
    },
    results: function() {
        return search(this.get('query'));
    }.property('query'),

    clear: function(){
        this.set('query', '')
    }
});
