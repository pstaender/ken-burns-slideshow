const imageInput = document.getElementById("image-files");
const imageWrap = document.getElementById("image-wrap");
const musicFile = document.getElementById("music-file");
const audioMusic = document.getElementById("audio-music");
const slideDuration = document.getElementById("slide-duration");
const showFilenames = document.getElementById("show-filenames");

const autoplayMode = document
  .querySelector("body")
  .classList.contains("autoplay");

let slideDurationBufferInSecs = 5;
let slideDurationInSecs = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue("--slide-duration")
  .trim();

if (slideDurationInSecs) {
  slideDurationInSecs =
    Number(String(slideDurationInSecs).replace(/s$/i, "")) -
    slideDurationBufferInSecs;
}

let fadeDurationInSecs = 1;
let possibleVerticalPositions = ["top", "center", "bottom"];
let possibleHorizontalPositions = ["left", "center", "right"];

let slideshowIntervalID = 0;

function setCSSVariablesOnImage(image, horizontalPosition, verticalPosition) {
  image.style.setProperty("--vertical-position", verticalPosition);
  image.style.setProperty("--horizontal-position", horizontalPosition);
}

function showNextOrPreviousSlide(direction) {
  let visibleImage = imageWrap.querySelector("img.visible");

  function showFilename(visibleImage) {
    document.getElementById("current-filename").innerText =
      visibleImage.dataset.fileName;
  }

  if (!visibleImage) {
    visibleImage = imageWrap.querySelector("img:first-of-type");
    visibleImage.classList.add("visible");
    showFilename(visibleImage);
    return;
  }

  ((visibleImage) => {
    visibleImage.classList.add("fade-out");
    setTimeout(() => {
      visibleImage.classList.remove("fade-out");
    }, fadeDurationInSecs * 1000);
  })(visibleImage);

  visibleImage.classList.remove("visible");

  if (direction === "next" && !visibleImage.nextElementSibling) {
    visibleImage = imageWrap.querySelector("img:first-of-type");
    visibleImage.classList.add("visible");
  } else if (direction === "previous" && !visibleImage.previousElementSibling) {
    visibleImage = imageWrap.querySelector("img:last-of-type");
    visibleImage.classList.add("visible");
  } else {
    visibleImage =
      direction === "next"
        ? visibleImage.nextElementSibling
        : visibleImage.previousElementSibling;
    visibleImage.classList.add("visible");
  }
  showFilename(visibleImage);
}

function showNextSlide() {
  showNextOrPreviousSlide("next");
}
function showPreviousSlide() {
  showNextOrPreviousSlide("previous");
}

function imagesLoadedCount() {
  let all = imageWrap.querySelectorAll("img").length;
  let loaded = imageWrap.querySelectorAll("img.loaded").length;
  let perc = Math.round(100 / all) * loaded;
  if (perc === 0) {
    // show a minimal progress
    document.querySelector("#progress-bar .progress").style.width = "5%";
  } else {
    document.querySelector("#progress-bar .progress").style.width = `${perc}%`;
  }
  return {
    all,
    notLoaded: imageWrap.querySelectorAll("img:not(.loaded)").length,
    loaded,
    perc,
  };
}

function initSlideshow(autoplayMode = false) {
  let files = imageInput.files;

  let applyImageOrientationAndAnimationOnLoad = (event) => {
    let img = event.target;
    let orientation = null;
    if (img.naturalWidth > img.naturalHeight) {
      orientation = "landscape";
    } else if (img.naturalWidth < img.naturalHeight) {
      orientation = "portrait";
    } else {
      orientation = "box";
    }
    img.classList.add("loaded");
    img.classList.add(orientation);
    setCSSVariablesOnImage(
      img,
      possibleHorizontalPositions[
        Math.floor(Math.random() * possibleHorizontalPositions.length)
      ],
      possibleVerticalPositions[
        Math.floor(Math.random() * possibleVerticalPositions.length)
      ]
    );
  };

  if (autoplayMode) {
    if (!imageWrap.querySelector("img")) {
      alert("Please add images to #image-wrap container first");
      return false;
    }
    imageWrap.querySelectorAll("img").forEach((img) => {
      img.addEventListener("load", applyImageOrientationAndAnimationOnLoad);
    });
    return true;
  }
  if (!files || !files.length) {
    alert("Please add images first");
    return false;
  }

  for (let file of files) {
    let img = document.createElement("IMG");
    img.src = URL.createObjectURL(file);
    img.dataset.fileName = file.name;
    img.addEventListener("load", applyImageOrientationAndAnimationOnLoad);

    imageWrap.appendChild(img);
  }
  return true;
}

function resetSlideshow() {
  document.querySelector("body").classList.remove("slideshow-running");
  imageWrap
    .querySelectorAll("img.visible")
    .forEach((img) => img.classList.remove("visible"));
}

function restartSlideshowInterval() {
  if (slideshowIntervalID) {
    clearInterval(slideshowIntervalID);
  }
  slideshowIntervalID = setInterval(showNextSlide, slideDurationInSecs * 1000);
}

function startSlideshow() {
  resetSlideshow();
  resumeSlideshow();
}

function resumeSlideshow() {
  document.querySelector("body").classList.add("slideshow-running");
  document.querySelector("body").classList.remove("show-config");
  if (audioMusic.duration > 0) {
    audioMusic.play();
  }
  // shows first slide
  showNextSlide();
  // starts slideshow interval
  restartSlideshowInterval();
}

function stopSlideshow() {
  document.querySelector("body").classList.remove("slideshow-running");
  if (slideshowIntervalID) {
    clearInterval(slideshowIntervalID);
    slideshowIntervalID = 0;
  }
}

function loadMusic() {
  // this timeout prevents not having files, yet
  setTimeout(() => {
    audioMusic.src = window.URL.createObjectURL(musicFile.files[0]);
  }, 500);
}

function changeSlideshowDuration(event) {
  slideDurationInSecs = Number(event.target.value);
  let value = slideDurationInSecs + slideDurationBufferInSecs + "s";
  document.documentElement.style.setProperty("--slide-duration", value);
  localStorage.setItem("slideDurationInSecs", slideDurationInSecs);
  document.getElementById("slide-duration-value").innerText =
    slideDurationInSecs + "s";
  if (document.querySelector("body").classList.contains("slideshow-running")) {
    restartSlideshowInterval();
  }
}

// on dropping music file
musicFile.addEventListener("drop", loadMusic);
musicFile.addEventListener("change", loadMusic);

document.getElementById("start-slideshow").addEventListener("click", () => {
  if (initSlideshow()) {
    startSlideshow();
  }
});

slideDuration.addEventListener("change", changeSlideshowDuration);
slideDuration.addEventListener("input", changeSlideshowDuration);

showFilenames.addEventListener("change", (event) =>
  document
    .querySelector("body")
    .classList[event.target.checked ? "add" : "remove"]("show-filenames")
);

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowRight": {
      showNextSlide();
      restartSlideshowInterval();
      break;
    }
    case "ArrowLeft": {
      showPreviousSlide();
      restartSlideshowInterval();
      break;
    }
    case "n": {
      showFilenames.checked = !showFilenames.checked;
      showFilenames.dispatchEvent(new Event("change"));
      break;
    }
    case "i": {
      document.querySelector("body").classList.toggle("show-config");
      break;
    }
    case "b": {
      document
        .querySelector("body")
        .classList.toggle("with-black-and-white-filter");
      break;
    }
    case " ": {
      if (
        document.querySelector("body").classList.contains("slideshow-running")
      ) {
        stopSlideshow();
      } else {
        resumeSlideshow();
      }
      break;
    }
  }
});

let applySettings = () => {
  let loadStoredSettings = true;
  let root = document.documentElement;
  let rootValues = window.getComputedStyle(root);
  let body = document.querySelector("body");
  let backgroundColor = rootValues
    .getPropertyValue("--color-background")
    .trim();
  if (loadStoredSettings) {
    backgroundColor =
      window.localStorage.getItem("backgroundColor") || backgroundColor;
    slideDurationInSecs =
      window.localStorage.getItem("slideDurationInSecs") || slideDurationInSecs;
    if (window.localStorage.getItem("showFilenames")) {
      body.classList.add("show-filenames");
      document.getElementById("show-filenames").checked = true;
    }
  }

  document.getElementById("background-color").value = backgroundColor;
  document.getElementById("background-color").dispatchEvent(new Event("input"));

  if (slideDurationInSecs) {
    slideDuration.value = slideDurationInSecs;
    slideDuration.dispatchEvent(new Event("change"));
  }
};

applySettings();

if (autoplayMode) {
  initSlideshow(true);
  document.querySelector("body").classList.remove("show-config");
  let audioMusicLoaded = audioMusic.src ? false : true;
  if (!audioMusicLoaded) {
    audioMusic.addEventListener("canplaythrough", () => {
      audioMusicLoaded = true;
    });
  }
  let checkProgressIntervalID = setInterval(() => {
    let { perc, loaded } = imagesLoadedCount();
    let isReady = false;
    let start = () => (isReady ? startSlideshow() : false);
    if (loaded > 2 && audioMusicLoaded) {
      // start slideshow if more than 2 images are loaded
      isReady = true;
    }

    if (perc >= 99 && audioMusicLoaded) {
      perc = 100;
      clearInterval(checkProgressIntervalID);
      document.querySelector("#progress-bar").classList.add("invisible");
      isReady = true;
    }
    if (isReady) {
      //src="./test.mp3"
      if (!audioMusic.src) {
        start();
        return;
      }
      document.querySelector("body").classList.add("ready");
    }
    document.addEventListener("click", start, { once: true });
  }, 500);
}
