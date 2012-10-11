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

    showDetail: function() {

      app.router.tracks.page = this.get("indexNum");
      Tracks.Detail.model.set("id", this.id);

    },

    moveDetail: function() {

      console.log( this.get("indexNum") )
      var currentIndex = this.get("indexNum");

      app.router.tracks.page = currentIndex + 1;
      Tracks.Detail.model.set("indexNum", currentIndex + 1);

    }
  
  });

  // Default collection.
  Tracks.Collection = Backbone.Collection.extend({

    model: Tracks.Model,

    url: function() {
      return [
        app.apiRoot,
        "/tracks.json",
        "?client_id=" + app.clientId,
        "&q=" + app.query,
        "&filter=downloadable",
        "&duration[to]=600000",
        //"&limit=1",
        "&offset=" + (this.page - 1)
      ].join("");
    },

    parse: function(response) {

      response = _.each( response, function( track ){
        track.indexNum = response.indexOf(track);
        // Set title for thumbnail
        track.titleAttr = track.title + " | " + track.user.username;
        if ( track && track.artwork_url ) {
          // Save tiny version for thumbnail
          track.icon = track.artwork_url.replace( "large", "tiny" );
          // Replace default image artwork url with larger version
          track.artwork_url = track.artwork_url.replace( "large", "t500x500" );
        } 
        return track;
      });
      return response;

    },

    initialize: function( models, options ) {

      if (options) {
        this.page = options.page;
      }

    }

  });

  // Single Track
  Tracks.Views.Item = Backbone.View.extend({

    template: "tracks/track",

    tagName: "li",

    serialize: function() {
      return { track: this.model };
    },

    events: {
      "click .show-detail": "showDetail"
    },

    showDetail: function(event) {
      app.active = this.model;
      this.model.showDetail();
      return false;
    },

    beforeRender: function() {

      if (app.active === this.model) {
        this.$el.siblings().removeClass("active");
        this.$el.addClass("active");
      }

    }

  });

  // Single Track Detail
  Tracks.Views.Detail = Backbone.View.extend({

    template: "tracks/track-detail",

    serialize: function() {
      return { track: this.model };
    },

    initialize: function() {
      this.model.on("change", this.render, this);
    },

    afterRender: function() {
        var that = this;
/*
      if ( app.attachKeyEvents ) {


        // Attach key events to the docuement
        $(document).keyup(function( event ){
          if ( event.keyCode === 37 ) { 
            console.log( "left" )
            that.moveDetail();
            return false;
          }
          if ( event.keyCode === 39 ) { 
            console.log( "right" )
            that.moveDetail();
            return false;
          }
        });

        app.attachKeyEvents = false;

      }
*/
    },

    moveDetail: function( event ) {
      this.model.moveDetail();
    }

  });

  // Tracks List
  Tracks.Views.List = Backbone.View.extend({

    template: "tracks/track-list",

    className: "tracks-wrapper",

    serialize: function() {
      return {
        count: this.collection.length,
        showIntro: app.showIntro
      };
    },

    beforeRender: function() {

      this.collection.each(function( track ) {

        this.insertView("ul", new Tracks.Views.Item({ model: track }));

        if( track.get("indexNum") === app.router.tracks.page ) {

          Tracks.Detail = new Tracks.Views.Detail({ model: track });
          this.insertView( ".detail", Tracks.Detail );

        }

      }, this);

      // Reset 'active' state to 0 if need be
      if( this.collection.length && !app.active ) {
        app.active = this.collection.first();
      }

    },

    cleanup: function() {

      this.collection.off(null, null, this);

    },

    initialize: function() {

      this.collection.on("reset", this.render, this);
      this.collection.on("change", this.render, this);

      this.collection.on("fetch", function() {
        this.$("ul").parent().html('<div class="loading"><img src="/assets/images/loading.gif" alt="Loading..." /></div>');
      }, this);

    },

    events: {
      "submit form": "getTracks"
    },

    getTracks: function( event ) {
      app.router.go("q", this.$(".query").val());
      return false;
    }

  });

  // Return the module for AMD compliance.
  return Tracks;

});
