(function($) {
	//there should be 2 input elements - 1 for text and one for textarea
	$.fn.typingtutor = function(options) {
		//todo: validate input
		var settings = $.extend({}, options);
		//todo: make order independent
		var text = this[0];
		var textarea = this[1];
		$(textarea).css('resize', 'none');

		var currentLinePosition = 0;
		var lines = $(text).find('p');
		var originalTexts = [];
		var lineLetters = [];
		for (var i = 0; i < lines.length; i++) {
			lines[i] = $(lines[i]);
			var lineText = lines[i].text();
			lines[i][0].innerHTML = '';
			originalTexts[i] = lineText;
			lineLetters[i] = [];
			for (var j = 0; j < lineText.length; j++) {
				var letter = $('<span>' + lineText.charAt(j) + '</span>');
				lines[i].append(letter);
				lineLetters[i][j] = letter;
			}
			//append a whitespace to the end of each line
			var lastLetter = $('<span>&nbsp;</span>');
			lineLetters[i][j] = lastLetter;
			lines[i].append(lastLetter);
			originalTexts[i] += ' ';
		}

		$(text).css('font-family', '"Courier New", Courier, monospace');

		drawCursor(0, 0);

		function drawTextBackground(line, position) {
			lineLetters[line][position].css('background-color', '#C9FFE0');
		}
		function clearTextBackground(line, position) {
			lineLetters[line][position].css('background-color', 'white');
		}
		function drawCursor(line, position) {
			lineLetters[line][position].css('background-color', 'green');
		}
		function highlightError(line, position) {
			lineLetters[line][position].css('background-color', 'red');
		}
		function getLines() {
			var currentText = textarea.value;
			var allLines = currentText.split(/\n/g);
			return allLines
		}
		function getLinesCount() {
			return getLines().length;
		}
		function getLastLine() {
			var allLines = getLines();
			return allLines[allLines.length - 1];
		}
		
		$(textarea).keypress(function(e) {
			if(e.keyCode === 8 || e.keyCode === 13) {
				return;
			}
			//a letter has been typed
			var lastLine = getLastLine();
			var currentTypingPosition = lastLine.length;
			if(currentTypingPosition > originalTexts[currentLinePosition].length - 1) {
				return;
			}
		
			if(originalTexts[currentLinePosition].substring(0, currentTypingPosition + 1) === lastLine + String.fromCharCode(e.which)) {
				drawTextBackground(currentLinePosition, currentTypingPosition);
				drawCursor(currentLinePosition, currentTypingPosition + 1);
			} else {
				highlightError(currentLinePosition, currentTypingPosition);
			}
		});
		$(textarea).keydown(function(e) {
			if(e.keyCode === 8) {
				//backspace - unstyle last styled character
				var lastLine = getLastLine();
				var currentTypingPosition = lastLine.length;
				if(currentTypingPosition > 0) {
					if(currentTypingPosition < originalTexts[currentLinePosition].length) {
						clearTextBackground(currentLinePosition, currentTypingPosition);
					}
					if(currentTypingPosition > 1) {
						if(currentTypingPosition - 1 < originalTexts[currentLinePosition].length) {
							clearTextBackground(currentLinePosition, currentTypingPosition - 1);
							if(originalTexts[currentLinePosition].substring(0, currentTypingPosition - 1) === lastLine.substring(0, currentTypingPosition - 1)) {
								drawCursor(currentLinePosition, currentTypingPosition - 1);
							} else {
								highlightError(currentLinePosition, currentTypingPosition - 2);
							}
						}
					} else {
						drawCursor(currentLinePosition, 0);
					}
				} else {
					//we may have jumped to a previous line
					//Remove cursor from previous line
					if(currentLinePosition === 0){
						//we're at the beginning of the first line
						return;
					}
					clearTextBackground(currentLinePosition, 0);
					currentLinePosition--;
					var currentTypedLine = getLines()[currentLinePosition];
					currentTypingPosition = currentTypedLine.length + 1; //adding one for space at the end
					if(originalTexts[currentLinePosition].substring(0, currentTypingPosition - 1) === currentTypedLine.substring(0, currentTypingPosition - 1)) {
						drawCursor(currentLinePosition, currentTypingPosition - 1);
					} else {
						highlightError(currentLinePosition, currentTypingPosition - 2);
					}
					
				}
			} else if(e.keyCode === 13) {
				//validate current line
				var lastLine = getLastLine();
				if(originalTexts[currentLinePosition].trim() !== lastLine) {
					highlightError(currentLinePosition, lastLine.length - 1);
				} else {
					drawTextBackground(currentLinePosition, lastLine.length);
				}
				currentLinePosition++;
				drawCursor(currentLinePosition, 0);
			}
		});
		
		$(textarea).focus();
	};
}(jQuery));