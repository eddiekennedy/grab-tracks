define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Search = app.module();

  // Default model.
  Search.Model = Backbone.Model.extend({
  
  });

  // Default collection.
  Search.Collection = Backbone.Model.extend({
    model: Search.Model
  });

  Search.Views.Main = Backbone.View.extend({

    template: "search/search",

    events: {
      "submit form": "submit"
    },

    submit: function(event) {
      event.preventDefault();

      app.query = this.$("input").val();
      app.queryUrl = app.query.replace(" ", "+");
      app.router.navigate("/tracks/" + app.queryUrl, true);
    }

  });

  // Return the module for AMD compliance.
  return Search;

});
