/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  // Fake data taken from tweets.json
  const data = [
    {
      "user": {
        "name": "Newton",
        "avatars": {
          "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
          "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
          "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
        },
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": {
          "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
          "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
          "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
        },
        "handle": "@rd" },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "created_at": 1461113959088
    },
    {
      "user": {
        "name": "Johann von Goethe",
        "avatars": {
          "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
          "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
          "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
        },
        "handle": "@johann49"
      },
      "content": {
        "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
      },
      "created_at": 1461113796368
    }
  ];

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

  renderTweets(data);

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