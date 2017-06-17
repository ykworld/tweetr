/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  // session connection check
  let user_id;

  function checksession() {
    $.get("/checksession", (session) => {
      if(session) {
        user_id = session.uid;
        $(".link-login").hide();
        $(".link-register").hide();
        $(".link-logout").show();
        $(".compose").show();
      } else {
        $(".link-login").show();
        $(".link-register").show();
        $(".link-logout").hide();
        $(".new-tweet").hide();
        user_id = "";
      }
    });
  }

  checksession();

  // Login
  $(".login").on("submit", function(event) {
    event.preventDefault();
    $.post("/users/login", $(this).serialize())
     .done((data, status) => {
        $(this).hide("slow");
        $(".link-login").hide();
        $(".link-register").hide();
        $(".link-logout").show();
        $(".compose").show();
        checksession();
        loadTweets();
     })
     .fail((error) => {
        let err = JSON.parse(error.responseText);
        alert(err.error);
        $(this).find("input[name='uid']").focus();
     });
  });

  // Register
  $(".register").on("submit", function(event) {
    event.preventDefault();
    $.post("/users", $(this).serialize())
     .done((data, status) => {
        $(this).hide("slow");
        $(".link-login").hide();
        $(".link-register").hide();
        $(".link-logout").show();
        checksession();
        loadTweets();
     })
     .fail((error) => {
        let err = JSON.parse(error.responseText);
        alert(err.error);
        $(this).find("input[name='uid']").focus();
     });
  });

  // Login button event
  $(".link-login").click(() => {
    $(".register").hide();
    $(".login").toggle("slow");
    $(".login input[name='uid']").focus();
  });

  // Logout button event
  $(".link-logout").click(() => {
    $.get("/destroysession", (session) => {
      $(".link-login").show();
      $(".link-register").show();
      $(".link-logout").hide();
      $(".new-tweet").hide();
      checksession();
    })
  });

  // Register button event
  $(".link-register").click(() => {
    $(".login").hide();
    $(".register").toggle("slow");
    $(".register input[name='uid']").focus();
  });

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
    // check like button click status
    let clicked = false;
    if (user_id !== undefined) {
      if(tweet.likes) {
        for (idx in tweet.likes) {
          if(tweet.likes[idx].uid === user_id) {
            clicked = true;
            break;
          }
        }
      }
    }

    let $tweet = $("<article>").addClass("tweet")
                  .append(
                    $("<input>").addClass("pid").attr("type", "hidden").attr("value", tweet._id)
                  )
                  .append(
                      $("<header>")
                      .append($("<img>").addClass("logo").attr("src", tweet.user.avatars.small))
                      .append($("<span>").addClass("name").text(tweet.user.name))
                      .append($("<span>").addClass("id").text("@" + tweet.user.handle))
                  ).append(
                      $("<section>")
                      .append($("<p>").text(tweet.content.text))
                  ).append(
                      $("<footer>")
                      .append($("<span>").addClass("date").text(jQuery.timeago(tweet.created_at)))
                      .append($("<span>").addClass("like-count").text(tweet.like_count))
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
                                    $("<a>").addClass("like")
                                    .append($("<img>").attr("src", "data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7").attr("data", clicked))
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
      $(this).closest(".tweet").hide('slow');
      let pid = $(this).closest(".tweet").find(".pid").val();
      $.post("/tweets?_method=DELETE", {pid: pid})
       .done((data, status) => {
        // Recreate DOM
        $(".container .tweet").remove();
        loadTweets();
       })
       .fail((error) => {
         console.log(error.responseText);
       });
    });

    $(".like").click(function(event) {
      let pid = $(this).closest(".tweet").find(".pid").val();
      let likecount = $(this).closest(".tweet").find(".like-count");
      let likeImage = $(this).find("img");
      let clicked = likeImage.attr("data");

      if (clicked === 'true') {
        clicked = 'false';
      } else {
        clicked = 'true';
      }

      likeImage.attr("data", clicked);

      $.ajax({
        type: 'PUT',
        url: "/tweets/like?_method=PUT", // A valid URL
        data: { pid: pid } // Some data e.g. Valid JSON as a string
      })
      .done((msg) => {
        // UI LIKE COUNT UPDATE
        $.get("/tweets/like/" + pid , (data) => {
          likecount.text(data.like_count);
        });
      })
      .fail((error) => {
        console.log(error.responseText);
      });
    });
  }

  // get tweets data form server using ajax
  function loadTweets() {
    // Recreate DOM
    $(".container .tweet").remove();
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
        loadTweets();
     })
     .fail((error) => {
        console.log(error.responseText);
     });
  });

});