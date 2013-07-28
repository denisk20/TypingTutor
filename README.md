TypingTutor
===========

JQuery plugin which allows to create typing tutor UI:

![TypingTutor](http://s14.postimg.org/x9q5aimvl/type.png)

Source elements are expected to look like that:
```html
  <div id='orig'>
		<p>this is a text to type</p>
		<p>it is not too difficult </p>
		<p>just to test</p>
	</div>
	<textarea id='t' cols="160" rows="6"></textarea>
	<div id="csp"></div>
	<div id ="err" style="color: red"></div>
	<button id="rst">Restart</button>
	<script type="text/javascript">
		var tut = $('#orig, #t').typingtutor({
			speedTrackCallback: function(speed){
				$('#csp').text('Current speed is ' + speed + ' characters per minute');
			},
			finishCallback: function(speed){
			    $('#csp').text('Average speed was ' + speed + ' characters per minute');
			},
			errorCallback: function(errorCount){
				$('#err').text('Errors: ' + errorCount);
			}
		});
		$('#rst').click(function(){
			tut.restart();
			$('#csp').text('');
			$('#err').text('');
		});
	</script>
```
