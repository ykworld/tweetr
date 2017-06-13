$(document).ready(function() {
  $(".new-tweet textarea").keyup(function() {
    let limit = 140;
    let length = $(this).val().length;
    let curLength = limit-length;
    let counterElement = $(this).closest("form").find(".counter");

    $(counterElement).text(curLength);

    if (curLength < 0) {
      $(counterElement).css("color", "red");
    }
  });
});