var fdaFeed = function(method){
	var methods = {
		settings: {
			type: 'string'
		},
		//START PUBLIC METHODS HERE
        init : function(options) {
        	methods.settings = $.extend(methods.settings, options);
        	var data = {
	            q: 'http://www.fda.gov/AboutFDA/ContactFDA/StayInformed/RSSFeeds/TDS/rss.xml'
	            , num: 10
	            , output: 'json'
	            , v: '1.0'
	        };
	        $.ajax({
	            url:'http://ajax.googleapis.com/ajax/services/feed/load'
	            ,type : "GET"
	            ,dataType : "jsonp"
	            ,data: data
	            ,success: function (json) {
	            	$('.preloader').fadeOut();
	            	console.log(json.responseData.feed);
	            	var html='';
	                var feed = json.responseData.feed;
	                var logo = '<div class="fda-logo"><img src="images/fda_logo.jpg"/></div>'
	                var title = '<h4>'+feed.title+'</h4>';
	         		var feeder = function(){
	         			var entry = feed.entries;
	         			var date;
	         			for(var i =0; i< feed.entries.length;i++){
	         				date = moment.utc(entry[i].publishedDate);
				        	html += '<div class="item">\
				          		<div class="row"><div class="title"><p><a href="'+entry[i].link+'">'+entry[i].title+'</a></p></div></div>\
				          		<div class="row">\
				          			<div class="date"><p>'+date.format('ddd MMM Do YYYY')+'</p></div>\
				          			<div class="view-more"><p><a href="'+entry[i].link+'"><i class="fa fa-ellipsis-h fa-2x"></i></a></p></div>\
				          		</div>\
				          		</div>';
				        }
	         		}
	         		html+='<div class="header row">';
	         		html +=logo;
	                html +=title;
	                html +='</div>';
	                html +='<div id="entries"><div class="wrapper">';
	                feeder();
	                html +='</div></div>'
	                $('.fda').append(html);
	                //$('.Spinner').remove();
	                var myScroll = new IScroll('#entries', {
					    mouseWheel: true,
					    scrollbars: true
					});
	            }
			});
		},
	}
	//START PRIVATE FUNCTIONS HERE
	var privacy = {
       
	}
	//SET METHODS AND SETTINGS
	if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
    } else {
            $.error( 'Method "' +  method + '" does not exist in pluginName plugin!');
    }
}//END PLUGIN
window.fdaFeed = fdaFeed;

