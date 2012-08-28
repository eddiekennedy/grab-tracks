define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Tracks = app.module();

  // Default model.
  Tracks.Model = Backbone.Model.extend({});

  // Default collection.
  Tracks.Collection = Backbone.Collection.extend({

    model: Tracks.Model,
    
    parse: function(response) {
      var filteredResponse = _.each( response, function( track ){
          track.indexNum = response.indexOf(track)
          if ( track.artwork_url ) {
            // Replace default image artwork url with larger version
            track.artwork_url = track.artwork_url.replace( "large", "t500x500");
          } 
        return track;
      });
      return filteredResponse;
    }
  
  });

  Tracks.Views.TrackDetail = Backbone.View.extend({

    template: "tracks/track",
    tagName: "div",
    
    serialize: function() {
      return { track: this.model };
    },

    initialize: function() {
      this.model.on("change", function() {
        this.render();
      }, this);
    }

  });

  Tracks.Views.TrackMenu = Backbone.View.extend({

    template: "tracks/menu-item",
    tagName: "li",
    
    serialize: function() {
      return { track: this.model, query: app.query };
    },

    initialize: function() {
      this.model.on("change", function() {
        this.render();
      }, this);
    }

  });

  Tracks.Views.List = Backbone.View.extend({

    template: "tracks/tracks",
    tagName: "ul",

    serialize: function() {

      return { query: app.query, count: this.collection.length, page: app.page }

    },

    initialize: function() {

      //this.collection.on("all", this.render, this);

      this.collection.on("fetch", function() {
        console.log("FETCH")
        this.$el.html('<div class="loading"><img src="/assets/images/loading.gif" /></div>');
      }, this);

      this.collection.on("reset", this.render, this);
      this.collection.on("change", this.render, this);

    },

    render: function(manage) {

      this.collection.each(function(item) {
        this.insertView("ul.tracks.", new Tracks.Views.TrackMenu({
          model: item
        }));
        if( item.get("indexNum") === app.page ) {
          this.insertView(".feature-track", new Tracks.Views.TrackDetail({
            model: item
          }));
          console.log("BING!")
        }
      }, this);

      return manage(this).render();

    },

    cleanup: function() {
      this.collection.off(null, null, this);
    },

    events: {
      "click .show-more": "showMore"
    },

    showMore: function(event) {
      event.preventDefault();
      this.collection.reset();
      var nextPage = parseInt( app.page ) + 1;
      app.router.navigate("tracks/" + app.query + "/" + nextPage, true);
    }

  });

  Tracks.Views.Feature = Backbone.View.extend({

    template: "tracks/track",
    tagName: "ul",

    serialize: function() {

      return { query: app.query, count: this.collection.length, page: app.page }

    },

    initialize: function() {

      //this.collection.on("all", this.render, this);

      this.model.on("fetch", function() {
        console.log("FETCH")
        this.$el.html('<div class="loading"><img src="/assets/images/loading.gif" /></div>');
      }, this);

      this.model.on("reset", this.render, this);
      this.model.on("change", this.render, this);

    },

    render: function(manage) {

      console.log(this.model)

/*
      this.insertView("ul.tracks.", new Tracks.Views.TrackMenu({
          model: item
      }));
*/

      return manage(this).render();

    },

    cleanup: function() {
      this.model.off(null, null, this);
    },

    events: {
      "click .show-more": "showMore"
    },

    showMore: function(event) {
      event.preventDefault();
      this.model.reset();
      var nextPage = parseInt( app.page ) + 1;
      app.router.navigate("tracks/" + app.query + "/" + nextPage, true);
    }

  });

  // Return the module for AMD compliance.
  return Tracks;

});
