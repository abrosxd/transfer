window.addEventListener("load", function () {
  setTimeout(function () {
    var loaderDiv = document.querySelector(".loader");
    var loaderSquares = document.querySelectorAll(".loader-bg li");
    loaderSquares.forEach(function (square) {
      var randomDelay = Math.random() * 1000;
      setTimeout(function () {
        square.style.opacity = "0";
        square.style.visibility = "hidden";
      }, randomDelay);
    });

    setTimeout(function () {
      loaderDiv.style.display = "none";
    }, 1500);
  }, 500);
});
