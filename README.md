A friend of mine recently approached me with an idea for a Google Chrome extension to help manage his time on the internet.  I resisted at first.  I was hesitant to devote much time to learning how to create a Chrome extension - Chrome extensions are a relatively niche corner of web development world and I suspected might not be worth the time to overcome the learning curve.  I was wrong.

I figured learning the basics on building Chrome extensions would take many hours of hard work just to get started, and would inevitably serve up the motivation-killing mountain of esoteric errors that often come up when starting work with a new technology.  I quickly learned that getting a basic Chrome extension up and running was much easier than anticipated.

![That was easier than I expected!](/img/easier_than_expected.jpg)

I'm sharing my experience in order to show how simple it is to get started building a Chrome extension.  By following the steps in this tutorial, you will have a fully working Chrome extension.  You can find the full code for the sample [on Github](https://github.com/rfleury2/chrome-extension-bitcoin-example).

### Building the foundation

There is minimal configuration required to get a Chrome extension off the ground.  Chrome expects a file in the root directory of the application named ```manifest.json``` containing a series of configuration options.  Here's a naked example Google provides:

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
NOTE: I changed icon.png to img/icon.png to match my favored file structure (see below)

There are dozens of options to set - [see the full documentation](https://developer.chrome.com/extensions/manifest).  For the bare bones example, the "browser_action"->"default_popup" option loads a file called ```popup.html```, which will be the home for all subsequent logic and styling.  The popup.html file acts as any ordinary web html file, meaning I can load CSS files to style the popup, add JavaScript modules and the extension's own JavaScript logic.  All the files are loaded through relative paths from the popup.html file, so you can create your own directory structure for your extension's files.  I've decided to create a directory (/packages) to separate any external code from the application's own code.  I downloaded [jQuery from Google](https://developers.google.com/speed/libraries/#jquery), and added the file to the /packages directory.  I added an image at ```icon.png``` and a file ```popup.css``` for basic styling.  See the [full version on GitHub](https://github.com/rfleury2/chrome-extension-bitcoin-example)

Here's what the directory structure looks like:
```
.
├── README.md
├── img
│   ├── icon.png
├── manifest.json
├── packages
│   └── jquery-3.1.1.min.js
├── popup.css
├── popup.html
└── popup.js
```

And how to require the files in popup.html:
```html
<head>
  ...
  <script src="packages/jquery-3.1.1.min.js"></script>
  <script src="popup.js"></script>
  <link rel="stylesheet" type="text/css" href="popup.css">
  ...
</head>
```

### Implementing a Bitcoin rate finder

From time to time, I like to check in on the US Dollar to Bitcoin exchange rate.  What if instead of going to the Bitcoin exchange to find the exchange rate, I can quickly check using a Chrome extension?  Let's build an extension to give us the most recent Bitcoin to US Dollar exchange rate.

First, I added a button to popup.html to trigger a request for the latest rate:

```html
<body>
  ...
  <button class='button' id="get-rate-button"><i>get rate</i></button>
  ...
</body>
```

Popup.js is the place to implement the application's logic.  Below I've implemented some simple logic to request and display the exchange rate using jQuery and AJAX.  Here's roughly the logic (also follow the numbered comments in the code):

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

This is what it looks like once active:

![Chrome extension demo GIF](/img/bitcoin_rate_demo.gif)

### Loading extension to Chrome

Adding a Chrome extension to your local version of Chrome is a quick and process.  First access the extensions page ```chrome://extensions``` and turn on "Developer mode" on the upper right section of the screen.  Then on the left side of the header, click "Load unpacked extension..." and once prompted with the finder, select the root directory of the Chrome extension.

Give it a refresh and you will see it in all its glory in the extensions bar.

![Success kid builds a Chrome extension](/img/success_kid.jpg)