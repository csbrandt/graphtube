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
