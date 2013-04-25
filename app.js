// DATA comes from a json file loaded from the HTML
var appEntries = DATA.database.entry; 
// A dict of entries, organized by IDs.
var appEntriesById = _.chain(appEntries)
    .map(function (entry) {
        if (entry.sense.id === undefined) { return ['', entry]; }
        return [entry.sense.id, entry];
    }).object().value();
// Extended characters
var appExtendedChars = ['á', 'ā', 'â', 'ǎ',
    'ɒ', 'ɒ́', 'ɒ̄', 'ɒ̂', 'ɒ̌',
    'ɛ', 'ɛ́', 'ɛ̄', 'ɛ̂', 'ɛ̌',
    'é', 'ē', 'ê', 'ě',
    'ə', 'ə́', 'ə̄', 'ə̂', 'ə̌',
    'í', 'ī', 'î', 'ǐ',
    'ó', 'ô', 'ō', 'ǒ',
    'ɔ', 'ɔ́', 'ɔ̄', 'ɔ̂', 'ɔ̌',
    'ú', 'ū', 'û', 'ǔ',
    'ń', 'ḿ', 'ŋ', 'ŋ́',
    'ʼ', 'ː', '’'];

// Takes an entry, returns it's synonym entries
function synonyms(entry) {
    if (entry === undefined || entry.sense.synonyms === undefined) {
        return [];
    }
    return _.map(entry.sense.synonyms, function (ref) { return appEntriesById[ref]; });
}

// Takes a query, and returns a list of synonym entries
function search(query) {
    var matches;
    if (query.length < 2) { return []; }
    query = query.toLowerCase();
    // Select all matching entries
    matches = _.filter(appEntries, function (entry) {
        return (entry.sense.gloss && entry.sense.gloss.toLowerCase().indexOf(query) !== -1) || entry.form.toLowerCase().indexOf(query) !== -1;
    });
    // Now get the synonyms of those entries, instead of the entries themselves.
    return _.chain(matches).map(synonyms).flatten(true).compact().value();
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
        // Sometimes the query is passed in as an attribute of the model, sometimes as the model itself.
        var query = model.query || model;
        // Check for unescaped unicode characters (which show up on IOS)
        controller.set('query', decodeURIComponent(query));
    }
});

App.IndexController = Ember.Controller.extend({
    query: '',
    search: function() {
        this.transitionToRoute('search', this.get('query'));
    },

    clear: function () {
        this.set('query', '');
    },

    // Some sequences are single characters some are two unicode code points: a base char and an accent
    specialCharacters: appExtendedChars,

    append: function (ch) {
        this.set('query', this.get('query') + ch);
        $('input[type=search]').focus();
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
        this.set('query', '');
    },

    // Some sequences are single characters some are two unicode code points: a base char and an accent
    specialCharacters: appExtendedChars,

    append: function(ch) {
        this.set('query', this.get('query') + ch);
        $('input[type=search]').focus();
    }
});
