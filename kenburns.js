const imageInput = document.getElementById("image-input");
const imageWrap = document.getElementById("image-wrap");

let slideDurationInSecs = 10;
let slideDurationBufferInSecs = 5;
let fadeDurationInSecs = 1;
let possibleVerticalPositions = ["top", "center", "bottom"];
let possibleHorizontalPositions = ["left", "center", "right"];

// on dropping file(s)
imageInput.addEventListener("drop", (event) => {
  let setCSSVariablesOnImage = (
    image,
    horizontalPosition,
    verticalPosition
  ) => {
    image.style.setProperty("--vertical-position", verticalPosition);
    image.style.setProperty("--horizontal-position", horizontalPosition);
  };

  let showNextSlide = () => {
    let visibleImage = imageWrap.querySelector("img.visible");

    if (!visibleImage) {
      visibleImage = imageWrap.querySelector("img:first-of-type");
      visibleImage.classList.add("visible");
    } else {
      ((visibleImage) => {
        visibleImage.classList.add("fade-out");
        setTimeout(() => {
          visibleImage.classList.remove("fade-out");
        }, fadeDurationInSecs * 1000);
      })(visibleImage);
      visibleImage.classList.remove("visible");
      if (!visibleImage.nextElementSibling) {
        visibleImage = imageWrap.querySelector("img:first-of-type");
        visibleImage.classList.add("visible");
      } else {
        visibleImage.nextElementSibling.classList.add("visible");
      }
    }
  };

  setTimeout(() => {
    for (let file of imageInput.files) {
      let img = document.createElement("IMG");
      img.src = URL.createObjectURL(file);
      img.dataset.fileName = file.name;
      img.addEventListener("load", () => {
        let orientation = null;
        if (img.naturalWidth > img.naturalHeight) {
          orientation = "landscape";
        } else if (img.naturalWidth < img.naturalHeight) {
          orientation = "portrait";
        } else {
          orientation = "box";
        }
        img.classList.add(orientation);
      });

      imageWrap.appendChild(img);
      setCSSVariablesOnImage(
        img,
        possibleHorizontalPositions[
          Math.floor(Math.random() * possibleHorizontalPositions.length)
        ],
        possibleVerticalPositions[
          Math.floor(Math.random() * possibleVerticalPositions.length)
        ]
      );
    }
    showNextSlide();
  }, 500);

  setInterval(showNextSlide, slideDurationInSecs * 1000);
});
