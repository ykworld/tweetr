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
      // sort by date
      data = data.sort((a, b) => {
        return b.created_at - a.created_at;
      });
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

    // validation check
    let textarea = $(this).children("textarea");
    if (textarea.val() === "" || textarea.val() === null) {
      alert("Message is empty!");
      textarea.focus();
      return;
    } else if (textarea.val().length > 140) {
      alert("Message limit is 140");
      textarea.focus();
      return;
    }

    $.post("/tweets", $(this).serialize())
     .done((data, status) => {
      $(".container .tweet").remove();
      loadTweets();
     })
     .fail((error) => {
       console.log(error.responseText);
     });
  });

});