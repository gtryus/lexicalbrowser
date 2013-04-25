// DATA comes from a json file loaded from the HTML
var entries = DATA.database.entry; 
// A dict of entries, organized by IDs.
var entriesById = _.chain(entries)
    .map(function(entry){ 
        if(entry.sense.id == undefined){ return ['',entry] }
        return [entry.sense.id, entry]
    }).object().value()


// Takes a query, and returns a list of synonym entries
function search(query) {
    var matches
    if (query.length < 2) { return []; }
    query = query.toLowerCase()
    // Select all matching entries
    matches = _.filter(entries, function(entry) {
        return (entry.sense.gloss && entry.sense.gloss.indexOf(query) !== -1) || entry.form.indexOf(query) !== -1;
    })
    // Now get the synonyms of those entries, instead of the entries themselves.
    return _.chain(matches).map(synonyms).flatten(true).compact().value()
}

// Takes an entry, returns it's synonym entries
function synonyms(entry){
    if(entry == undefined || entry.sense.synonyms==undefined){ return []}
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

    clear: function() {
        this.set('query', '')
    },

    specialCharacters: [{ch:'Á'},{ch:'É'},{ch:'á'},{ch:'â'},{ch:'é'},
        {ch:'ê'},{ch:'í'},{ch:'î'},{ch:'ó'},{ch:'ô'},{ch:'ú'},{ch:'û'},
        {ch:'ā'},{ch:'ē'},{ch:'ě'},{ch:'ī'},{ch:'ń'},{ch:'ŋ'},{ch:'ō'},
        {ch:'ū'},{ch:'ǎ'},{ch:'ǐ'},{ch:'ǒ'},{ch:'ǔ'},{ch:'ɒ'},{ch:'ɔ'},
        {ch:'ə'},{ch:'ɛ'},{ch:'ʼ'},{ch:'ː'},{ch:'́'},{ch:'̂'},{ch:'̄'},
        {ch:'̌'},{ch:'Ḿ'},{ch:'ḿ'},{ch:'’'}],

    append: function(ch) {
        this.set('query', this.get('query') + ch)
    }
});
