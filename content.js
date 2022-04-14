function getElementByClassNameStart(classNameStart, node = document) {
  return node.querySelector(
    `[class^="${classNameStart}"],[class*=" ${classNameStart}"]`
  );
}

function getElementsByClassNameStart(classNameStart, node = document) {
  return node.querySelectorAll(
    `[class^="${classNameStart}"],[class*=" ${classNameStart}"]`
  );
}

// Get first image in node
function getImage(node) {
  return node.getElementsByTagName("img")[0];
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
    const gifVideo = document.getElementsByClassName("pages_gif_img")[0];
    if (gifVideo) {
      return gifVideo.src;
    }
    const imageDiv = document.getElementById("pv_photo");
    if (imageDiv) {
      return getImage(imageDiv).src;
    }
    return null;
  },
  "discord.com": () => {
    function maxSizeAsset(url) {
      return url.split("?")[0] + "?size=4096";
    }

    function maxSizeImage(url) {
      const widthRegex = new RegExp("[?&]width=[0-9]+");
      const heightRegex = new RegExp("[?&]height=[0-9]+");
      return url.replace(widthRegex, "").replace(heightRegex, "");
    }

    // Close sticker dialog bound to Ctrl+S immediately
    getElementByClassNameStart(
      "stickerIcon"
    ).parentNode.parentNode.parentNode.click();

    const backdrop = getElementByClassNameStart("backdrop");
    if (backdrop) {
      const currentImageContainer = backdrop.parentNode;
      const image = getImage(currentImageContainer);
      return maxSizeImage(image.src);
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
        const avatarUrl = getImage(avatarDiv).src;
        return maxSizeAsset(avatarUrl);
      }
    }

    const emojiContainer =
      getElementByClassNameStart("emojiSection") ||
      getElementByClassNameStart("reactionTooltipInner");
    if (emojiContainer) {
      const emojiUrl = getImage(emojiContainer).src;
      return maxSizeAsset(emojiUrl);
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
      return getImage(imageDiv).src;
    }
    const videoDiv = document.getElementById("js-mv-player");
    if (videoDiv) {
      return videoDiv.getElementsByTagName("source")[0].src;
    }
  },
  "teddit.net": () => {
    const post = document.getElementById("post");
    const imageDiv = post.getElementsByClassName("image")[0];
    if (imageDiv) {
      const image = getImage(imageDiv);
      if (image) {
        return image.src;
      }
    }
    return null;
  },
};

// Sites, where videos are undownloadable by regular means
const videoDownloadBlacklist = ["vk.com", "2ch.hk"];

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
  function (e) {
    if (
      (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
      e.keyCode === 83
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
          chrome.extension.sendMessage({ url: downloadUrl }, function () {});
        }
      }
    }
  },
  false
);
