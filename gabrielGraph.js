'use strict';

var modeling = require('flux/modeling');

/**
 * Code block template.
 *
 */
function run(points) {
	console.log("Number of points = "+points.length);

	//Distance between two points
	function distance(p1, p2) {
	    if (p1.length !== p2.length) {
	        throw new Error("Points are not the same dimension!");
	    }
	    var squaredDistance = 0;
	    for (var i = 0, len = p1.length; i < len; i++) {
	        squaredDistance += (p1[i] - p2[i]) * (p1[i] - p2[i]);
	    }
	    return Math.sqrt(squaredDistance)
	}

	function getMidpoint(p1, p2){
		var midPoint = [];
		for (var i=0;i<3;i++){
			midPoint[i] = (p1[i] + p2[i]) / 2;
		}
		return midPoint;
	}
	
	function cycle(tolerance){
	
	//Construct all unique point pairs
	var combos = (points.length * (points.length - 1))/2;
	console.log("Number of combos = "+combos);
	var lines = [];
	var midPoints = [];
	var radius = [];
	var nearbyPoints = [];
	var tempPoints = [];
	var checkRadius = 0;
	var drawFlag = true;
	
	//q is a counter through all unique point combos
	var q=0;
		//Cycle through columns of triangular matrix of combinations
		for (var i=0;i<points.length;i++){
			//Cycle through rows of triangular matrix of combinations
			for (var j=i+1;j<points.length;j++){
				var start = points[i];
				var end = points[j];
				//Find mid-point and radius of circle for point pair
				midPoints[q]=getMidpoint(start.point,end.point);
				radius[q] = distance(start.point,end.point)/2;
				//Check for all other points inclusion within circle
				drawFlag = true;
				for (var z=0;z<points.length;z++){
					if (z!=i&&z!=j){
						//z now cycles through all points except the two currently under examination
						//Do radius comparison accouning for imperfection tolerance
						checkRadius = tolerance*distance(points[z].point,midPoints[q]);
						if (checkRadius<radius[q]){drawFlag=false; break}
					}
				}
				//If flag remains true then beam is valid and may be output
				if (drawFlag===true){lines.push(modeling.entities.line(start, end))}
				q+=1;
			}
			q+=1;
		}
	return lines;
	}
	
	
	//Some framing patterns are not as expected - adding a postive or negative nudge on the
	//encapsulating circle helps but currently not clear under what circumsatnaces to provide
	//a postive or negative one... perhaps expose to user?
	
	// var a = cycle(1.00000001).length;
	// var b = cycle(0.99999999).length;
	var beams = [];
	beams = cycle(0.9999);
	// if(a>b){beams =cycle(1.00000001)}
	// else
	// {beams =cycle(0.99999999)}

	console.log("Number of beams = "+beams.length);
	return {beams:beams};
}

module.exports = {
    run: run
};