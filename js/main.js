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
