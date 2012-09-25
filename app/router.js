define([
  // Application.
  "app",

  // Modules
  "modules/tracks",
  "modules/search"
],

function(app, Tracks, Search) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    
    routes: {

      "": "index",
      "q/:query": "tracks",
      "q/:query/:page": "tracks"

    },

    index: function() {

      this.reset();

      // Use the main layout.
      app.useLayout("main").render();

    },

    tracks: function( query, page ) {

      // Reset to initial state.
      this.reset();
      // Set query
      app.query = query;
      // Set page
      this.tracks.page = page || 0;
      // Fetch Data
      this.tracks.fetch({
        error: function() {
          app.problem();
        }
      });

    },

    reset: function() {

      // Reset collections to initial state.
      if ( this.tracks.length ) {
        this.tracks.reset();
      }

      // Reset active model.
      app.active = false;
      app.query = false;
      //this.commits.repo = false;

    },

    // Shortcut for building a url.
    go: function() {
      return this.navigate(_.toArray(arguments).join("/"), true);
    },

    initialize: function() {

      // Set up the tracks.
      this.tracks = new Tracks.Collection();

      // Use main layout and set Views.
      app.useLayout("main");
      
      app.layout.setViews({
        ".tracks": new Tracks.Views.List({
          collection: this.tracks
        }),
        ".search": new Search.Views.SearchField()
      });

    }

  });

  return Router;

});