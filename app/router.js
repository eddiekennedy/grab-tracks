define([
  // Application
  "app",

  // Modules
  "modules/track"
],

function(app, Track) {

  // Defining the application router, you can attach sub routers here
  var Router = Backbone.Router.extend({

    initialize: function() {

      var collections = {
        tracks: new Track.Collection()
      };

      // Ensure the router has references to the collections
      _.extend(this, collections);

      // Use main layout and set Views.
      app.useLayout("main-layout").setViews({
        ".tracks": new Track.Views.List(collections)
      }).render();

    },

    routes: {
      "": "index",
      ":type/:query": "search"
    },

    index: function() {
      // Reset the state and render
      this.reset();
    },

    search: function(type, query) {

      // Reset the state and render
      this.reset();

      // Set the search type
      this.tracks.searchType = type;

      // Set the query term
      this.tracks.query = query;

      // Fetch the data
      this.tracks.fetch();

    },

    reset: function() {

      // Reset collections to initial state.
      if (this.tracks.length) {
        this.tracks.reset();
      }

    },

    // Shortcut for building a url.
    go: function() {
      return this.navigate(_.toArray(arguments).join("/"), true);
    }

  });

  return Router;

});
