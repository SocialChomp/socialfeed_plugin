define(function (require) {
    //require('jquery.backstretch.min');
  	require('planetaryjs/planetaryjs');
 
  		$(function() {//start doing cool shit here 
        //MAP
		  var canvas = document.getElementById('basicGlobe');
		  var planet = planetaryjs.planet();
		  //PING

		  //marker JQuery Plugin
		  var Marker = {
		  	Marker:function(config){
		  		var markers = [];
		  		config = config || {};
		  		var addMarker = function(lng, lat, callback, options){
		  			options = options || {};
      				options.color = options.color || config.color || 'white';
      				var ping = {options: options };
      				if (config.latitudeFirst) {
        				ping.lat = lng;
        				ping.lng = lat;
      				} else {
        				ping.lng = lng;
        				ping.lat = lat;
      				}
      				pings.push(ping);
		  		}
		  	}
		  }
		  $.extend(planetaryjs.plugins, Marker);
		  


		  // Loading this plugin technically happens automatically,
		  // but we need to specify the path to the `world-110m.json` file.
		  planet.loadPlugin(planetaryjs.plugins.earth({
		    topojson: { file: 'js/libs/planetaryjs/world-110m.json' },
		     oceans:   { fill: '#003895' },
  			 land:     { fill: '#dbdbdb', stroke: '#17315c' },
  			 borders:  { stroke: '#cbcbcb' }
		  }));

		  // Scale the planet's radius to half the canvas' size
		  // and move it to the center of the canvas.
		  planet.projection
		    .scale(canvas.width / 2)
		    .translate([canvas.width / 2, canvas.height / 2]);
		  planet.draw(canvas);
		  var iterations = 0;
			planet.onDraw(function() {
			var rotation = planet.projection.rotate();
			rotation[0] += 1;
			if(iterations >= 1 && rotation[0] >= 98){
					planet.stop();
					$('.menu').addClass('bounce-in');
			}
			if (rotation[0] >= 180){
				rotation[0] -= 360;
				iterations += 1;
				
			}
			  planet.projection.rotate(rotation);
			});   
			
    });//END APP

});
