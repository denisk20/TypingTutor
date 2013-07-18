(function($){
	var iframe;
	//there should be 2 input elements - 1 for text and one for textarea
	$.fn.typingtutor = function(options){
		//todo: make check for input
		var settings = $.extend({}, options);
		//todo: make order independent
		var text = this[0];
		var textarea = this[1];
		var iframe = document.createElement('iframe');
		$(textarea).replaceWith(iframe);
		
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