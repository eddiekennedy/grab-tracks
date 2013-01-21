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
        "&limit=10",
        "&offset=" + this.offset
      ].join("");

    },

    parse: function(response) {

      var that = this;

      response = _.each( response, function( track ){
        // Set track indexNum for navigation
        track.indexNum = response.indexOf(track);
        // Set title for thumbnail
        track.titleAttr = track.user.username + " | " + track.title;
        if ( track.artwork_url ) {
          // Replace default image artwork url with larger version
          track.artwork_url = track.artwork_url.replace( "large", "t500x500" );
        } else {
          // Default whitelabel image
          track.icon = "/app/images/white-label-thumb.png";
          track.artwork_url = "/app/images/white-label.jpg";
        }

        // Build the list of tag links into an html string
        var tagArray = track.tag_list.match(/\w+|"(?:\\"|[^"])+"/g),
            tagMarkup = "";
            console.log("TAG ARRAY", tagArray);
        if ( tagArray ) {
          for ( var i = 0; i < tagArray.length; i++ ) {
            var cleanTag = tagArray[i];
            cleanTag = cleanTag.replace( /"/g, "" );
            tagMarkup += '<li><a href="' + that.searchType + '/' + cleanTag + '">' + cleanTag + '</a></li>';
          }
          track.tag_list = tagMarkup;
        }

        return track;
      });

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
        this.insertView("ul.tracks", new Track.Views.Item({
          model: track
        }));
      }, this);
    },

    initialize: function() {
      var that = this;
      this.listenTo(this.options.tracks, {
        "reset": this.render,
        "fetch": function() {
          this.$("ul.tracks").html("<div class='loading'><img src='/app/images/loading.gif'></div>");
        }
      });
      // Scroll events
      /*
      var didScroll = false;
      $(window).scroll(function() {
          didScroll = true;
      });
      setInterval(function() {
          if ( didScroll ) {
              didScroll = false;
              // Check your page position and then
              // Load in more tracks
              if ( ( $(document).height() - $(window).height() ) - $(window).scrollTop() < 600 ) {
                that.appendTracks();
              }
          }
      }, 250);
      */
    },

    events: {
      "submit form": "doSearch",
      "click .load-more": "loadMore"
    },

    doSearch: function( event ) {
      event.preventDefault();
      var searchType = this.$("input:radio[name=length]:checked").val(),
          queryTerm = this.$(".query").val().replace(/ /g, "+");
      app.router.go( searchType, queryTerm );
      return false;
    },

    loadMore: function(event) {
      event.preventDefault();
      this.options.tracks.offset = ( this.options.tracks.offset + 1 ) * 10;
      this.options.tracks.fetch();
    }

  });

  // Return the module for AMD compliance.
  return Track;

});
