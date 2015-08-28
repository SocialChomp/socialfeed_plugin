
var scFeed = function(method){
	//CREATES A METHOD FOR CHECKING MANY STRINGS AGAINST ONE.
	Array.prototype.contains = function(obj) {
    	return this.indexOf(obj) > -1;
	};
	var methods = {
		settings: {
			url:'',
			container:$(".scfeed"),
			theme:'light',
			type:'feed',
			hasTitle:true,
			hasCover:true,
			title:'',
			coverUrl:'',
			custom: function(){},
			feedOptions: {
				//tabs that allow you to filter out networks different from exclusion
				filter: true,
				//does this use infinity scrolling
				infinity:true,
				//should images open in a pop-up modal when clicked
				modal:false,
				//Set the number of columns per device
				desktopColumns:4,
				tabletColumns:3,
				mobileColumns:3,
				//Choose to only display one network or exlcude any networks. 
				excludeNetworks:[],
				includeNetworks:[],
				//Choose to only display one property or exlcude any properties.
				excludeProperties:[],
				includeProperties:[],
			},
			slideshowOptions: {
				//Choose to only display one network or exlcude any networks. 
				excludeNetworks:[],
				includeNetworks:[],
				//Choose to only display one property or exlcude any properties.
				excludeProperties:[],
				includeProperties:[],
			}
		},
		//START PUBLIC METHODS HERE
        init : function(options) {
        	methods.settings = $.extend(methods.settings, options);
        	//Validate url that is supplied in the options.
    		if(!privacy.settings.cleanUrl()){
    			$.error('Please Check your Url.');
    		}else{
    			if(methods.settings.type==='feed'){
    				methods.feed();
    			}else if(methods.settings.type==='slideshow'){
    				methods.slideshow();
    			}else if(methods.settings.type==='custom'){
    				methods.custom();
    			}
    		}
		},
		//Feed type generates a feed and uses feedOptions for customizing.
		feed: function(options){
			methods.settings.feedOptions = $.extend(methods.settings.feedOptions, options);
			$.ajax({
	            url:methods.settings.url+'&page=1'
	            ,type : "GET"
	            ,dataType : "json"
	            ,success: function (json) {
	            	console.log(json);
	            	//INT the feed
	            	var html="";
        			if(methods.settings.hasCover){
			        	html +='<div class="row"><img src="'+json.stream.image+'" class="cover-img"/></div>';		
        			}
        			if(methods.settings.hasTitle){
			        	html +='<div class="row"><h1>'+json.stream.title+'</h1></div>';		
        			}
	            	if(methods.settings.feedOptions.filter){
			        	html +=privacy.settings.getNetworks();			
        			}
	         		html +='<div class="'+methods.settings.type+' '+methods.settings.theme+'"><div class="wrapper">';
	                /*Run json retun through the feeder and it will return the html based on exclusion and inclusion rules.*/
	                html +=privacy.settings.feeder(json);
	                html +='</div></div>'
	                //add the feed to the container div
	                methods.settings.container.append(html);
	                privacy.settings.updateNetworks();
	                //settings based on infinity
	                privacy.settings.returnLoader();
	                //The width controls how many columns to display
	                $('.'+methods.settings.type+'-item').css({
	                	'width': methods.settings.container.find(".wrapper").width()/privacy.settings.deviceColumn()-10+'px'
	                });
	                $('.'+methods.settings.type+'-item img').error(function(){
	                	$(this).after("<div class='img-error'></div>").remove();
	                });
	                methods.settings.container.find(".wrapper").freetile();
	                //When a user finish resizing the window check to see if the columns are displaying properly
	                var timer;
					$(window).bind('resize', function() {
				  		clearTimeout(timer);
				  		timer = setTimeout(function(){ 
					  		$('.'+methods.settings.type+'-item').css({
			                	'width': methods.settings.container.find(".wrapper").width()/privacy.settings.deviceColumn()-10+'px'
			                });
			               /*methods.settings.container.find('.'+methods.settings.type+'.'+methods.settings.theme).css({'width':methods.settings.container.parent().width()*privacy.settings.deviceColumn()+'px'});*/
			                methods.settings.container.find(".wrapper").freetile();
						}, 200);
					});
					
	            },
	            error: function(response, error){
	            	console.log(response.statusText);
	            }
			});	
		},
		//Slideshow type generates a feed and uses slideshowOptions for customizing.
		slideshow: function(options){
			methods.settings.slideshowOptions = $.extend(methods.settings.slideshowOptions, options);
		},
		custom: function(options){
			$.ajax({
	            url:methods.settings.url+'&page=1'
	            ,type : "GET"
	            ,dataType : "json"
	            ,success: function (json) {
	            	//console.log(json);
	            	method.settings.custom();
	            },
	            error: function(response, error){
	            	console.log(response.statusText);
	            }
			});
		}
	};
	//START PRIVATE FUNCTIONS HERE
	var privacy = {
		settings: {
			networks:[],
			networkFilter:{
				twitter:true,
				instagram:true,
				facebook:true,
				googlePlus:true,
				tumblr:true
			},
			page:2,
			lastPage:false,
			requestInProcess: false,
			/* CleanUrl- checks to is if the url is a valid link coming from socialchomp before it makes a http request. Its not bullit proof validation but basic validation before a network request goes out*/
			cleanUrl:function(){
				if(methods.settings.url || /\S/.test(methods.settings.url)){
					var feedUrl = encodeURI(methods.settings.url);
	    			if(feedUrl.indexOf('api.socialchomp.com')> -1 && feedUrl.indexOf('?apiKey=')> -1){
	    				//console.log('true the url is coming from socialchomp');
	    				//Since the url is legit, set the method url to the encoded url.
	    				methods.settings.url = feedUrl;
	    				return true;
	    			}else{
	    				//console.log('false url is not coming from socialchomp');
	    				return false;
	    			}
	    		}else{
	    			return false;
	    		}
			},
			/* DeviceColumn- is checking the size of the window. When it changes the function then returns the number of columns based on the size of the window. */
			deviceColumn: function(){
				if($(window).width()>=1025){
					//console.log('desktop');
					return methods.settings.feedOptions.desktopColumns;
				}else if($(window).width()<=1024 && $(window).width()>=751){
					//console.log('tablet');
					return methods.settings.feedOptions.tabletColumns;
				}else if($(window).width()<=750){
					//console.log('mobile');
					if(methods.settings.container.width()<=600 && methods.settings.feedOptions.mobileColumns >= 3){
						if(methods.settings.container.width()<=400){
							return 1;
						}else{
							return 2;
						}
					}else{return methods.settings.feedOptions.mobileColumns;}
				}
			},
			/*MeasureWindow- check the container position in the window and run the append function*/
			measureWindow: function(){
				if($(window).scrollTop() >= methods.settings.container.offset().top + methods.settings.container.outerHeight() - window.innerHeight) {
		          privacy.settings.appendFeedItems();
		        }
			},
			/*ReturnLoader- checks the setting of the inifity and will return either a button or run a scroll script */
			returnLoader: function(){
				if(methods.settings.feedOptions.infinity){
					$(window).bind('scroll', function() {
						privacy.settings.measureWindow();
					});
				}else{
					var loadMore="<button class='load-more'>Load More</button>";
					methods.settings.container.append(loadMore);
					methods.settings.container.find('.load-more').on('click', function(){
	                	privacy.settings.appendFeedItems();
	                });
				} 
			},
			/*AppendFeedItems- runs the ajax call of the url and returns the html from the feeder. Then appends that data to the container wrapper that holds the feed. Also tracks the number of items in the json response until it recognizes the last page.*/
			appendFeedItems: function(){
				if(!privacy.settings.requestInProcess){
					if(!privacy.settings.lastPage){
						console.log('loading content');
						privacy.settings.requestInProcess = true;
						$.ajax({
				            url:methods.settings.url+'&page='+privacy.settings.page
				            ,type : "GET"
				            ,dataType : "json"
				            ,success: function (json) {
				            	privacy.settings.page++;
				            	$('.feed.light .wrapper').append(privacy.settings.feeder(json));
				         		$('.'+methods.settings.type+'-item').css({
				                	'width': methods.settings.container.find(".wrapper").width()/privacy.settings.deviceColumn()-10+'px'
				                });
				                $('.'+methods.settings.type+'-item img').error(function(){
				                	$(this).after("<div class='img-error'></div>").remove();
				                });
				         		methods.settings.container.find(".wrapper").freetile();
				         		privacy.settings.requestInProcess = false;
				            	if(json.items.length<25){
				            		privacy.settings.lastPage = true;
				            	}
				            }
				        });
					}else{
						console.log('all content has loaded');
					}
				}
			},
			/*FilterData- returns Ojbects and arrays of the ajax data based on the inclusions and exclusions*/
			filterData: function(data){
				return data;
			},
			/*ParseString- Depending on what network it came from the description http,@,# will be converted to links */
			parseString: function(str, network){
				var plainstring;
			    var plainstring = str.replace(/<a\b[^>]*>/gi,"");
			    plainstring = str.replace(/<\/a>/gi, "");
			    plainstring = str.replace('https://www.', 'https://');
			    plainstring = str.replace('http://www.', 'http://');
			    var results = plainstring;
				if(network ==='twitter'){
					var text;
					var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
				    text = results.replace(exp, "<a href='$1' target='_blank'>$1</a>");
				    exp = /(www[.][-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
	                text = text.replace(exp, "<a href='http://$1' target='_blank'>$1</a>"); 
	                exp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})/g;
	                text = text.replace(exp, "<a href='tel:$1$3$5'>$&</a>");
				    exp = /(^|\s)#(\w+)/g;
				    text = text.replace(exp, "$1<a href='https://twitter.com/search?q=%23$2' target='_blank'>#$2</a>");
				    exp = /(^|\s)@(\w+)/g;
				    text = text.replace(exp, "$1<a href='https://www.twitter.com/$2' target='_blank'>@$2</a>");
				    results = text;
				}else if(network ==='facebook'){
					var text;
					var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
					text = results.replace(exp, "<a href='$1' target='_blank'>$1</a>");
					exp = /(www[.][-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
					text = text.replace(exp, "http://$1");
					exp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})/g;
					text = text.replace(exp, "<a href='tel:$1$3$5'>$&</a>");
					// exp = /(^|\s)#(\w+)/g;
					// text = text.replace(exp, "$1<a href='https://plus.google.com/s/$2' target='_blank'>#$2</a>");
					results = text;
				}else if(network ==='googlePlus'){
					var text;
					var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
					text = results.replace(exp, "<a href='$1' target='_blank'>$1</a>");
					exp = /(www[.][-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
					text = text.replace(exp, "<a href='http://$1' target='_blank'>$1</a>");
					exp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})/g;
					text = text.replace(exp, "<a href='tel:$1$3$5'>$&</a>");
					exp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})/g;
					text = text.replace(exp, "<a href='tel:$1$3$5'>$&</a>");
					exp = /(^|\s)#(\w+)/g;
					text = text.replace(exp, "$1<a href='https://plus.google.com/s/$2' target='_blank'>#$2</a>");
					results = text;
				}else if(network ==='instagram'){
					var text;
					var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
					text = results.replace(exp, "<a href='$1' target='_blank'>$1</a>");
					exp = /(www[.][-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
					text = text.replace(exp, "<a href='http://$1' target='_blank'>$1</a>");
					exp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})/g;
					text = text.replace(exp, "<a href='tel:$1$3$5'>$&</a>");
					exp = /(^|\s)@(\w+)/g;
					text = text.replace(exp, "$1<a href='http://www.instagram.com/$2' target='_blank'>@$2</a>");
					results = text;
				}else{

				}
				return results
			},
			/*Feeder- the html of each item in the feed*/
			feeder: function(data,custom){
				var json = privacy.settings.filterData(data);
				//console.log(json);
				var html='';
				for(var i =1; i< json.items.length;i++){
		        		html += '<div class="'+json.items[i].network+' '+methods.settings.type+'-item '+privacy.settings.filterByNetwork(json.items[i].network)+'">';
		        			//If a item has an image url go ahead and add markup. 
		        			if(json.items[i].image){
		        				html += '<div class="row">\
		        							<div class="'+json.items[i].network+' image-wrap">\
		        								<div class="image-hold">\
		        									<img src="'+json.items[i].image+'" alt=""/>\
		        								</div>\
		        							</div>\
		        						</div>';
		        			}
		        			//If Item has a username go ahead and add markup.
		        			html += '<div class="row">';
		        			if(json.items[i].profile_image){
		        				html += '<div class="'+json.items[i].network+' profile-wrap">\
		        								<div class="profile-hold">\
		        									<img class="profile" src="'+json.items[i].profile_image+'" alt=""/>\
		        								</div>\
		        							</div>';
		        			}
		        			//If Item has a username go ahead and add markup.
		        			if(json.items[i].handle){
		        				html += '<div class="handle-wrap">\
		        								<p class="handle">\
		        									<a href="'+json.items[i].from+'">@'+json.items[i].handle+'</a>\
		        								</p>\
		        							</div>';
		        			}
		        			html += '</div>';
		        			//If Item has a description go ahead and add markup.
		        			if(json.items[i].description){
		        				html += '<div class="row">\
		        							<div class="description-wrap">\
		        								<p class="description">\
		        									'+privacy.settings.parseString(json.items[i].description, json.items[i].network)+'\
		        								</p>\
		        							</div>\
		        						</div>';
		        			}
		        			html += '<div class="row">';
		        			//add network to the networks array if its not already there
		        			if(!privacy.settings.networks.contains(json.items[i].network)){
		        				privacy.settings.networks.push(json.items[i].network);
		        				privacy.settings.updateNetworks();
		        			}
		        			//If Item has a network go ahead and add markup.
		        			if(json.items[i].network){
		        				html += '<div class="network-wrap">\
	        								<p class="network">\
	        									<a href="'+json.items[i].social_link+'"><i class="fa fa-'+json.items[i].network+'"></i></a>\
	        								</p>\
	        							</div>';
		        			}
		        			//If Item has a network go ahead and add markup.
		        			if(json.items[i].created){
		        				html += '<div class="created-wrap">\
	        								<p class="created">\
	        									'+json.items[i].created+'\
	        								</p>\
	        							</div>';
		        			}
		        			html += '</div>';
		          		html +='</div>';
				}
				return html;
			},
			/*GetNetwork- Container div for the filter option*/
			getNetworks: function(){
				var html="<div class='filter-items'><div class='filter-wrap'></div><div class'row'><p class='filter-by'> Filter Content by Social Media Buttons</p></div></div>";
				return html;
			},
			/*UpdateNetworks- Available feed-items for each social network are found as you scroll and when they are found you are able to filter through them.*/
			updateNetworks: function(){
				var networks = privacy.settings.networks;
				var lastchild = networks[networks.length - 1];
				//console.log(lastchild);
				var html="";
				html +="<button class='"+lastchild+" btn-filter active'></button>";
				$('.filter-items .filter-wrap').append(html);
				//HANDLE ACTIONS
				$('.btn-filter').unbind('click');
				$('.btn-filter').click(function(){
		        	$(this).toggleClass('active');
		        	if($(this).hasClass('twitter')){
		        		if(privacy.settings.networkFilter.twitter){
		        			privacy.settings.networkFilter.twitter = false;
		        			$('.twitter.feed-item').toggleClass('not-active');
		        		}else{
		        			privacy.settings.networkFilter.twitter = true;
		        			$('.twitter.feed-item').toggleClass('not-active');
		        		}
		        	}else if($(this).hasClass('instagram')){
		        		if(privacy.settings.networkFilter.instagram){
		        			privacy.settings.networkFilter.instagram = false;
		        			$('.instagram.feed-item').toggleClass('not-active');
		        		}else{
		        			privacy.settings.networkFilter.instagram = true;
		        			$('.instagram.feed-item').toggleClass('not-active');
		        		}
		        	}else if($(this).hasClass('facebook')){
		        		if(privacy.settings.networkFilter.facebook){
		        			privacy.settings.networkFilter.facebook = false;
		        			$('.facebook.feed-item').toggleClass('not-active');
		        		}else{
		        			privacy.settings.networkFilter.facebook = true;
		        			$('.facebook.feed-item').toggleClass('not-active');
		        		}
		        	}
		        	window.setTimeout(methods.settings.container.find(".wrapper").freetile(),300);
		        	privacy.settings.measureWindow();
	            });
			},
			/*FilterByNetwork- In case user filters by a network it will automatically add the not-active class to anything on the screen but add it to anything appended on screen.*/
			filterByNetwork: function(network){
				var setTO = _.get(privacy.settings.networkFilter, network);
				if(!setTO){
					return 'not-active';
				}else{return '';}
			}
		},
	};
	//SET METHODS AND SETTINGS
	if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
    } else {
            $.error( 'Method "' +  method + '" does not exist in pluginName plugin!');
    }
}//END PLUGIN
window.scFeed = scFeed;