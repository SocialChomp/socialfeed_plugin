
$.fn.menuPlugin = function(method){
	var methods = {
		settings: {
			elem : $(this),
			childCheck: function(num){
					return num*170;
			}
		},
		//START PUBLIC METHODS HERE
        init : function(options) {
			var elem = methods.settings.elem;
			elem.wrapInner('<div class="menu-wrapper"></div>');
			elem = $('.menu-wrapper');
			var firstLiLevel = elem.find('ul li').not('ul li ul li').map(function(){return $(this)}).get();
			var firstUlLevel = elem.find('ul').not('ul li ul').map(function(){return $(this)}).get();
			var mobile =false;
			var thirdLiLevel = elem.find('ul li ul li ul li').not('ul li ul li ul li ul li');
			//MAP HOW CHILD ELEMENTS ARE TREATED ON THE FIRST LEVEL
			//console.log(firstLiLevel);
			function changeMenu(){
				if($(window).width()>=1025){
					mobile = false;
					$('.external-js').remove();
					for(var i=0; i<firstLiLevel.length;i++){
						//console.log(firstLiLevel[0][i]);
						methods.displayDesktop.init(firstLiLevel[i], elem);
					}
					elem.attr('style', '');
					methods.settings.elem.attr('style','');
				}else{
					var gotoPos;
					mobile =true;
					elem.css({'left':'-'+100+'%'});
					$('li').unbind('mouseenter mouseleave');
					for(var i=0; i<firstLiLevel.length;i++){
						//console.log(firstLiLevel[0][i]);
						methods.displayMobile.init(firstLiLevel[i], elem);
					}
					$('.mobile-menu').click(function(){
						if(elem.parent().css('max-height')==='1000px'){
							elem.parent().css('max-height','43px');
						}else{
							elem.parent().css('max-height','1000px');
						}
					});
					$('a[data-depth]').click(function(event) {
						event.preventDefault();
						thisLink= $(this);
						dataVal = $(this).attr('data-depth');
						gotoPos = '-'+dataVal*100+'%';
						if(dataVal === thisLink.siblings('ul').attr('data-depth')){
							thisLink.siblings('ul').addClass("active");
						}else if(dataVal === thisLink.parents('ul').parents('ul').attr('data-depth')){
							thisLink.parents('ul').removeClass("active");
							thisLink.parents('ul').parents('ul').addClass("active");
						}else{
							elem.find('ul').removeClass('active');
						}
						elem.css({'left':gotoPos});
					});
				}
			}
			changeMenu();
			var timer;
			$(window).bind('resize', function() {
			  clearTimeout(timer);
			  timer = setTimeout(function(){ 
			  	if(mobile===true && $(window).width()>=1025){
						changeMenu();
						mobile = false;
						//console.log('run big');
					}else if(mobile===false && $(window).width()<=1024){
						changeMenu();
						mobile =true;
						//console.log('run small');
					}
			  }, 200);
			});
		},
		displayMobile:{
			init: function(thisLi, root){
				var firstLink = thisLi.find('a').html();
				var firstUrl = thisLi.find('a').attr('href');
				thisLi.find('ul').each(function(i,e){
					var depth = $(this).parents('ul').length;
					var parent = $(this).siblings('a');
					var parentName = $(this).siblings('a').html();
					var parentUrl = $(this).siblings('a').attr('href');
					var thisUl = $(this);
					var firstLink = thisUl.find('li:first-child');
					thisUl.attr('data-depth', Number(depth+1));
					parent.attr('data-depth', Number(depth+1));
					thisUl.attr('style','');
					parent.append('<i class="fa fa-chevron-right external-js push-right"></i>');
					thisUl.prepend('<li class="external-js"><a href="'+parentUrl+'">'+parentName+' Page</a></li>');
					thisUl.prepend('<li class="external-js"><a href="" data-depth="'+depth+'"><i class="fa fa-chevron-circle-left"></i> back</a></li>');
					//console.log();
				});
			}
		},
		displayDesktop: {
			init: function(thisLi, root){
				//DO IN CASE THERE ARE CHILDREN
				if(thisLi.has('ul').length){

					function sLiNum(){
						//console.log(thisLi.find('li').has('ul').length);
						if(thisLi.find('li').has('ul').length<=1){
							return 3;
						}else{
							return thisLi.find('li').has('ul').length;
						}
					};
					//console.log(sLiNum());
					var elementsHeights = thisLi.find('li ul').not('ul li ul li ul li ul').map(function(){
					    if($(this).height()<300){
					    	return 300;
					    }else{return $(this).height();}
					}).get();

					var maxHeight = Math.max.apply(null, elementsHeights);
					//DO IN CASE THERE ARE CHILDREN
					if(thisLi.find('li').has('ul').length){
						thisLi.find('li a').not('ul li ul li ul li a').css({'color':'#f8b91a'});
						thisLi.find('ul').not('ul li ul li ul').css({'min-width':methods.settings.childCheck(sLiNum())+'px'});
						//CREATE HOVER STATE
						thisLi.hover(function(){
							//console.log('hover big');
							thisLi.find('ul').css({'display':'block'});
							thisLi.find('ul').css({'height':maxHeight+10+'px'});
						},
						function(){
							thisLi.find('ul').css({'height':0+'px'});
						});
					}
					//DO IN CASE THERE ARE NO CHILDREN
					else{
						var elementHeight = thisLi.find('ul').height();
						//CREATE HOVER STATE
						thisLi.hover(function(){
							//console.log('hover small');
							thisLi.find('ul').css({'display':'block'});
							thisLi.find('ul').css({'height':$(window).height()+10+'px','display':'block'});
						},
						function(){
							thisLi.find('ul').css({'height':0+'px'});
						});
					}
					thisLi.find('ul').css({
						'-webkit-opacity':'1',
						'-moz-opacity':'1',
						'opacity':'1',
					});
					thisLi.find('ul').css({'height':0+'px'});
					var secondulLevel = thisLi.find('ul').not('ul li ul li ul').map(function(){return $(this)}).get();
					var secondLiLevel = thisLi.find('ul li').not('ul li ul li ul li').map(function(){return $(this)}).get();
				}
				//DO IN CASE THERE ARE NO CHILDREN
				else{}
			}
		}
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
$.fn.sidebar = function(method){
	var methods = {
		settings: {
			elem : $(this),
		},
		//START PUBLIC METHODS HERE
        init : function(options) {
			var elem = methods.settings.elem;
			elem.css({'min-height':elem.closest('.row').height()});
			$(window).bind('resize', function() {
				elem.css({'min-height':elem.closest('.row').height()});
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
