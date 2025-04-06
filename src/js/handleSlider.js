document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".image-slider");
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  let currentIndex = 0;
  function showSlide(index) {
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }
    currentIndex = index;
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[currentIndex].classList.add("active");
  }
  function nextSlide() {
    showSlide(currentIndex + 1);
  }
  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
    });
  }
  showSlide(currentIndex);
});
