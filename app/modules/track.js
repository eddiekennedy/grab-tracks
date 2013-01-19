// Track module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Track = app.module();

  // Default Model.
  Track.Model = Backbone.Model.extend({
  
  });

  // Default Collection.
  Track.Collection = Backbone.Collection.extend({

    model: Track.Model,

    url: function() {

      var toOrFrom = "to";

      if ( this.searchType === "m") {
        toOrFrom = "from";
      }

      return [
        app.apiRoot,
        "/tracks.json",
        "?client_id=" + app.clientId,
        "&q=" + this.query,
        "&filter=downloadable",
        "&duration[" + toOrFrom + "]=600000",
        "&limit=5",
        "&offset=" + (this.page - 1)
      ].join("");

    },

    parse: function(response) {
/*
      response = _.each( response, function( track ){
        // Set track indexNum for navigation
        track.indexNum = response.indexOf(track);
        // Set title for thumbnail
        track.titleAttr = track.user.username + " | " + track.title;
        if ( track.artwork_url ) {
          // Save tiny version for thumbnail
          track.icon = track.artwork_url.replace( "large", "tiny" );
          // Replace default image artwork url with larger version
          track.artwork_url = track.artwork_url.replace( "large", "t500x500" );
        } else {
          // Default whitelabel image
          track.icon = "/assets/images/white-label-thumb.png";
          track.artwork_url = "/assets/images/white-label.jpg";
        }
        return track;
      });
*/

console.log("response", response);

      return response;
    }


  });

  // Item View.
  Track.Views.Item = Backbone.Layout.extend({

    template: "track",
    tagName: "li",

    serialize: function() {
      return { track: this.model };
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    }

  });

  // List View.
  Track.Views.List = Backbone.Layout.extend({

    template: "tracks",

    serialize: function() {
      return { tracks: this.options.tracks };
    },

    beforeRender: function() {
      this.options.tracks.each(function(track) {
        this.insertView("ul", new Track.Views.Item({
          model: track
        }));
      }, this);
    },

    initialize: function() {
      this.listenTo(this.options.tracks, {
        "reset": this.render,
        "fetch": function() {
          this.$("ul").html("<img src='/app/img/spinner-gray.gif'>");
        }
      });
    },

    events: {
      "submit form": "doSearch"
    },

    doSearch: function() {
      event.preventDefault();
      var searchType = this.$("input:radio[name=length]:checked").val(),
          queryTerm = this.$(".query").val().replace(/ /g, "+");
      app.router.go( searchType, queryTerm );
      return false;
    }

  });

  // Return the module for AMD compliance.
  return Track;

});
