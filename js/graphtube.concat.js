/** @file graphtube.js
 *  @fileOverview graphtube namespace declaration.
 *  @author cs_brandt
 *  @date 07/07/2012
 */


/** @namespace */
if (graphtube === undefined)
{
	var graphtube = {};
}

// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min and max  
// Using Math.round() will give you a non-uniform distribution!  
function getRandomInt(min, max)  
{  
   return Math.floor(Math.random() * (max - min + 1)) + min;  
}  
/** @file graphtube.data.js
 *  @fileOverview graphtube.data namespace declaration.
 *  @author cs_brandt
 *  @date 07/07/2012
 */


/** @namespace */
if (graphtube && (graphtube.data === undefined))
{
	graphtube.data = {};
}

graphtube.data.youtube =
{
	baseURL: "https://gdata.youtube.com/feeds/api/",
   NUM_RESULTS: "&max-results=50",

	init: function()
	{
		this.STANDARD_FEEDS =
		[
		   this.baseURL + "standardfeeds/top_rated?alt=json" + this.NUM_RESULTS,
		   this.baseURL + "standardfeeds/top_favorites?alt=json" + this.NUM_RESULTS,
		   this.baseURL + "standardfeeds/most_viewed?alt=json" + this.NUM_RESULTS,
		   this.baseURL + "standardfeeds/most_shared?alt=json" + this.NUM_RESULTS,
		   this.baseURL + "standardfeeds/most_popular?alt=json" + this.NUM_RESULTS,
		   this.baseURL + "standardfeeds/most_recent?alt=json" + this.NUM_RESULTS,
		   this.baseURL + "standardfeeds/most_discussed?alt=json" + this.NUM_RESULTS,
		   this.baseURL + "standardfeeds/most_responded?alt=json" + this.NUM_RESULTS,
		   this.baseURL + "standardfeeds/recently_featured?alt=json" + this.NUM_RESULTS,
		   this.baseURL + "standardfeeds/on_the_web?alt=json" + this.NUM_RESULTS
	   ];

	   return this;
	}

}.init();

// return an array on entries
// from the given feed URL
graphtube.data.youtube.getEntries = function(feedURL, callback)
{
	if (!feedURL)
	{
		var feedURL = graphtube.data.youtube.STANDARD_FEEDS[getRandomInt(0, (graphtube.data.youtube.STANDARD_FEEDS.length - 1))];
	}

	$.get(feedURL, function(data)
	{
      var currentFeedTitle = data.feed.title.$t;

		var rawEntries = data.feed.entry;
		var entries = [];

		for (var c = 0; c < rawEntries.length; c++)
		{
			var rawEntry = rawEntries[c];

			var entry = 
			{
			   published: rawEntry.published.$t,
            updated: rawEntry.updated.$t,
            userID: rawEntry.author[0].name.$t,
            category: null, // todo
            title: rawEntry.title.$t,
            thumbnails: rawEntry.media$group.media$thumbnail,
            duration: (rawEntry.media$group.yt$duration) ? parseInt(rawEntry.media$group.yt$duration.seconds, 10) : null,
            averageRating: (rawEntry.gd$rating) ? parseFloat(rawEntry.gd$rating.average) : null,
            numRaters: (rawEntry.gd$rating) ? parseInt(rawEntry.gd$rating.numRaters, 10) : null,
            favoriteCount: (rawEntry.yt$statistics) ? parseInt(rawEntry.yt$statistics.favoriteCount, 10) : null,
            viewCount: (rawEntry.yt$statistics) ? parseInt(rawEntry.yt$statistics.viewCount, 10) : null,
            keywords: (rawEntry.media$group.media$keywords) ? rawEntry.media$group.media$keywords.$t : null,
            HD: rawEntry.yt$hd ? true : false,
            link: rawEntry.link[0].href
			};

			entries.push(entry);
		}

		// call the callback after the entries
		// have been collected
		callback(currentFeedTitle, entries);

	}, "json");

};
/** @file graphtube.app.js
 *  @fileOverview Application logic.
 *  @author cs_brandt
 *  @date 07/07/2012
 */


graphtube.app = function(appOptions)
{
   // Set default options here
   var defaults = 
   {

   };

   // if no options are given, use empty object
   var options = appOptions || {};

   // merge default options with given options
   this.options = $.extend({}, defaults, options);

   $(function()
   {
	   this.init();

   }.bind(this));
};

graphtube.app.UI = function(appUIOptions)
{
   // Set default options here
   var defaults = 
   {
      RESULT_COLUMNS: 4,
      RESULT_ROWS: 4
   };

   // if no options are given, use empty object
   var options = appUIOptions || {};

   // merge default options with given options
   this.options = $.extend({}, defaults, options);

   // rows and columns
   // are zero indexed
   this.cursor_col = 0;
   this.cursor_row = 0;

   this.init();
};

graphtube.app.prototype =
{
	init:function()
	{
		// setup objects
      this.UI    = new graphtube.app.UI(this.options);

		// get some initial data
      // graphtube.data.youtube.getEntries = function(feedURL, callback)
      graphtube.data.youtube.getEntries(null, function(currentFeedTitle, entries)
      {
         // populate youtube results from feed
         //
         var results_container = document.getElementById(this.options.resultsDivID);

         this.UI.showResult(results_container, entries);
         this.UI.updateCurrentFeedTitle(currentFeedTitle);

      }.bind(this));
	}
};

graphtube.app.UI.prototype =
{
   init:function()
   {
      this.bindInputEvents();
   },

   bindInputEvents:function()
   {
      $("#" + this.options.searchID).submit(function()
      {
         // check for a search string
         var searchString = $("input:first").val();

         if (searchString.length > 0)
         {
            // build query URL
            var queryURL = graphtube.data.youtube.baseURL + "videos?q=" + searchString + "&alt=json" + graphtube.data.youtube.NUM_RESULTS;

            graphtube.data.youtube.getEntries(queryURL, function(currentFeedTitle, entries)
            {
               var results_container = document.getElementById(this.options.resultsDivID);

               this.showResult(results_container, entries);
               this.updateCurrentFeedTitle(currentFeedTitle);

            }.bind(this));
         }

      }.bind(this));
   },

   // a generic function
   // for writing any search/feed/filter
   // reults to a container
   // takes in an htmlelement object (div)
   showResult:function(resultsContainer, entries)
   {
      // clear container first
      $(resultsContainer).empty();

      for (var c = 0; c < entries.length; c++)
      {
         // if there are thumbnails for this entry
         if (entries[c].thumbnails)
         {
            var YoutubeDiv = this.getYoutubeDivFromEntry(entries[c]);

            resultsContainer.appendChild(YoutubeDiv);
         } 
      }

      var resultsContainerInnerWidth = $(resultsContainer).parent().innerWidth();

      var availableWidthPerColumn = resultsContainerInnerWidth / this.options.RESULT_COLUMNS;
      //var availableWidthPercent = ((availableWidthPerColumn + offsetPerColumn) / (resultsContainerInnerWidth + (containerWidthDelta / 2))) * 100;
      var availableWidthPercent = (availableWidthPerColumn / resultsContainerInnerWidth) * 100;

      $("div." + this.options.resultsDivClass).width(availableWidthPercent + '%');
   },

   getYoutubeDivFromEntry:function(entry)
   {
      var entryLink  = document.createElement("a");
      var YoutubeDiv = document.createElement("div");
      var titleDiv    = document.createElement("div");
      var entryThumbnail = document.createElement("img");

      YoutubeDiv.className = this.options.resultsDivClass;
      titleDiv.className   = "result_title";

      entryThumbnail.src = entry.thumbnails[0].url;
      entryThumbnail.className = "entry_thumbnail";

      titleDiv.innerHTML = entry.title;
      entryLink.target = "_blank";
      entryLink.href = entry.link;

      entryLink.appendChild(entryThumbnail);
      YoutubeDiv.appendChild(entryLink);
      YoutubeDiv.appendChild(titleDiv);

      return YoutubeDiv;
   },

   updateCurrentFeedTitle:function(currentFeedTitle)
   {
      $('#feed_title').html(currentFeedTitle);
   }

};
/** @file main.js
 *  @fileOverview Program driver.
 *  @author cs_brandt
 *  @date 11/01/2012 
 */


$(function()
{
	var App = new graphtube.app(
	{
		resultsDivID: 'results',
		resultsDivClass: 'resultDiv',
		searchID: 'search_container'
		
	});

   // click the button
   // submit the form
	$("#search_button").click(function()
	{
		$("#search_container").submit();

	});

	$("#logo").click(function()
	{
		window.location.reload();

	});

});
