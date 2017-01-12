A friend of mine recently approached me with an idea for a Chrome extension to help manage his time on the internet.  At first I was hesitant to devote any time to learning how to create a Chrome extension, expecting a reasonably steep learning curve for a niche skill.  I figured learning the basics of how to build Chrome extensions would take many hours of hard work and the typical set up headaches I usually get when diving into a new region of web development.  I was wrong.

Turns out, I was pleasantly surprised by how fast getting started was.  As a result, I decided to document my journey in order to encourage those interested in diving into the world of building Chrome extensions a head start to create their own.

### Structure of an extension

There is very little configuration required to get a Chrome extension off the ground.  Google expects a file named ```manifest.json```, which contains a series of configuration options.  Here's a naked example Google provides.

```json
{
  "manifest_version": 2,

  "name": "Getting started example",
  "description": "This extension shows a Google Image search result for the current page",
  "version": "1.0",

  "browser_action": {
    "default_icon": "icon.png",
    "default_popup": "popup.html"
  },
  "permissions": [
    "activeTab",
    "https://ajax.googleapis.com/"
  ]
}
```

There are dozens of options to set - [see the full documentation](https://developer.chrome.com/extensions/manifest).  For the bare bones example, the browserAction->default_popup option loads a file called ```popup.html```, which will be the home for all subsequent logic and styling.  The popup.html file acts as any other web html file, meaning I can load CSS files to style the popup, add JavaScript libraries and the extension's own JavaScript logic.  All the files are loaded through relative paths from the popup.html file, so you can create your own scaffold for your extension's files.  I've decided to create a directory (/packages) to load any external code and app code.  I downloaded [jQuery from Google](https://developers.google.com/speed/libraries/#jquery), and added the file to the /packages directory.  I added an image at ```icon.png``` and a file ```popup.css``` for basic styling.  See the [full version on GitHub](https://github.com/rfleury2/chrome-extension-bitcoin-example)


For app code, I created a file ```popup.js``` (I'll show this further down).  I can then require the files directly in the popup.html head section by using the relative path:

```html
<head>
  ...
  <script src="packages/jquery-3.1.1.min.js"></script>
  <script src="popup.js"></script>
  <link rel="stylesheet" type="text/css" href="popup.css">
  ...
</head>
```

Alternatively, you could load popup.js and require jQuery from there.  

### Bitcoin rate example implementation

In popup.js, there are a few things happening.  This is the place to implement any logic.  I've used jQuery and AJAX to get the exchange rate in dollars for 1 Bitcoin ([See Bitcoin Average API](https://apiv2.bitcoinaverage.com/)).  If the code doesn't look familiar, follow the comments:

```javascript
// Listen for a page being loaded
$(document).on('DOMContentLoaded', function() {
  // Once page loaded, listen for a click on the "Get Rate" button
  $('#get-rate-button').on('click', function() {
    // Once clicked, ask API for the conversion rate 
    $.ajax({
      url: "https://apiv2.bitcoinaverage.com/convert/global?from=BTC&to=USD&amount=1",
      method: 'get',
      // When the conversion rate comes back
      success: (response) => { 
        // Change the button text to the response price rounded to 2 digits and disable the button 
        $('.button').text("$" + response.price.toFixed(2));
        $('.button').attr('disabled', 'disabled');
      }
    });
  });
});
```

### Loading extension to Chrome for testing

Adding a Chrome extension to your local version of Chrome is quick and simple.  First access the extensions page ```chrome://extensions``` and turn on "Developer mode" on the upper right of the screen.  Then on the left side of the header, click "Load unpacked extension..." and select the root directory of the Chrome extension.

Give it a refresh and you will see it in all its glory in the extensions bar.

![Success kid builds a Chrome extension](/img/success_kid.jpg)