const images = [
  "images/photo1.jpg",
  "images/photo2.jpg",
  "images/photo3.jpg",
  "images/photo4.jpg",
  "images/photo5.jpg",
  "images/photo6.jpg",
  "images/photo7.jpg",
  "images/photo8.jpg",
  "images/photo9.jpg"
  // Add as many as you like!
];

let currentIndex = 0;
let interval;
let startX = 0;
let isDragging = false;

const mainImage = document.getElementById("mainImage");
const previewContainer = document.getElementById("previewContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const spinner = document.getElementById("spinner");
const carousel = document.getElementById("carousel");

function updateMainImage(index) {
  currentIndex = index;
  showSpinner();

  const tempImg = new Image();
  tempImg.src = images[currentIndex];

  tempImg.onload = () => {
    mainImage.classList.remove("fade-slide");
    void mainImage.offsetWidth; // restart animation
    mainImage.src = tempImg.src;
    mainImage.classList.add("fade-slide");
    hideSpinner();

    const thumbnails = document.querySelectorAll(".preview-container img");
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === currentIndex);
    });
  };
}

function createPreviewThumbnails() {
  previewContainer.innerHTML = "";
  images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.addEventListener("click", () => {
      clearInterval(interval);
      updateMainImage(i);
      startAutoSlide();
    });
    previewContainer.appendChild(img);
  });
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateMainImage(currentIndex);
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  updateMainImage(currentIndex);
}

function startAutoSlide() {
  interval = setInterval(showNextImage, 5000);
}

function showSpinner() {
  spinner.style.display = "block";
}
function hideSpinner() {
  spinner.style.display = "none";
}

function addSwipeSupport() {
  // Mouse drag
  carousel.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  carousel.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    if (diff > 50) {
      clearInterval(interval);
      showPrevImage();
      startAutoSlide();
    } else if (diff < -50) {
      clearInterval(interval);
      showNextImage();
      startAutoSlide();
    }
    isDragging = false;
  });

  // Touch drag
  carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  carousel.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (diff > 50) {
      clearInterval(interval);
      showPrevImage();
      startAutoSlide();
    } else if (diff < -50) {
      clearInterval(interval);
      showNextImage();
      startAutoSlide();
    }
  });
}

// Init
createPreviewThumbnails();
updateMainImage(currentIndex);
startAutoSlide();
addSwipeSupport();

// Buttons
prevBtn.addEventListener("click", () => {
  clearInterval(interval);
  showPrevImage();
  startAutoSlide();
});
nextBtn.addEventListener("click", () => {
  clearInterval(interval);
  showNextImage();
  startAutoSlide();
});