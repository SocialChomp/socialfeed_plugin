
var scFeed = function(method){
	var methods = {
		settings: {
			url:'',
			container:$(".scfeed"),
			theme:'light',
			type:'feed',
			hasTitle:false,
			hasCover:false,
			title:'',
			coverUrl:'',
			custom: function(){},
			feedOptions: {
				//does this use infinity scrolling
				infinity:false,
				//should images open in a pop-up modal when clicked
				modal:false,
				//Set the number of columns per device
				desktopColumns:4,
				tabletColumns:3,
				mobileColumns:2,
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
	            	var html='';
	            	
	            	var feeder = function(){
         				var date;
         				for(var i =1; i< json.items.length;i++){
			        		html += '<div class="'+methods.settings.type+'-item">';
			        			//If a item has an image url go ahead and add markup. 
			        			if(json.items[i].image){
			        				html += '<div class="row">\
			        							<div class="image-wrap">\
			        								<div class="image-hold">\
			        									<img src="'+json.items[i].image+'" alt=""/>\
			        								</div>\
			        							</div>\
			        						</div>';
			        			}
			        			//If Item has a username go ahead and add markup.
			        			html += '<div class="row">';
			        			if(json.items[i].profile_image){
			        				html += '<div class="profile-wrap">\
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
			        									'+json.items[i].description+'\
			        								</p>\
			        							</div>\
			        						</div>';
			        			}
			        			html += '<div class="row">';
			        			//If Item has a network go ahead and add markup.
			        			if(json.items[i].network){
			        				html += '<div class="description-wrap">\
		        								<p class="description">\
		        									<a href="'+json.items[i].social_link+'"><i class="fa fa-'+json.items[i].network+'"></i></a>\
		        								</p>\
		        							</div>';
			        			}
			        			//If Item has a network go ahead and add markup.
			        			if(json.items[i].created){
			        				html += '<div class="description-wrap">\
		        								<p class="description">\
		        									'+json.items[i].created+'\
		        								</p>\
		        							</div>';
			        			}
			        			html += '</div>';
			          		html +='</div>';
				        }
	         		}
	         		html +='<div class="'+methods.settings.type+' '+methods.settings.theme+'"><div class="wrapper">';
	                feeder();
	                html +='</div></div>'
	                //add the feed to the container div
	                methods.settings.container.append(html);
	                methods.settings.container.find(".wrapper").freetile();
	                privacy.settings.returnLoader();
	                //The width controls how many columns to display
	                $('.'+methods.settings.type+'-item').css({
	                	'width': methods.settings.container.find(".wrapper").width()/privacy.settings.deviceColumn()-10+'px'
	                });
	                /*methods.settings.container.find('.'+methods.settings.type+'.'+methods.settings.theme).css({'width':methods.settings.container.parent().width()*privacy.settings.deviceColumn()+'px'});*/
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
	            	console.log(json);
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
			page:2,
			lastPage:false,
			requestInProcess: false,
			/* CleanUrl checks to is if the url is a valid link coming from socialchomp before it makes a http request. Its not bullit proof validation but basic validation before a network request goes out*/
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
			/* DeviceColumn is checking the size of the window. When it changes the function then returns the number of columns based on the size of the window. */
			deviceColumn: function(){
				if($(window).width()>=1025){
					//console.log('desktop');
					return methods.settings.feedOptions.desktopColumns;
				}else if($(window).width()<=1024 && $(window).width()>=751){
					//console.log('tablet');
					return methods.settings.feedOptions.tabletColumns;
				}else if($(window).width()<=750){
					//console.log('mobile');
					return methods.settings.feedOptions.mobileColumns;
				}
			},
			returnLoader: function(){
				if(methods.settings.feedOptions.infinity){
					$(window).bind('scroll', function() {
					        if($(window).scrollTop() >= methods.settings.container.offset().top + methods.settings.container.outerHeight() - window.innerHeight) {
					          privacy.settings.appendFeedItems();
					        }
					});
				}else{
					var loadMore="<button class='load-more'>Load More</button>";
					methods.settings.container.append(loadMore);
					methods.settings.container.find('.load-more').on('click', function(){
	                	privacy.settings.appendFeedItems();
	                });
				} 
			},
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
				            	var feeder = function(){
		         					var html='';
		         					for(var i =1; i< json.items.length;i++){
					        			html += '<div class="'+methods.settings.type+'-item">';
						        			//If a item has an image url go ahead and add markup. 
						        			if(json.items[i].image){
						        				html += '<div class="row">\
						        							<div class="image-wrap">\
						        								<div class="image-hold">\
						        									<img src="'+json.items[i].image+'" alt=""/>\
						        								</div>\
						        							</div>\
						        						</div>';
						        			}
						        			//If Item has a username go ahead and add markup.
						        			html += '<div class="row">';
						        			if(json.items[i].profile_image){
						        				html += '<div class="profile-wrap">\
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
						        									'+json.items[i].description+'\
						        								</p>\
						        							</div>\
						        						</div>';
						        			}
						        			html += '<div class="row">';
						        			//If Item has a network go ahead and add markup.
						        			if(json.items[i].network){
						        				html += '<div class="description-wrap">\
					        								<p class="description">\
					        									<a href="'+json.items[i].social_link+'"><i class="fa fa-'+json.items[i].network+'"></i></a>\
					        								</p>\
					        							</div>';
						        			}
						        			//If Item has a network go ahead and add markup.
						        			if(json.items[i].created){
						        				html += '<div class="description-wrap">\
					        								<p class="description">\
					        									'+json.items[i].created+'\
					        								</p>\
					        							</div>';
						        			}
						        			html += '</div>';
						          		html +='</div>';
							        }
							        return html;
				         		}
				         		$('.feed.light .wrapper').append(feeder());
				         		$('.'+methods.settings.type+'-item').css({
				                	'width': methods.settings.container.find(".wrapper").width()/privacy.settings.deviceColumn()-10+'px'
				                });
				         		$(".scfeed .wrapper").freetile();
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
			filterData: function(json){

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