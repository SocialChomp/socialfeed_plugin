define(function (require) {
	//require('masonry.pkgd.min');
	require('imagesloaded.pkgd.min');
	//require('iscroll');
	require('jquery.freetile');
	require('jquery.lazyload.min');
	//require('fda');
	require('scfeed');
	//require('jquery.backstretch.min');
  		$(function() {//start doing cool shit here 
			//$(".main-navigation").menuPlugin();
			//$(".sidebar").sidebar();
			//SocialChomp Feed
			scFeed({
				url:'https://api.socialchomp.com/s/55cf690b29b0cae564e87f65?apiKey=ed6336508a42f877644bc86381aedef2a5a1d66e'
			});
			/*fda stuff
			fdaFeed();*/
			//$(".cover-image").css({'min-height':window.innerHeight-100});
			//$(".cover-one").backstretch("images/bgh1.jpg");
    	});//END APP

});