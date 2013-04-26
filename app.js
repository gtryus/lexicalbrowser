// DATA comes from a json file loaded from the HTML
var appEntries = DATA.database.entry; 
// A dict of entries, organized by IDs.
var appEntriesById = _.chain(appEntries)
    .map(function (entry) {
        if (entry.sense.id === undefined) { return ['', entry]; }
        return [entry.sense.id, entry];
    }).object().value();
var appKeyButtons = ['ɒ', 'ɛ', 'ə', 'ɔ', 'ŋ', '◌́', '◌̂', '◌̄', '◌̌', 'ʼ', 'ː'];
var appKeyList = { "keyList": { "key": [{ "seq": "Á", "composite": "Á", "compUtf8": "00c1" }, { "seq": "É", "composite": "É", "compUtf8": "00c9" }, { "seq": "á", "composite": "á", "compUtf8": "00e1" }, { "seq": "â", "composite": "â", "compUtf8": "00e2" }, { "seq": "é", "composite": "é", "compUtf8": "00e9" }, { "seq": "ê", "composite": "ê", "compUtf8": "00ea" }, { "seq": "í", "composite": "í", "compUtf8": "00ed" }, { "seq": "î", "composite": "î", "compUtf8": "00ee" }, { "seq": "ó", "composite": "ó", "compUtf8": "00f3" }, { "seq": "ô", "composite": "ô", "compUtf8": "00f4" }, { "seq": "ú", "composite": "ú", "compUtf8": "00fa" }, { "seq": "û", "composite": "û", "compUtf8": "00fb" }, { "seq": "ā", "composite": "ā", "compUtf8": 101 }, { "seq": "ē", "composite": "ē", "compUtf8": 113 }, { "seq": "ě", "composite": "ě", "compUtf8": "011b" }, { "seq": "ī", "composite": "ī", "compUtf8": "012b" }, { "seq": "ń", "composite": "ń", "compUtf8": 144 }, { "seq": "ō", "composite": "ō", "compUtf8": "014d" }, { "seq": "ū", "composite": "ū", "compUtf8": "016b" }, { "seq": "ǎ", "composite": "ǎ", "compUtf8": "01ce" }, { "seq": "ǐ", "composite": "ǐ", "compUtf8": "01d0" }, { "seq": "ǒ", "composite": "ǒ", "compUtf8": "01d2" }, { "seq": "ǔ", "composite": "ǔ", "compUtf8": "01d4" }, { "seq": "Ḿ", "composite": "Ḿ", "compUtf8": "1e3e" }, { "seq": "ḿ", "composite": "ḿ", "compUtf8": "1e3f" }] } };
var appKeyBySeq = _.chain(appKeyList.keyList.key).map(function (key) {
    return [key.seq, key];
}).object().value();

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

function insertCh(ctx, ch) {
    var e, col = '', seq;
    ctx.set('query', ctx.get('query') + ch);
    var len = ctx.query.length;
    if (len >= 2) {
        var holder = len - 2;
        if (ctx.query[holder] === "◌") {
            holder = holder - 1;
            for (e = 0; e < holder; e++) {
                col = col + ctx.query[e];
            }
            seq = ctx.query[holder] + ctx.query[holder + 2];
            if (appKeyBySeq[seq] !== undefined) {
                col = col + appKeyBySeq[seq].composite;
            } else {
                col = col + seq;
            }
            ctx.set('query', col)
        }
    }
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
    specialKeys: appKeyButtons,

    insert: function (ch) {
        insertCh(this, ch);
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
    specialKeys: appKeyButtons,

    insert: function (ch) {
        insertCh(this, ch);
        $('input[type=search]').focus();
    }
});
