(function($) {
	//there should be 2 input elements - 1 for text and one for textarea
	$.fn.typingtutor = function(options) {
		//todo: validate input
		var settings = $.extend({
			speedInterval: 4
		}, options);
		//todo: make order independent
		var text = this[0];
		var textarea = this[1];
		$(textarea).css('resize', 'none');
		$(textarea).attr('onpaste', 'return false;');

		var currentLinePosition = 0;
		var lines = $(text).find('p');
		var originalTexts = [];
		var lineLetters = [];
		var totalCharacters = 0;
		for (var i = 0; i < lines.length; i++) {
			lines[i] = $(lines[i]);
			var lineText = $.trim(lines[i].text());
			totalCharacters += lineText.length;
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
		totalCharacters -= 1; //substracting 1 for the very first hit

		$(text).css('font-family', '"Courier New", Courier, monospace');

		drawCursor(0, 0);

		function drawTextBackground(line, position) {
			if (lineLetters[line] && lineLetters[line][position]) {
				lineLetters[line][position].css('background-color', '#C9FFE0');
			}
		}
		function clearTextBackground(line, position) {
			if (lineLetters[line] && lineLetters[line][position]) {
				lineLetters[line][position].css('background-color', 'white');
			}
		}
		function drawCursor(line, position) {
			if (lineLetters[line] && lineLetters[line][position]) {
				lineLetters[line][position].css('background-color', '#C6DEA2');
			}
		}
		function highlightError(line, position) {
			if (lineLetters[line] && lineLetters[line][position]) {
				lineLetters[line][position].css('background-color', 'red');
			}
			clearSpeed();
			isError = true;
			ec++;
			if (eh) {
				eh.call(this, ec);
			}
		}
		function endsWith(str, suffix) {
			return str.indexOf(suffix, str.length - suffix.length) !== -1;
		}
		function getLines() {
			var currentText = textarea.value;
			var allLines = currentText.split(/\n/g);
			if ($.browser.name = 'msie' && endsWith(currentText, '\n')) {
				//todo test for ie > 8
				allLines.push('');
			}
			return allLines
		}
		function getLinesCount() {
			return getLines().length;
		}
		function getLastLine() {
			var allLines = getLines();
			return allLines[allLines.length - 1];
		}

		//speed interval
		var si = settings.speedInterval;
		//last correct date
		var lcd;
		//times
		var tms = [];
		//speed callback
		var scb = settings.speedTrackCallback;
		//finish callback
		var fcb = settings.finishCallback;
		function clearSpeed() {
			lcd = null;
			tms.length = 0;
		}
		var millisInMinute = 1000 * 60;
		var startTime = null;

		//error count
		var ec = 0;
		var eh = settings.errorCallback;

		var isError = false;
		$(textarea).keypress(function(e) {
			if (!startTime) {
				startTime = new Date().getTime();
			}
			if (e.keyCode === 8 || e.keyCode === 13) {
				return;
			}

			//a letter has been typed
			var lastTypedLine = getLastLine();
			var currentTypingPosition = lastTypedLine.length;
			if (!originalTexts[currentLinePosition]) {
				return;
			}
			if (currentTypingPosition >= originalTexts[currentLinePosition].length - 1) {
				//at the end of the line
				if (e.which === 32) {
					//trigger enter event
					e.preventDefault();
					e = new jQuery.Event('keydown');
					e.which = e.keyCode = 13;
					$(textarea).trigger(e);

					$(textarea).val($(textarea).val() + '\n')
					return;
				}
			}
			if (currentTypingPosition > originalTexts[currentLinePosition].length - 1) {
				return;
			}
			if (originalTexts[currentLinePosition].substring(0, currentTypingPosition + 1) === lastTypedLine + String.fromCharCode(e.which)) {
				//a correct letter is about to be pressed
				isError = false;
				drawTextBackground(currentLinePosition, currentTypingPosition);
				drawCursor(currentLinePosition, currentTypingPosition + 1);
				if (scb) {
					//correct date
					var cd = new Date().getTime();
					if (lcd) {
						//recording current time
						var t = cd - lcd;
						tms.push(t);
						if (tms.length === si) {
							//calculate average and call speed feedback
							var tot = 0;
							$.each(tms, function(i, val) {
								tot += val;
							});
							//average speed of typing one character
							var avg = tot / (tms.length);

							var speed = millisInMinute / avg;
							scb.call(this, parseInt(speed));

							tms.length = 0;
						}
					}

					lcd = cd;
				}
				//check if the whole text is typed
				//at this point we are sure that the typed symbol was correct
				//if we're at the end of last line - fire 'finishedcallback'
				if (fcb) {
					if (!isError && originalTexts.length - 1 === currentLinePosition && originalTexts[originalTexts.length - 1].length - 2/*substracting last whitespace*/ === currentTypingPosition) {
						var time = new Date().getTime() - startTime;
						var overallSpeed = (totalCharacters / time) * millisInMinute;
						fcb.call(this, parseInt(overallSpeed));
						//append last typed word to the textarea before disabling it
						$(textarea).val($(textarea).val() + String.fromCharCode(e.which));
						$(textarea).attr('disabled', true);
						$(textarea).unbind('keypress');
						$(textarea).unbind('keydown');
					}
				}
			} else {
				highlightError(currentLinePosition, currentTypingPosition);
			}
		});
		$(textarea).keydown(function(e) {
			if (e.keyCode === 8) {
				//backspace - unstyle last styled character
				var lastLine = getLastLine();
				var currentTypingPosition = lastLine.length;
				if (currentTypingPosition > 0) {
					if (!originalTexts[currentLinePosition]) {
						return;
					}

					if (currentTypingPosition < originalTexts[currentLinePosition].length) {
						clearTextBackground(currentLinePosition, currentTypingPosition);
					}
					if (currentTypingPosition > 1) {
						if (currentTypingPosition - 1 < originalTexts[currentLinePosition].length) {
							clearTextBackground(currentLinePosition, currentTypingPosition - 1);
							if (originalTexts[currentLinePosition].substring(0, currentTypingPosition - 1) === lastLine.substring(0, currentTypingPosition - 1)) {
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
					if (currentLinePosition === 0) {
						//we're at the beginning of the first line
						return;
					}
					if(! originalTexts[currentLinePosition]){
						return
					}

					clearTextBackground(currentLinePosition, 0);
					currentLinePosition--;
					var currentTypedLine = getLines()[currentLinePosition];
					currentTypingPosition = currentTypedLine.length + 1; //adding one for space at the end
					if (originalTexts[currentLinePosition].substring(0, currentTypingPosition - 1) === currentTypedLine.substring(0, currentTypingPosition - 1)) {
						drawCursor(currentLinePosition, currentTypingPosition - 1);
					} else {
						highlightError(currentLinePosition, currentTypingPosition - 2);
					}
				}
			} else if (e.keyCode === 13) {
				//enter
				//validate current line
				var lastLine = getLastLine();
				if ($.trim(originalTexts[currentLinePosition]) !== lastLine) {
					highlightError(currentLinePosition, lastLine.length);
					e.preventDefault();
					return;
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