chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlMatches: '(vk.com|discord.com)' }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

function backgroundListener(message, sender, sendResponse) {
  chrome.downloads.download({url: message.url});
  sendResponse();
}

chrome.extension.onMessage.addListener(backgroundListener);
