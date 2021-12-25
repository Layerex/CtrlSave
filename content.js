function getElementByClassNameStart(classNameStart, node = document) {
  return node.querySelector(`[class^="${classNameStart}"]`);
}

function getElementsByClassNameStart(classNameStart, node = document) {
  return node.querySelectorAll(`[class^="${classNameStart}"]`);
}

// Return values:
// - null - nothing to download
// - "" - no manual downloading needed
const getCurrentElement = {
  "vk.com": () => {
    const storyVideo = document.getElementsByClassName("stories_video")[0];
    if (storyVideo) {
      return storyVideo.src;
    }
    const imageDiv = document.getElementById("pv_photo");
    if (imageDiv) {
      return imageDiv.querySelector("img").src.slice(0);
    }
    const gifVideo = document.getElementsByClassName("pages_gif_img")[0];
    if (gifVideo) {
      return gifVideo.src;
    }
    return null;
  },
  "discord.com": () => {
    // Close sticker dialog bound to Ctrl+S immediately
    getElementByClassNameStart(
      "stickerIcon"
    ).parentNode.parentNode.parentNode.click();

    const imageDivs = getElementsByClassNameStart("imageWrapper");
    for (let i = 0; i < imageDivs.length; ++i) {
      const imageDiv = imageDivs.item(i);
      if (imageDiv) {
        const image = imageDiv.getElementsByTagName("img")[0];
        if (image) {
          return image.src.split("?")[0];
        }
      }
    }

    const avatarContainer =
      getElementByClassNameStart("userPopout") ||
      getElementByClassNameStart("topSection");
    if (avatarContainer) {
      const avatarDiv = getElementByClassNameStart(
        "avatarStack",
        avatarContainer
      );
      if (avatarDiv) {
        const avatarUrl = avatarDiv.getElementsByTagName("img")[0].src;
        return avatarUrl.split("?")[0] + "?size=4096";
      }
    }

    return null;
  },
  "app.element.io": () => {
    document.getElementsByClassName("mx_ImageView_button_download")[0].click();
    return "";
  },
  "2ch.hk": () => {
    const imageDiv = document.getElementById("js-mv-main");
    if (imageDiv) {
      return imageDiv.getElementsByTagName("img")[0].src;
    }
  },
  "teddit.net": () => {
    const post = document.getElementById("post");
    const imageDiv = post.getElementsByClassName("image")[0];
    if (imageDiv) {
      const image = imageDiv.getElementsByTagName("img")[0];
      if (image) {
        return image.src;
      }
    }
    return null;
  },
};

// Sites, where video is undownloadable by regular means
const videoDownloadBlacklist = ["vk.com"];

function isVideoPlaying(video) {
  return (
    video.currentTime > 0 &&
    !video.paused &&
    !video.ended &&
    video.readyState > 2
  );
}

function getCurrentlyPlayingVideo() {
  const videos = document.getElementsByTagName("video");
  for (let i = 0; i < videos.length; ++i) {
    const video = videos.item(i);
    if (isVideoPlaying(video)) {
      if (video.src) {
        return video.src;
      } else {
        const sources = video.getElementsByTagName("source");
        for (source of sources) {
          if (source.src) {
            return source.src;
          }
        }
        return null;
      }
    }
  }
  return null;
}

document.addEventListener(
  "keydown",
  function(e) {
    if (
      (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
      e.keyCode == 83
    ) {

      let downloadUrl = null;
      if (getCurrentElement.hasOwnProperty(window.location.hostname)) {
        downloadUrl = getCurrentElement[window.location.hostname]();
      }
      if (downloadUrl === null) {
        downloadUrl = getCurrentlyPlayingVideo();
      }

      if (downloadUrl !== null) {
        e.preventDefault();
        if (downloadUrl !== "") {
          chrome.extension.sendMessage({ url: downloadUrl }, function() { });
        }
      }
    }
  },
  false
);
