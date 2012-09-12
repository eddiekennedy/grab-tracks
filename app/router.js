define([
  // Application.
  "app",
  // Modules
  //"modules/users",
  "modules/tracks",
  "modules/search"
],

function(app, Tracks, Search) {
  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({

    initialize: function() {
      this.tracks = new Tracks.Collection();
    },

    routes: {
      "": "index",
      ":query": "getTracks",
      ":query/:page": "getTracks"
    },

    index: function() {
      app.useLayout("base").setViews({
        ".search-bar": new Search.Views.Main({})
      }).render();
    },

    getTracks: function( query, page ) {

      app.page = page || 1;
      app.query = query;

      this.tracks.url = [
        app.apiRoot,
        "/tracks.json",
        "?client_id=" + app.clientId,
        "&q=" + app.query,
        "&filter=downloadable",
        "&duration[to]=600000",
        //"&limit=1",
        "&offset=" + app.page
      ].join("");
      
      app.useLayout("base").setViews({
        ".content": new Tracks.Views.List({
          collection: this.tracks
        }),
        ".search-bar": new Search.Views.Main({}),
      }).render();

      this.tracks.fetch();

    }

  });

  return Router;

});