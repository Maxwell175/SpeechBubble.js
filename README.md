# SpeechBubble.js

This library makes it easy to display a Speech Bubble above an element!

You may use this in your HTML using GitHub Pages Hosting.
```html
<script type="text/javascript" src="//mdtech-us-man.github.io/SpeechBubble.js/SpeechBubble.js"></script>
<link rel="stylesheet" href="//mdtech-us-man.github.io/SpeechBubble.js/SpeechBubble.css" />
```

There is a demo in the demo folder as well as a jsfiddle here: https://jsfiddle.net/t6Lqwxq2/

## Usage

#### Create a Speech Bubble
```javascript
var SpeechBubbleDiv = SpeechBubble(document.getElementById('MyElement'), 'This is my bubble's content.', 'MyBubbleClass');
```
The `SpeechBubble` function returns the `<div>` that it created and adds it to the `window.OpenSpeechBubbles` array.

#### Close a Speech Bubble
```javascript
SpeechBubbleDiv.removeBubble();
```
**NOTE:** The `.removeBubble()` function is the _ONLY_ correct way to remove the bubble.

#### Close all open Speech Bubbles
```javascript
OpenSpeechBubbles.forEach(function(bubble) { bubble.removeBubble(); });
```

## Dependencies
##### None. There are no dependencies.

## Contributions
##### To contribute to this repository, open an issue about the problem you would like to fix (if there isn't one already) and leave a message saying that you are working on it. When you finish your fix(es) on your fork, create a pull request.

## Things to note
* **The element you specify should have a fixed width.**  
   Otherwise, the bubble will end up pointing at the middle of the page.

* **If the specified element is a `<span>` that contains a phrase in a paragraph and the phrase wraps it appears that the bubble points somewhere to the side of the text. (Resize the jsfiddle)**   
   Solutions are welcome! See Contributions section.

* **For IE 8 support, please include the `addEventListener` polyfill.**  
   https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Compatibility

## Tested on
* **Chrome 49+**
* **Safari 9.1**
* **Firefox 45+**

It would be very helpful if you would open a `help wanted` issue to confirm that this works for earlier browsers.
