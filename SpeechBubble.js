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
 * @param {HTMLElement} targetElement - Element that the speech bubble points to
 *	 if targetElement is null then a dialog bubble is used which doesn't point anywhere
 * @param {string} content - What the bubble will contain (html is ok).
 * @param {string} [additionalCSSClasses] The CSS class to add to the element.
 * @param {HTMLElement} [appendToElement=body] The element to which the SpeechBubble will actually be appended to. By default this is the `body` element.
 * @returns {HTMLElement} The Speech Bubble element.
 */
window.SpeechBubble = function(targetElement, content, additionalCSSClasses, appendToElement){
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

	var element;
	if (typeof jQuery !== "undefined" && targetElement instanceof jQuery) {
		element = targetElement[0];
	} else {
		element = targetElement;
	}
	var appendElm;
	if (typeof jQuery !== "undefined" && appendToElement instanceof jQuery) {
		appendElm = appendToElement[0];
	} else {
		appendElm = appendToElement;
	}

	var SpeechDiv = document.createElement('div');
	 
	if ( element === null){
		SpeechDiv.className = 'dialog-bubble-main';
	} else {
		SpeechDiv.className = 'speech-bubble-main speech-bubble-top';
	} 
	if (additionalCSSClasses) {
		SpeechDiv.className += ' '+ additionalCSSClasses;
	}
	
	SpeechDiv.innerHTML = content;
	var SpeechID;
	do {
		SpeechID='bubble-' + new Date().getTime();
	} while (document.getElementById(SpeechID));
	SpeechDiv.id = SpeechID;
	SpeechDiv.setAttribute("style", "");
	(appendElm || document.getElementsByTagName('body')[0]).appendChild(SpeechDiv);

	var SpeechStyle = document.createElement('style');
	document.getElementsByTagName('body')[0].appendChild(SpeechStyle);


	function doDialogPosition(){
		// Unset inline style.
		SpeechDiv.style.left = "";
		SpeechStyle.innerHTML =
				'#' + SpeechDiv.id + ' {' +
				'  position: fixed;' +
				'  top: 20px; left: 50%; ' +
				'  transform: translate(-50%, 0); transform: -webkit-translate(-50%, 0); transform: -ms-translate(-50%, 0)' +
				'}';
		
	}
	function DoAutoPosition() {
		
		var elmXY;
		if ( element !== null)
			elmXY = getOffset(element);
		else{
			doDialogPosition();
			return;
		}
		var speechX;
		var speechY;

		var elmWidth = (element.offsetWidth && element.offsetWidth > element.clientWidth) ? element.offsetWidth : element.clientWidth;
		var elmHeight = (element.offsetHeight && element.offsetHeight > element.clientHeight) ? element.offsetHeight : element.clientHeight;


		var targetPointerCoefficient = 0;
		if (SpeechDiv.clientWidth < element.clientWidth)
			speechX = elmXY.left + (element.clientWidth - SpeechDiv.clientWidth) / 2;
		else if (elmXY.left + SpeechDiv.clientWidth >= document.documentElement.clientWidth) {
			// If the size of the SpeechDiv is greater than the amount of space there is from
			// the beginning of the element to the edge of the page, the SpeechDiv must be moved closer to the left.
			speechX = document.documentElement.clientWidth - SpeechDiv.clientWidth;
			// If the SpeechDiv is larger that the viewport, let the SpeechBubble become taller.
			if (speechX < 0) {
				speechX = 0;
			}

			// Now, calculate how much the pointer should be moved to compensate for the new position of the SpeechDiv.
			targetPointerCoefficient = elmXY.left - speechX;
		} else
			speechX = elmXY.left;

		// Temporarily set the X coordinate of the SpeechDiv manually to correctly calculate the Y coordinate.
		SpeechDiv.style.left = speechX;

		if (elmXY.top + elmHeight + SpeechDiv.clientHeight + 23 > (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)) {
			var appliedClasses = SpeechDiv.className.split(' ');
			for ( var i = 0; i < appliedClasses.length; i++ ) {
				if (appliedClasses[i] == 'speech-bubble-top') {
					appliedClasses[i] = 'speech-bubble-bottom';
				}
			}
			SpeechDiv.className = appliedClasses.join(' ');

			speechY = elmXY.top - SpeechDiv.clientHeight - 23;
		} else {
			var appliedClasses = SpeechDiv.className.split(' ');
			for ( var i = 0; i < appliedClasses.length; i++ ) {
				if (appliedClasses[i] == 'speech-bubble-bottom') {
					appliedClasses[i] = 'speech-bubble-top';
				}
			}
			SpeechDiv.className = appliedClasses.join(' ');

			speechY = elmXY.top + elmHeight + 20;
		}
		if (speechY < 0) speechY = 0;

		// Unset inline style.
		SpeechDiv.style.left = "";


		SpeechStyle.innerHTML =
				'#' + SpeechDiv.id + ' {' +
				'  left: ' + speechX + 'px;' +
				'  top: ' + speechY + 'px;' +
				'}' +
				'#' + SpeechDiv.id + ':before {';
		if (SpeechDiv.clientWidth < elmWidth)
			SpeechStyle.innerHTML += '  left: ' + (targetPointerCoefficient + (SpeechDiv.clientWidth - 20) / 2 - 7) + 'px';
		else
			SpeechStyle.innerHTML += '  left: ' + (targetPointerCoefficient + elmWidth / 2 - 27) + 'px;';
		SpeechStyle.innerHTML +=
				'}' +
				'#' + SpeechDiv.id + ':after {';
		if (SpeechDiv.clientWidth < elmWidth)
			SpeechStyle.innerHTML += '  left: ' + (targetPointerCoefficient + (SpeechDiv.clientWidth - 20) / 2) + 'px';
		else
			SpeechStyle.innerHTML += '  left: ' + (targetPointerCoefficient + elmWidth / 2 - 20) + 'px;';
		SpeechStyle.innerHTML += '}';
	}


	DoAutoPosition();

	window.addEventListener('resize', DoAutoPosition, true);

	MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

	var observer;

	SpeechDiv.removeBubble = function() {
		// Remove all the listeners.
		window.removeEventListener('resize', DoAutoPosition, true);

		if (MutationObserver) {
			observer.disconnect();
		}

		try {
			SpeechStyle.parentNode.removeChild(SpeechStyle);
		} catch (e) {}
		try {
			SpeechDiv.parentNode.removeChild(SpeechDiv);
		} catch (e) {}

		for ( var i = 0; i < OpenSpeechBubbles.length; i++ ) {
			if (OpenSpeechBubbles[i] == SpeechDiv) {
				OpenSpeechBubbles.splice(i, 1);
			}
		}
	};

	// Check if MutationObserver is available.
	if (MutationObserver) {
		observer = new MutationObserver(function (mutations, observer) {

			var DontPosition = false;

			var applicableMutations = mutations.length;
			mutations.forEach(function(mutation) {
				if (mutation.target.tagName && mutation.target.tagName.toLowerCase() == "script") {
					DontPosition = true;
				} else if (mutation.target == SpeechDiv && mutation.type == "attributes"){
					DontPosition = true;
				} else {
					if (mutation.removedNodes && Array.prototype.slice.call(mutation.removedNodes).length > 0) {
						Array.prototype.slice.call(mutation.removedNodes).forEach(function(node) {
							if (node == SpeechDiv) {
								SpeechDiv.removeBubble();
								DontPosition = true;
							} else if (node == SpeechStyle) {
								DontPosition = true;
							}
						});
					}
					if (mutation.addedNodes && Array.prototype.slice.call(mutation.addedNodes).length > 0) {
						Array.prototype.slice.call(mutation.addedNodes).forEach(function(node) {
							if (node.tagName && node.tagName.toLowerCase() == "script") {
								DontPosition = true;
							}
						});
					}
				}
			});

			if (applicableMutations > 0 && !DontPosition) {
				DoAutoPosition();
			}
		});

		// define what element should be observed by the observer
		// and what types of mutations trigger the callback
		observer.observe(document, {
			childList: true,
			subtree: true,
			attributes: true,
			characterData: true
		});
	}
	SpeechDiv.DoAutoPosition = DoAutoPosition;

	OpenSpeechBubbles.push(SpeechDiv);

	return SpeechDiv;
};

window.OpenSpeechBubbles = [];
