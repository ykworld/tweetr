/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  $(".tweet").hover(
    function() {
      $(this).addClass("tweet_hover");
      $(this).children("header").addClass("tweet_header_hover");
      $(this).find(".icons").addClass("tweet_footer_hover");
    }, function() {
      $(this).removeClass("tweet_hover");
      $(this).children("header").removeClass("tweet_header_hover");
      $(this).find(".icons").removeClass("tweet_footer_hover");
    }
  );

});