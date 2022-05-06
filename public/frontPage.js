$(document).ready(function () {
  $("#startGame").on("click", function () {
    /* Hide the front page */
    $("#frontPage").hide();
    $("#mainBody").css("background-image", "none");
    $("#container").show();
  });
});