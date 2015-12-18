# Social Feed Plugin
![enter image description here](https://lh3.googleusercontent.com/-P87pjQtgxb4/VnPMOzPK8KI/AAAAAAAADyA/b1K_iZ_Zb5M/s500/Screen+Shot+2015-12-18+at+4.04.16+AM.png "socialchomp feed")

Jquery Plugin that creates a social media feed from the SocialChomp JSON output. It aggregates and combines Facebook, Twitter, LinkedIn, YouTube, Instagram, Pinterest and creates multiple layouts.

Social Chomp aggregates social media content from searches and hashtags. Pulling together all public content related to a tag. No need to worry about hitting API limits or empty feeds, SocialChomp handles storing the feed so you can focus on collecting the content.

**Sign up to create a JSON feed:** https://socialchomp.com/

    scFeed({
	    url:'https://api.socialchomp.com/s/55cf690b29b0cae564e87f65
	    apiKey=sc_apikey'
	});
**Requirements**

 - moment.js (handles feed time references) 
 - lodash.js (handles JSON
 - pace.js (preloader) 
 - freetile.js (handles feed tiling *only required in feed mode.*)
 - hammer.js (handles touch events *only required in slideshow mode.*)

**Installation**

 - [Creating your first feed in SocialChomp.](https://github.com/SocialChomp/socialfeed_plugin#creating-your-first-feed-in-socialchomp)
 - Creating the JSON feed.
 - Adding custom feed to your own website.

**API Reference**

 - **Feed Types**
	 - Feed
	 - Slideshow
	 - Custom

 - **Options**
	 - Plugin Options
	 - Feed Options
	 - Slideshow Options

 - **Events**

	 - Plugin Events
	 - Feed Events
	 - Slideshow Events

**Style Guide**
	
 - themes
 - components
 - custom
 - sass guide

#Creating your first feed in SocialChomp

 - Register for an account
 - Login, once you are redirected to your profile click the social media icons to connect all the profiles you want to run searches in. You can not run a social media search on a network that you have not connected.
	 - ![enter image description here](https://lh3.googleusercontent.com/-89_PaF8HD_4/VnPXCVbwA7I/AAAAAAAADyU/JzFYxfviOV8/s500/Screen+Shot+2015-12-18+at+4.46.40+AM.png "Add profiles") 
 - In the navigation hover over Streams then click create stream.
	 -  ![enter image description here](https://lh3.googleusercontent.com/-sP44cqTjFrI/VnPY0BLuhII/AAAAAAAADyk/Dv23vCRa-24/s500/Screen+Shot+2015-12-18+at+4.53.29+AM.png "Create Stream")