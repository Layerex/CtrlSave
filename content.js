document.addEventListener("keydown", function(e) {
  if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      && e.keyCode == 83) {
    e.preventDefault();

    let download_url = null;

    let photo_div = document.getElementById("pv_photo");
    if (photo_div) {
      download_url = photo_div.querySelector("img").src;
    }

    if (download_url) {
      chrome.extension.sendMessage({url: download_url.slice(0)}, function() {});
    }
  }
}, false);
