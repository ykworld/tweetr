/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  function hover() {
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
  }

  function renderTweets(tweets) {
    // loops through tweets
      // calls createTweetElement for each tweet
      // takes return value and appends it to the tweets container
    tweets.forEach(function(tweet) {
      $(".container").append(createTweetElement(tweet));
    });
  }

  function createTweetElement(tweet) {
    let $tweet = $("<article>").addClass("tweet")
                  .append(
                      $("<header>")
                      .append($("<img>").addClass("logo").attr("src", tweet.user.avatars.small))
                      .append($("<span>").addClass("name").text(tweet.user.name))
                      .append($("<span>").addClass("id").text(tweet.user.handle))
                  ).append(
                      $("<section>")
                      .append($("<p>").text(tweet.content.text))
                  ).append(
                      $("<footer>")
                      .append($("<span>").addClass("date").text(jQuery.timeago(tweet.created_at)))
                      .append(
                              $("<div>").addClass("icons")
                                  .append(
                                    $("<a>")
                                    .append($("<img>").attr("src", "/images/symbol.png"))
                                  )
                                  .append(
                                    $("<a>")
                                    .append($("<img>").attr("src", "/images/arrows.png"))
                                  )
                                  .append(
                                    $("<a>")
                                    .append($("<img>").attr("src", "/images/like.png"))
                                  )
                              )
                  );

    return $tweet;
  }

  // get tweets data form server using ajax
  function loadTweets() {
    $.get("/tweets", (data) => {
      renderTweets(data);
    })
    .done(() => {
      hover();
    });
  }

  loadTweets();

  // Submit the form data to server
  $(".new-tweet form").on("submit", function(event) {
    event.preventDefault();
    $.post("/tweets", $(this).serialize())
     .done((data, status) => {
      console.log(status);
     })
     .fail((error) => {
       console.log(error.responseText);
     });
  });

});