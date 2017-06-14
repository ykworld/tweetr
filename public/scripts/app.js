/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  // Apply animation effect when click compose button
  $(".compose").click(() => {
    $(".new-tweet").toggle("1s", function () {
      $(this).find('textarea').focus(); // auto focus when animation effect is done
    });
  });

  function renderTweets(tweets) {
    tweets.forEach((tweet) => {
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
                                  .append(
                                    $("<a>").addClass("delete")
                                    .append($("<img>").attr("src", "/images/delete.png"))
                                  )
                              )
                  );

    return $tweet;
  }

  function action() {
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

    $(".tweet .delete").click(function() {
      let handle = $(this).closest(".tweet").find(".id").text();
      $.post("/tweets?_method=DELETE", {handle: handle})
       .done((data, status) => {
        console.log(status);
        // Recreate DOM
        $(".container .tweet").remove();
        loadTweets();
       })
       .fail((error) => {
         console.log(error.responseText);
       });
    });
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
      // apply some style and jquery function after receiving data
      action();
    });
  }

  loadTweets();

  // Submit the form data to server
  $(".new-tweet form").on("submit", function(event) {
    event.preventDefault();

    // validation check
    let textarea = $(this).children("textarea");
    if (textarea.val() === "" || textarea.val() === null) { // NULL & EMPTY check
      alert("Message is empty!");
      textarea.focus();
      return;
    } else if (textarea.val().length > 140) { // Letter limit check
      alert("Message limit is 140");
      textarea.focus();
      return;
    }

    $.post("/tweets", $(this).serialize())
     .done((data, status) => {
      // Recreate DOM
      $(".container .tweet").remove();
      loadTweets();
     })
     .fail((error) => {
       console.log(error.responseText);
     });
  });

});