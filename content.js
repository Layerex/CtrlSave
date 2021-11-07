const getCurrentImage = {
  "vk.com": () => {
    const storyVideo = document.getElementsByClassName("stories_video")[0];
    if (storyVideo) {
      return storyVideo.src;
    } else {
      const gifVideo = document.getElementsByClassName("pages_gif_img")[0];
      if (gifVideo) {
        return gifVideo.src;
      } else {
        const imageDiv = document.getElementById("pv_photo");
        if (imageDiv) {
          return imageDiv.querySelector("img").src.slice(0);
        }
      }
    }
    return null;
  },
  "discord.com": () => {
    // Close sticker dialog bound to Ctrl+S immediately
    document.querySelector('[class^="stickerIcon"]').parentNode.parentNode.parentNode.click()

    const imageDivs = document.querySelectorAll('[class^="imageWrapper"]');
    for (let i = 0; i < imageDivs.length; ++i) {
      const imageDiv = imageDivs.item(i)
      if (imageDiv){
        const image = imageDiv.getElementsByTagName("img")[0];
        if (image) {
          return image.src.split('?')[0];
        }
      }
    }
    return null;
  },
  "app.element.io": () => {
    const image = document.getElementsByClassName("mx_ImageView_image")[0];
    if (image) {
      return image.src;
    }
    return null;
  }
}

document.addEventListener("keydown", function(e) {
  if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      && e.keyCode == 83) {
    e.preventDefault();

    const downloadUrl = getCurrentImage[window.location.hostname]();

    if (downloadUrl) {
      chrome.extension.sendMessage({url: downloadUrl}, function() {});
    }
  }
}, false);
