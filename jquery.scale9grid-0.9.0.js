/*
 * jQuery 9-Grid Scaling Plugin 0.9.0
 *
 * Copyright (c) 2008 Gordon L. Hempton ( http://hempton.com )
 * Licensed under the MIT license
 */
(function($) {

$.fn.scale9Grid = function(grid) {
	
	var gridTop = grid.top || 0;
	var gridBottom = grid.bottom || 0;
	var gridLeft = grid.left || 0;
	var gridRight = grid.right || 0;

	$(this).each(function() {
		
		var $target = $(this);
		var backgroundImage = $target.css('background-image');
		var match = /url\("?([^\(\)"]+)"?\)/i.exec(backgroundImage);
		if(!match || match.length < 2) {
			return;
		}
		var backgroundUrl = match[1];
		
		var paddingLeft = $target.css('padding-left');
		var paddingRight = $target.css('padding-left');
		var paddingTop = $target.css('padding-top');
		var paddingBottom = $target.css('padding-bottom');
		var textAlign = $target.css('text-align');
		
		$target.css({
			'background-color':'transparent',
			'background-image':'none',
			'border-color':'transparent',
			'padding':'0',
			'text-align':'left'
		});
		
		$target.wrapInner('<div class="s9gwrapper"></div>');
		var $wrapper = $target.find('.s9gwrapper');
		$wrapper.css({
			'position':'relative',
			'padding-left':paddingLeft,
			'padding-right':paddingRight,
			'padding-top':paddingTop,
			'padding-bottom':paddingBottom,
			'text-align':textAlign,
			'z-index':'2',
			'display':'block'
		})
		
		var backgroundElement = document.createElement('div');
		$target.prepend(backgroundElement);
		var $background = $(backgroundElement);
		$background.css({
			'position':'relative',
			'width':'0px',
			'height':'0px',
			'z-index':'0',
			'display':'block'
		});
		
		var imageWidth;
		var imageHeight;
		
		var layoutGrid = function() {
			var width = $target.innerWidth();
            var height = $target.innerHeight();
            
            if(width < gridLeft + gridRight || height < gridTop + gridBottom) {
            	return;
            }
            
            // TODO: optimize this by reusing existing divs
            $background.find('.s9cell').remove();
            
            for(var y = 0; y < height;)
            {
            	var cellHeight;
            	var verticalPosition;
            	if(y == 0) {
            		verticalPosition = "top";
            		cellHeight = Math.min(imageHeight - gridBottom, height - gridBottom);
            	}
            	else if(y + imageHeight - gridTop >= height) {
            		verticalPosition = "bottom";
            		cellHeight = height - y;
            	}
            	else {
            		verticalPosition = "center";
            		cellHeight = Math.min(imageHeight - gridTop - gridBottom, height - y - gridBottom);
            	}
            	
            	for(var x = 0; x < width;)
            	{
            		var cellElement = document.createElement('div');
            		$background.append(cellElement);
            		var $cell = $(cellElement);
            		
            		var cellWidth;
            		var horizontalPosition;
            		if(x == 0) {
            			horizontalPosition = "left";
            			cellWidth = Math.min(imageWidth - gridRight, width - gridRight);
            		}
            		else if(x + imageWidth - gridBottom >= width) {
            			horizontalPosition = "right";
            			cellWidth = width - x;
            		}
            		else {
            			horizontalPosition = "center";
            			cellWidth = Math.min(imageWidth - gridLeft - gridRight, width - x - gridRight);
            		}
            		
            		$cell.css({
            			'position':'absolute',
            			'left':x + 'px',
            			'top':y + 'px',
            			'width':cellWidth + 'px',
            			'height':cellHeight + 'px',
            			'background-image':backgroundImage,
            			'background-position':verticalPosition + ' ' + horizontalPosition
            		});
            		$cell.addClass('s9cell');
            		
            		x += cellWidth;
            	}
            	y += cellHeight;
            }
		};
		
		var image = new Image();
		$(image).load(function() {
			if(image.width < gridLeft + gridRight || image.height < gridTop + gridBottom) {
				return; //invalid inputs
			}
			imageWidth = image.width;
			imageHeight = image.height;
			layoutGrid();
			// TODO: we should resize when the text size is changed also
			$(window).resize(layoutGrid);
		}).attr('src', backgroundUrl);
		
	});
	
};
	
})(jQuery);