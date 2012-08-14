define([
  // Libraries.
  "jquery",
  "lodash",
  "backbone",

  // Plugins.
  "plugins/backbone.layoutmanager",
],

function($, _, Backbone) {

  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
    // The root path to run the application through.
    root: "/",
    clientId: "f652822b93b6a6799336b4a729d50de8",
    apiRoot: "https://api.soundcloud.com",
    apiUsers: "https://api.soundcloud.com/users",
    apiTracks: "https://api.soundcloud.com/tracks",
    query: "",
    queryUrl: "",
    filters: {},
    returnCount: 0,
    filteredCount: 0,
    page: 0
  };

  // Patch Model and Collection fetching to emit a `fetch` event.
  // http://tbranyen.com/post/how-to-indicate-backbone-fetch-progress
  _.each(["Model", "Collection"], function(name) {
    // Cache Backbone constructor.
    var ctor = Backbone[name];
    // Cache original fetch.
    var fetch = ctor.prototype.fetch;

    // Override the fetch method to emit a fetch event.
    ctor.prototype.fetch = function() {
      // Trigger the fetch event on the instance.
      this.trigger("fetch", this);

      // Pass through to original fetch.
      return fetch.apply(this, arguments);
    };
  });

  // Localize or create a new JavaScript Template object.
  var JST = window.JST = window.JST || {};

  // Configure LayoutManager with Backbone Boilerplate defaults.
  Backbone.LayoutManager.configure({
    paths: {
      layout: "app/templates/layouts/",
      template: "app/templates/"
    },

    fetch: function(path) {
      path = path + ".html";

      if (!JST[path]) {
        $.ajax({ url: "/" + path, async: false }).then(function(contents) {
          JST[path] = _.template(contents);
        });
      } 
      
      return JST[path];
    }
  });

  // Mix Backbone.Events, modules, and layout management into the app object.
  return _.extend(app, {
    // Create a custom object with a nested Views object.
    module: function(additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    },

    // Helper for specific layouts.
    useLayout: function(name) {
      // If already using this Layout, then don't re-inject into the DOM.
      if (this.layout && this.layout.options.template === name) {
        return this.layout;
      }

      // If a layout already exists, remove it from the DOM.
      if (this.layout) {
        this.layout.remove();
      }

      // Create a new Layout.
      var layout = new Backbone.Layout({
        template: name,
        className: "layout " + name,
        id: "layout"
      });

      // Insert into the DOM.
      $("#main").empty().append(layout.el);

      // Render the layout.
      layout.render();

      // Cache the reference on the Router.
      this.layout = layout;

      // Return the reference, for later usage.
      return layout;
    }
  }, Backbone.Events);

});
