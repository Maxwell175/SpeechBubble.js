/*
 * Copyright (c) 2016 Maxwell Dreytser
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */


// If you would like IE 8 support, include the polyfill here: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Compatibility
/**
 * Adds a speech bubble above or below the specified element.
 * @param {HTMLElement} element - Element that the
 * @param {string} content - What the bubble will contain (html is ok).
 * @param {string} [additionalcssclass] The CSS class to add to the element.
 * @returns {HTMLElement} The Speech Bubble element.
 */
window.SpeechBubble = function(element, content, additionalcssclass){
	// http://stackoverflow.com/a/34014786/1610754 and http://stackoverflow.com/a/442474/1610754
	function getOffset(elm) {
		// Find the offset of elm from the body or html element
		var _x = 0;
		var _y = 0;
		while( elm && !isNaN( elm.offsetLeft ) && !isNaN( elm.offsetTop ) )
		{
			_x += elm.offsetLeft - elm.scrollLeft + elm.clientLeft;
			_y += elm.offsetTop - elm.scrollTop + elm.clientTop;
			elm = elm.offsetParent;
		}
		return { top: _y, left: _x };
	}


	var SpeechDiv = document.createElement('div');
	if (additionalcssclass) {
		SpeechDiv.className = 'speech-bubble-main speech-bubble-top ' + additionalcssclass;
	} else {
		SpeechDiv.className = 'speech-bubble-main speech-bubble-top';
	}
	SpeechDiv.innerHTML = content;
	SpeechDiv.setAttribute("style", "");
	document.getElementsByTagName('body')[0].appendChild(SpeechDiv);

	var SpeechStyle = document.createElement('style');
	document.getElementsByTagName('body')[0].appendChild(SpeechStyle);


	function DoAutoPosition() {
		var elmXY = getOffset(element);

		var speechX;
		var speechY;

		if (elmXY.top + element.clientHeight + SpeechDiv.clientHeight + 23 > (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)) {
			var appliedClasses = SpeechDiv.className.split(' ');
			for ( var i = 0; i < appliedClasses.length; i++ ) {
				if (appliedClasses[i] == 'speech-bubble-top') {
					appliedClasses[i] = 'speech-bubble-bottom';
				}
			}
			SpeechDiv.className = appliedClasses.join(' ');

			speechY = elmXY.top - SpeechDiv.clientHeight - 28;
		} else {
			var appliedClasses = SpeechDiv.className.split(' ');
			for ( var i = 0; i < appliedClasses.length; i++ ) {
				if (appliedClasses[i] == 'speech-bubble-bottom') {
					appliedClasses[i] = 'speech-bubble-top';
				}
			}
			SpeechDiv.className = appliedClasses.join(' ');

			speechY = elmXY.top + element.clientHeight + 18;
		}

		if (SpeechDiv.clientWidth < element.clientWidth)
			speechX = elmXY.left + (element.clientWidth - SpeechDiv.clientWidth) / 2;
		else
			speechX = elmXY.left;

		SpeechStyle.innerHTML =
			'.speech-bubble-main {' +
			'  left: ' + speechX + 'px;' +
			'  top: ' + speechY + 'px;' +
			'}' +
			'.speech-bubble-main:before {';
		if (SpeechDiv.clientWidth < element.clientWidth)
			SpeechStyle.innerHTML += '  left: ' + ((SpeechDiv.clientWidth - 20) / 2 - 7) + 'px';
		else
			SpeechStyle.innerHTML += '  left: ' + (element.clientWidth / 2 - 27) + 'px;';
		SpeechStyle.innerHTML +=
			'}' +
			'.speech-bubble-main:after {';
		if (SpeechDiv.clientWidth < element.clientWidth)
			SpeechStyle.innerHTML += '  left: ' + ((SpeechDiv.clientWidth - 20) / 2) + 'px';
		else
			SpeechStyle.innerHTML += '  left: ' + (element.clientWidth / 2 - 20) + 'px;';
		SpeechStyle.innerHTML += '}';
	}


	DoAutoPosition();

	window.addEventListener('resize', function(){
		DoAutoPosition();
	}, true);

	SpeechDiv.removeBubble = function() {
		SpeechStyle.parentNode.removeChild(SpeechStyle);
		SpeechDiv.parentNode.removeChild(SpeechDiv);

		for ( var i = 0; i < OpenSpeechBubbles.length; i++ ) {
			if (OpenSpeechBubbles[i] == SpeechDiv) {
				OpenSpeechBubbles.splice(i, 1);
			}
		}
	};

	OpenSpeechBubbles.push(SpeechDiv);

	return SpeechDiv;
};

window.OpenSpeechBubbles = [];