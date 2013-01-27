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
