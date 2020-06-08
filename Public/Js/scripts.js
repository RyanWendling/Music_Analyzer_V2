let mainNav = document.getElementById("js-menu");
let navBarToggle = document.getElementById("js-navbar-toggle");

navBarToggle.addEventListener("click", function() {
  mainNav.classList.toggle("active");
});

let prevBtn = document.getElementById("prevButton");
let nextBtn = document.getElementById("nextButton");

// Logic to asertain current page number and either increment, or decrement it
prevBtn.addEventListener("click", function() {
  const urlParams = new URLSearchParams(window.location.search);
  let myParam = urlParams.get("page");
  if (myParam === null || myParam === "0") {
    location.href = "";
  } else {
    myParam = parseInt(myParam) - 1;
    location.href = "?page=" + myParam.toString();
  }
});

nextBtn.addEventListener("click", function() {
  const urlParams = new URLSearchParams(window.location.search);
  let myParam = urlParams.get("page");
  if (myParam === null || myParam === "0") {
    location.href = "?page=" + 1;
  } else {
    myParam = parseInt(myParam) + 1;
    location.href = "?page=" + myParam.toString();
  }
});
