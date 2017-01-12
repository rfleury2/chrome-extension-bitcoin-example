A friend of mine recently approached me with an idea for a Chrome extension to help manage his time on the internet.  At first I resisted.  I was hesitant to devote much time to learning how to create a Chrome extension - Chrome extensions are a relatively niche corner of web development and I suspected might not be worth the time to overcome the learning curve.  That's where I was wrong.  I figured learning the basics on building Chrome extensions would take many hours of hard work just to get started, serving up the motivation-killing mountain of esoteric issues that often come up when starting work with a new technology.  It's dead simple to get started building Chrome extensions.

![That was easier than I expected!](/img/easier_than_expected.jpg)

As a result, I decided to document my journey in order to encourage those interested in diving into the world of building Chrome extensions a head start to create their own.

### Building the file structure

There is very little configuration required to get a Chrome extension off the ground.  Google expects a file named ```manifest.json```, which contains a series of configuration options.  Here's a naked example Google provides:

```json
{
  "manifest_version": 2,

  "name": "Getting started example",
  "description": "This extension shows a Google Image search result for the current page",
  "version": "1.0",

  "browser_action": {
    "default_icon": "img/icon.png",
    "default_popup": "popup.html"
  },
  "permissions": [
    "activeTab",
    "https://ajax.googleapis.com/"
  ]
}
```
NOTE: I changed icon.png to img/icon.png to match my favored file structure

There are dozens of options to set - [see the full documentation](https://developer.chrome.com/extensions/manifest).  For this example, the browserAction->default_popup option loads a file called ```popup.html```, which serves as the application's main view.  The popup.html file acts as a standard web view in HTML, meaning I can load CSS files to style the popup, require external modules, and load the application's own logic implemented in JavaScript.  For app code, I created a file ```popup.js``` (I'll show this shortly).  Since files are loaded through their relative paths from popup.html, you can choose either to load popup.js only (and require packages and files from popup.js) or load them all individually directly from the HTML.

As an application gets larger, I recommend loading only popup.js and using it as a hub to link the rest of the application's files, but since this is just an example, it's easy enough to load all the files from the HTML view and keep all application logic in popup.js.

I created a directory /packages to load external code and /img to hold images.  I downloaded [jQuery from Google](https://developers.google.com/speed/libraries/#jquery), and added the file to the /packages directory.  I added an image at ```img/icon.png``` and a file ```popup.css``` for basic styling.  See the [full version on GitHub](https://github.com/rfleury2/chrome-extension-bitcoin-example)

```html
<head>
  ...
  <script src="packages/jquery-3.1.1.min.js"></script>
  <script src="popup.js"></script>
  <link rel="stylesheet" type="text/css" href="popup.css">
  ...
</head>
```

### Bitcoin rate finder example

Popup.js is the place to implement the application's logic.  I used jQuery and AJAX to implement some simple logic (also follow the numbered comments in the code):

1.  The application listens for the popup being activated
2.  The loaded application popup view has a button with id ```#get-rate-button``` bound to an event listener waiting for a button click
3.  When the button is clicked, an API call fires to [Bitcoin Average API](https://apiv2.bitcoinaverage.com/) requesting the conversion value of 1 Bitcoin in US Dollars
4.  When the information arrives back, the view replaces the button's value with the exchange rate in Dollars

```javascript
// 1. Listen for a page being loaded
$(document).on('DOMContentLoaded', function() {
  // 2. Once page loaded, listen for a click on the "Get Rate" button
  $('#get-rate-button').on('click', function() {
    // 3. Once clicked, ask API for the conversion rate
    $.ajax({
      url: "https://apiv2.bitcoinaverage.com/convert/global?from=BTC&to=USD&amount=1",
      method: 'get',
      // When the conversion rate comes back
      success: (response) => {
        // 4. Change the button text to the response price rounded to 2 digits and disable the button
        $('.button').text("$" + response.price.toFixed(2));
        $('.button').attr('disabled', 'disabled');
      }
    });
  });
});
```

![Chrome extension demo GIF](/img/bitcoin_rate_demo.gif)

### Loading extension to Chrome for testing

Adding a Chrome extension to your local version of Chrome is a quick and process.  First access the extensions page ```chrome://extensions``` and turn on "Developer mode" on the upper right section of the screen.  Then on the left side of the header, click "Load unpacked extension..." and once prompted with the finder, select the root directory of the Chrome extension.

Give it a refresh and you will see it in all its glory in the extensions bar.

![Success kid builds a Chrome extension](/img/success_kid.jpg)