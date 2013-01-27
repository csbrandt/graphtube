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
