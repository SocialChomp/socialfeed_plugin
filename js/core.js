// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
	 urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: 'js/libs/',
      shim: {
    d3: { exports: 'd3' },
    topojson: { exports: 'topojson' }
  },
  paths: {
    'd3': 'd3/d3.min',
    'topojson': 'd3/topojson'
  }
});

// Start loading the main app file. Put all of
// your application logic in there.

requirejs(['main']);