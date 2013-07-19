(function($){
	var iframe;
	//there should be 2 input elements - 1 for text and one for textarea
	$.fn.typingtutor = function(options) {
		//todo: validate input
		var settings = $.extend({}, options);
		//todo: make order independent
		var text = this[0];
		var textarea = this[1];
		var textFrame = document.createElement('iframe');
		var typingFrame = document.createElement('iframe');
		$(text).replaceWith(textFrame);
		$(textarea).replaceWith(typingFrame);

		var textBody = $(textFrame).contents().find('body');
		var typingBody = $(typingFrame).contents().find('body');
		
		var originalText = $(text).text();
		
		textBody.append(originalText);
		$(typingFrame).contents()[0].designMode="on";
		$(textFrame).contents()[0].designMode="on";
		//hopefully this works even though I don't obtain selection from window, but rather from document
		//todo: IE?
		var textSelection = $(textFrame).contents()[0].getSelection();
		//todo will need error range too
		//todo: IE?
		var textRange = $(textFrame).contents()[0].createRange();
		
		var textRangeEnd = 0;
		
		var typingText = textBody[0].firstChild;
		
		typingBody.keydown(function(event){
			if(event.keyCode === 8) {
				//backspace - unstyle last styled character
				
				//todo: WARN: this does not take into account current line
				var currentTypingPosition = typingBody.text().length;
				if(currentTypingPosition > 0) {
					textBody[0].innerHTML = "";
					textBody.text(originalText);
					
					typingText = textBody[0].firstChild;
					
					textRange.setStart(typingText, 0);
					textRange.setEnd(typingText, currentTypingPosition-1);
					textSelection.addRange(textRange);
					$(textFrame).contents()[0].execCommand('bold');
				}
			} else {
				//a letter has been typed
				//todo for testing only
				//todo: IE?
				textRange.setStart(typingText, 0);
				textRange.setEnd(typingText, 1);
				//applying the range
				//todo: IE?
				textSelection.addRange(textRange);
				//color the range
				$(textFrame).contents()[0].execCommand('bold');
			}
			textSelection.removeAllRanges();
		});
		
	};
}(jQuery));
jQuery.fn.selectText = function() {
    var range, selection;
    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(this[0]);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(this[0]);
//        range.setStart(this[0], 2);
//        range.setEnd(this[0],4);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};