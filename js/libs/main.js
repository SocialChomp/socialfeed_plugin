
$(function() {//start doing cool shit here 
	//$(".main-navigation").menuPlugin();
	//$(".sidebar").sidebar();
	paceOptions = {
	  ajax: true, // disabled
	  document: false, // disabled
	  eventLag: false, // disabled
	  elements: {
	    selectors: ['.scfeed']
	  }
	};
	//SocialChomp Feed
	scFeed({
		url:'https://api.socialchomp.com/s/55cf690b29b0cae564e87f65?apiKey=ed6336508a42f877644bc86381aedef2a5a1d66e',
		hasCover:true,
		hasTitle:true,
		type:'slideshow',
		feedOptions:{
			filter: true,
			infinity:false,
			modal:true,
			desktopColumns:3,
			tabletColumns:2,
			mobileColumns:1
		}
	});
});//END APP