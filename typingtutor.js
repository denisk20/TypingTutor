(function($) {
    //there should be 2 input elements - 1 for text and one for textarea
    $.fn.typingtutor = function(options) {
	//todo: validate input
	var settings = $.extend({}, options);
	//todo: make order independent
	var text = this[0];
	var textarea = this[1];
	var originalText = $(text).text();
	
	text.innerHTML = "";
	var letters = []
	for(var i = 0; i < originalText.length; i++){
	    var letter = $('<span>' + originalText.charAt(i) + '</span>');
	    $(text).append(letter);
	    letters[i] = letter;
	}
	var typingFrame = document.createElement('iframe');
	$(textarea).replaceWith(typingFrame);

	var typingBody = $(typingFrame).contents().find('body');
	var typingDocument = $(typingFrame).contents()[0];

	typingDocument.designMode = "on";

	typingBody.keydown(function(event) {
	    //todo: WARN: this does not take into account current line
	    var currentTypingPosition = typingBody.text().length;
	    if (event.keyCode === 8) {
		//backspace - unstyle last styled character

		if (currentTypingPosition > 0) {
		    letters[currentTypingPosition-1].css('background-color', '');
		}
	    } else {
		//a letter has been typed
		letters[currentTypingPosition].css('background-color', '#C9FFE0');
	    }
	});
    };
}(jQuery));