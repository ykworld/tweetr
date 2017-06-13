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
    let $tweet = $("<article>").addClass("tweet");
    let $header = $("<header>");
    let $header_img = $("<img>").addClass("logo").attr("src", tweet.user.avatars.small);
    let $header_name = $("<span>").addClass("name").text(tweet.user.name);
    let $header_id = $("<span>").addClass("id").text(tweet.user.handle);
    let $section = $("<section>");
    let $section_content = $("<p>").text(tweet.content.text);
    let $footer = $("<footer>");
    let $footer_date = $("<span>").addClass("date").text(jQuery.timeago(tweet.created_at));
    let $footer_icon_group = $("<div>").addClass("icons");
    let $footer_icon_symbol_link = $("<a>");
    let $footer_icon_symbol_img = $("<img>").attr("src", "/images/symbol.png");
    let $footer_icon_arrow_link = $("<a>");
    let $footer_icon_arrow_img = $("<img>").attr("src", "/images/arrows.png");
    let $footer_icon_like_link = $("<a>");
    let $footer_icon_like_img = $("<img>").attr("src", "/images/like.png");

    $header.append($header_img).append($header_name).append($header_id);
    $section.append($section_content);
    $footer_icon_symbol_link.append($footer_icon_symbol_img);
    $footer_icon_arrow_link.append($footer_icon_arrow_img);
    $footer_icon_like_link.append($footer_icon_like_img);
    $footer_icon_group.append($footer_icon_symbol_link).append($footer_icon_arrow_link).append($footer_icon_like_link);
    $footer.append($footer_date).append($footer_icon_group);
    $tweet.append($header).append($section).append($footer);

    return $tweet;
  }

  //console.log(createTweetElement(data));

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