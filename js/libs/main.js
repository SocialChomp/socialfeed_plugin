define(function (require) {
	//require('masonry.pkgd.min');
	require('imagesloaded.pkgd.min');
	//require('iscroll');
	require('jquery.freetile');
	//require('fda');
	require('scfeed');
	//require('jquery.backstretch.min');
  		$(function() {//start doing cool shit here 
			//$(".main-navigation").menuPlugin();
			//$(".sidebar").sidebar();
			//SocialChomp Feed
			scFeed({
				url:'https://api.socialchomp.com/s/556e410b29b0cadb78e159a7?apiKey=8caaa3e955ecd753dfdd15c5b163218bb896f680'
			});
			/*fda stuff
			fdaFeed();*/
			//$(".cover-image").css({'min-height':window.innerHeight-100});
			//$(".cover-one").backstretch("images/bgh1.jpg");
    	});//END APP

});