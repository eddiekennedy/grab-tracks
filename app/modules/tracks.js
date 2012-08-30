define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Tracks = app.module();

  // Default model.
  Tracks.Model = Backbone.Model.extend({

    changeTrack: function() {
      //console.log("whoop", Tracks.DetailView)
      //console.log("TVFT", Tracks.DetailView.model.set("id", this.id))
      app.page = this.get("indexNum");
      Tracks.DetailView.model.set("id", this.id);

      /*
      app.page = 1;
      Tracks.DetailView.setView(".feature-track", new Tracks.Views.FeaturedTrack({
        model: this
      })).render();
*/
    }

  });

  // Default collection.
  Tracks.Collection = Backbone.Collection.extend({

    model: Tracks.Model,
    
    parse: function(response) {
      var filteredResponse = _.each( response, function( track ){
          track.indexNum = response.indexOf(track)
          if ( track && track.artwork_url ) {
            // Replace default image artwork url with larger version
            track.artwork_url = track.artwork_url.replace( "large", "t500x500");
          } 
        return track;
      });
      app.page = 0;
      return filteredResponse;
    }
  
  });

  // Track Menu Item View
  Tracks.Views.TrackMenu = Backbone.View.extend({

    template: "tracks/menu-item",
    tagName: "li",
    
    serialize: function() {
      return { track: this.model };
    },

    initialize: function() {
      this.model.on("change", function() {
        this.render();
      }, this);
    },

    events: {
      "click .track-link": "changeTrack"
    },

    changeTrack: function(event) {
      event.preventDefault();
      this.model.changeTrack();
      $(this.el).addClass('active');
      /*
      this.collection.reset();
      var nextPage = parseInt( app.page ) + 1;
      app.router.navigate("tracks/" + app.query + "/" + nextPage, true);
      */
    }

  });

  // Featured Track View
  Tracks.Views.FeaturedTrack = Backbone.View.extend({

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

  // Track List View
  Tracks.Views.List = Backbone.View.extend({

    template: "tracks/tracks",
    tagName: "ul",

    serialize: function() {

      return { query: app.query, count: this.collection.length, page: app.page }

    },

    initialize: function() {

      //this.collection.on("all", this.render, this);

      this.collection.on("fetch", function() {
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
          Tracks.DetailView = new Tracks.Views.FeaturedTrack({
            model: item
          });
          this.insertView(".feature-track", Tracks.DetailView );
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
      /*
      this.collection.reset();
      var nextPage = parseInt( app.page ) + 1;
      app.router.navigate("tracks/" + app.query + "/" + nextPage, true);
      */
    }

  });

  // Return the module for AMD compliance.
  return Tracks;

});
