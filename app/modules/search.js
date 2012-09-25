define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Search = app.module();

  Search.Views.SearchField = Backbone.View.extend({

    template: "tracks/search",

    serialize: function() {
      return { query: app.query || "Search Tracks" };
    },

    events: {
      "submit form": "getTracks"
    },

    getTracks: function(event) {
      app.router.go("q", this.$(".query").val().replace(" ", "+") );
      return false;
    }

  });

  // Return the module for AMD compliance.
  return Search;

});
