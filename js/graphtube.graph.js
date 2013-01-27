/** @file graphtube.graph.js

//  @author CS.Brandt
//  @date 07/07/2012 
*/

graphtube.graph = function()
{
	this.graphCount = 0;

	this.availableGraphTypes =
	[
	   'scatter'





	];

	
};

graphtube.graph.prototype =
{
   addPlot:function(plot)
   {
      var key = this.graphCount;

      "use strict";
      if (this.plot[key] === undefined)
      {
         this.plot[key] = {};
      }

      this.plot[key] = plot;

      this.graphCount++;

      return key;
   },

   destroyPlot:function(plotIndex)
   {



   },

	buildGraph:function(graphOpt)
	{
		// Set default options here
      var defaults = 
      {
         type: 'scatter',
         plotOptions:
         {
         	seriesDefaults: 
         	{
         		showMarker: true,
         		showLine: false
         	}
         }

      };

      // if no options are given, use empty object
      var options = graphOpt || {};

      // merge default options with given options
      options = $.extend({}, defaults, options);

      var plot = $.jqplot(options.elementID, options.series, options.plotOptions);

      // return the index of the added plot
      return this.addPlot(plot);
	}


};