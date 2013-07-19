(function($){
	var iframe;
	//there should be 2 input elements - 1 for text and one for textarea
	$.fn.typingtutor = function(options){
		//todo: validate input
		var settings = $.extend({}, options);
		//todo: make order independent
		var text = this[0];
		var textarea = this[1];
		var textFrame = document.createElement('iframe');
		var typingFrame = document.createElement('iframe');
		$(text).replaceWith(textFrame);
		$(textarea).replaceWith(typingFrame);

		$(textFrame).contents().find('body').append($(text).text());
		$(typingFrame).contents()[0].designMode="on";
		$(textFrame).contents()[0].designMode="on";
		//hopefully this works even though I don't obtain selection from window, but rather from document
		var textSelection = $(textFrame).contents()[0].getSelection();
		//todo will need error range too
		var textRange = $(textFrame).contents()[0].createRange();
		//hopefully this works in all browsers too...
		textRange.setStart($(textFrame).contents().find('body')[0].firstChild, 0);
		
		var textRangeEnd = 0;
		
		$(typingFrame).contents().find('body').keypress(function(){
			//todo for testing only
			textRange.setEnd($(textFrame).contents().find('body')[0].firstChild, ++textRangeEnd);
			textSelection.removeAllRanges();
			textSelection.addRange(textRange);
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