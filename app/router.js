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

    routes: {
      "": "index",
      "tracks/:q": "getTracks",
      "tracks/:q/:p": "getMoreTracks",
      "user/:id/tracks": "userTracks"
    },

    index: function() {
      app.useLayout("base").setViews({
        ".search-bar": new Search.Views.Main({})
      }).render();
    },

    getTracks: function(q) {

      app.query = q;

      this.tracks.url = [
        app.apiRoot,
        "/tracks.json",
        "?client_id=" + app.clientId,
        "&q=" + q,
        "&filter=downloadable",
        "&duration[to]=600000",
        "&limit=1"
      ].join("");

      app.useLayout("base").setViews({
        ".tracks": new Tracks.Views.List({
          collection: this.tracks
        }),
        ".search-bar": new Search.Views.Main({}),
      }).render();

      this.tracks.fetch();

    },

    getMoreTracks: function(q, p) {

      app.query = q;
      app.page = p;

      this.tracks.url = [
        app.apiRoot,
        "/tracks.json",
        "?client_id=" + app.clientId,
        "&q=" + q,
        "&filter=downloadable",
        "&duration[to]=600000",
        "&limit=1",
        "&offset=" + p
      ].join("");

      app.useLayout("base").setViews({
        ".tracks": new Tracks.Views.List({
          collection: this.tracks
        }),
        ".search-bar": new Search.Views.Main({}),
      }).render();

      this.tracks.fetch();

    },

    initialize: function() {
      this.tracks = new Tracks.Collection();
    }

  });

  return Router;

});
