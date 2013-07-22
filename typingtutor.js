(function($) {
    //there should be 2 input elements - 1 for text and one for textarea
    $.fn.typingtutor = function(options) {
	//todo: validate input
	var settings = $.extend({}, options);
	//todo: make order independent
	var text = this[0];
	var textarea = this[1];

	var originalText = $(text).text();

	$(text).css('font-family', '"Courier New", Courier, monospace');
	text.innerHTML = "";
	var letters = [];
	for (var i = 0; i < originalText.length; i++) {
	    var letter = $('<span>' + originalText.charAt(i) + '</span>');
	    $(text).append(letter);
	    letters[i] = letter;
	}

	drawCursor(0);

	function drawTextBackground(position) {
	    letters[position].css('background-color', '#C9FFE0');
	}
	function clearTextBackground(position) {
	    letters[position].css('background-color', 'white');
	}
	function drawCursor(position) {
	    letters[position].css('background-color', 'green');
	}
	function highlightError(position) {
	    letters[position].css('background-color', 'red');
	}
	$(textarea).keypress(function(e) {
	    if (e.keyCode === 8) {
		return;
	    }
	    //todo: WARN: this does not take into account current line
	    var currentTypingPosition = $(textarea).val().length;
	    //a letter has been typed
	    //if(originalText.charCodeAt(currentTypingPosition) === e.keyCode)
	    if (originalText.substring(0, currentTypingPosition + 1) === $(textarea).val() + String.fromCharCode(e.which)) {
		drawTextBackground(currentTypingPosition);
		drawCursor(currentTypingPosition + 1);
	    } else {
		highlightError(currentTypingPosition);
	    }
	});
	$(textarea).keydown(function(e) {
	    if (e.keyCode === 8) {
		//backspace - unstyle last styled character
		var currentTypingPosition = $(textarea).val().length;
		if (currentTypingPosition > 0) {
		    clearTextBackground(currentTypingPosition);
		    if (currentTypingPosition > 1) {
			clearTextBackground(currentTypingPosition - 1);
			if (originalText.substring(0, currentTypingPosition - 1) === $(textarea).val().substring(0, currentTypingPosition - 1)) {
			    drawCursor(currentTypingPosition - 1);
			} else {
			    highlightError(currentTypingPosition - 2);
			}
		    } else {
			drawCursor(0);
		    }
		}
	    }
	});
    };
}(jQuery));