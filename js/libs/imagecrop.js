(function($) {
    //setting up the object to take the arguments
	$.imageCrop = function(object, customOptions) {
	// Rather than requiring a lengthy amount of arguments, pass the
    // plug-in options in an object literal that can be extended over
    // the plug-in's defaults
    var defaultOptions = {
        allowMove : true,
        allowResize : true,
        allowSelect : true,
        minSelect : [0, 0],
        outlineOpacity : 0.5,
        overlayOpacity : 0.5,
        selectionPosition : [0, 0],
        selectionWidth : 0,
        selectionHeight : 0
    };
	// Set options to default
    var options = defaultOptions;
	
	// Merge current options with the custom option
		function setOptions(customOptions) {
			options = $.extend(options, customOptions);
		};
		
    // And merge them with the custom options
    setOptions(customOptions);	
	//holds the image layer
	var $image = $(object);
	// Initialize an image holder
	var $holder = $('<div />').css({'position' : 'relative'}).width($image.width()).height($image.height());
	// Wrap the holder around the image
	$image.wrap($holder).css({'position' : 'absolute'});
	var $overlay = $('<div id="image-crop-overlay" />')
    .css({
        opacity : options.overlayOpacity,
        position : 'absolute'
    })
    .width($image.width())
    .height($image.height())
    .insertAfter($image);
	
	// Initialize a trigger layer and place it above the overlay layer
	var $trigger = $('<div />')
    .css({
        backgroundColor : '#000000',
        opacity : 0,
        position : 'absolute'
    })
    .width($image.width())
    .height($image.height())
    .insertAfter($overlay);
	// Initialize an outline layer and place it above the trigger layer
	var $outline = $('<div id="image-crop-outline" />')
    .css({
        opacity : options.outlineOpacity,
        position : 'absolute'
    })
    .insertAfter($trigger);
	// Initialize a selection layer and place it above the outline layer
	var $selection = $('<div />')
    .css({
        background : 'url(' + $image.attr('src ') no-repeat',
        position : 'absolute'
    })
    .insertAfter($outline);
	};
	
	$.fn.imageCrop = function(customOptions) {
		
		this.each(function(){
			var currentObject = this;
			//cotains the image that will be loaded in here later.
			image = new Image();
			// And attach imageCrop when the object is loaded
			image.onload = function(){
				$.imageCrop(currentObject, customOptions);
			};
			// Reset the src because cached images don't fire load sometimes
            image.src = currentObject.src;
		});
		// Unless the plug-in is returning an intrinsic value, always have the
        // function return the 'this' keyword to maintain chainability
        return this;
	};
}) (jQuery);