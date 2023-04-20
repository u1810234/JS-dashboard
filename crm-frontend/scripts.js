document.addEventListener("DOMContentLoaded", function () {
  const current__theme = localStorage.getItem("theme") || "theme__light";

  document.body.classList.add(current__theme);
});

const theme__switcher = document.querySelector(".theme__btn");

theme__switcher.addEventListener("click", function () {
  const active__icon = document.querySelector(".active");
  const inactive__icon = document.querySelector(".inactive");

  active__icon.classList.toggle("active");
  active__icon.classList.toggle("inactive");

  inactive__icon.classList.toggle("inactive");
  inactive__icon.classList.toggle("active");

  document.body.classList.toggle("theme__light");
  document.body.classList.toggle("theme__dark");
});
