const getCurrentImage = {
  "vk.com": () => {
    const imageDiv = document.getElementById("pv_photo");
    if (imageDiv) {
      return imageDiv.querySelector("img").src.slice(0);
    }
    return null;
  },
  "discord.com": () => {
    // Close sticker dialog bound to Ctrl+S immediately
    document.querySelector('[class^="stickerIcon"]').parentNode.parentNode.parentNode.click()

    const imageDiv = document.querySelector('[class^="imageWrapper"]');
    if (imageDiv){
      return imageDiv.getElementsByTagName("img")[0].src.split('?')[0];
    }
    return null;
  }
}

document.addEventListener("keydown", function(e) {
  if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      && e.keyCode == 83) {
    e.preventDefault();

    let downloadUrl = getCurrentImage[window.location.hostname]();

    if (downloadUrl) {
      chrome.extension.sendMessage({url: downloadUrl}, function() {});
    }
  }
}, false);
