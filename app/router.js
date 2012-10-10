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

      // Reset query
      //app.query = false;

      // Use the main layout.
      app.useLayout("main").render();

    },

    tracks: function( query, page ) {

      // Hide intro
      if ( $(".info").length ) {
        $(".info").hide()
      }

      // Reset collections to initial state.
      if ( this.tracks.length ) {
        this.tracks.reset();
      }

      // Set query
      app.query = query;

      // Set page
      this.tracks.page = page || 0;

      // Fetch Data
      this.tracks.fetch({
        error: function() {
          var errorMessage = [
            '<p class="error">',
              'There was a problem fetching data from SoundCloud, please <a href="q/' + app.query + '">try again</a>.',
            '<p>'
          ].join("");
          $(".tracks-wrapper").html( errorMessage );
        }
      });

    },

    // Shortcut for building a url ( source: https://github.com/tbranyen/github-viewer )
    go: function() {
      return this.navigate(_.toArray(arguments).join("/"), true);
    },

    initialize: function() {

      // Reset query
      //app.query = false;

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