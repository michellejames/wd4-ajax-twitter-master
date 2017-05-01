
var TwitterApi = (function(options) {
	var shared = {};

	function processTimelineResults(results){

		var $apiResults = JSON.parse(results);
		// console.log($apiResults);

		for (var i = 0; i < $apiResults.length; i++) {
			var timelineQuery = document.querySelector(".timeline-query");

			var screenName = document.createElement("div");
			$(screenName).html("@"+$apiResults[i].user.screen_name).addClass("screen-name");

			var tweetDate = document.createElement("div");
			$(tweetDate).html($apiResults[i].created_at).addClass("date");
			
			var tweetText = document.createElement("div");
			$(tweetText).html($apiResults[i].text).addClass("tweet");

			timelineQuery.appendChild(screenName);
			timelineQuery.appendChild(tweetDate);
			timelineQuery.appendChild(tweetText);
		}
	}

	function processHashtagResults(results) {

		var $apiResults = JSON.parse(results);
		// console.log($apiResults);

		for (var i = 0; i < $apiResults.statuses.length; i++) {

			var hashtagQuery = document.querySelector(".hashtag-query");

			var searchQuery = document.createElement("div");
			$(searchQuery).html("Query: " + $apiResults.search_metadata.query).addClass("hashtag");

			var screenName = document.createElement("div");
			$(screenName).html("@"+$apiResults.statuses[i].user.screen_name).addClass("screen-name");

			var tweetDate = document.createElement("div");
			$(tweetDate).html($apiResults.statuses[i].created_at).addClass("date");

			var hashtagTweet = document.createElement("div");
			$(hashtagTweet).html($apiResults.statuses[i].text).addClass("tweet");

			hashtagQuery.appendChild(searchQuery);
			hashtagQuery.appendChild(screenName);
			hashtagQuery.appendChild(tweetDate);
			hashtagQuery.appendChild(hashtagTweet);

		}
	}

	function processCustomResults (results) {
		var $apiResults = JSON.parse(results);
		console.log($apiResults);


		for (var i = 0; i < $apiResults.statuses.length; i++) {

			var customQuery = document.querySelector(".custom-query");

			var searchQuery = document.createElement("div");
			$(searchQuery).html("Query: " + $apiResults.search_metadata.query).addClass("hashtag");

			var screenName = document.createElement("div");
			$(screenName).html("@"+$apiResults.statuses[i].user.screen_name).addClass("screen-name");

			var tweetDate = document.createElement("div");
			$(tweetDate).html($apiResults.statuses[i].created_at).addClass("date");

			var hashtagTweet = document.createElement("div");
			$(hashtagTweet).html($apiResults.statuses[i].text).addClass("tweet");

			customQuery.appendChild(searchQuery);
			customQuery.appendChild(screenName);
			customQuery.appendChild(tweetDate);
			customQuery.appendChild(hashtagTweet);
		}
	}

	var deleteTimelineResults = function () {

		var $timelineQuery = $(".timeline-query");
        var $screenName = $(".screen-name");
        var $tweetDate = $(".date");
        var $tweetText = $(".tweet");

        for (var i = 0; i < $screenName.length; i++) {
          $screenName[i].parentNode.removeChild($screenName[i]);
          $tweetDate[i].parentNode.removeChild($tweetDate[i]);
          $tweetText[i].parentNode.removeChild($tweetText[i]);
        }
    }

	var deleteHashtagResults = function () {

		var $timelineQuery = $(".timeline-query");
        var $screenName = $(".screen-name");
        var $tweetDate = $(".date");
        var $tweetText = $(".tweet");
        var $hashtag = $(".hashtag");

        for (var i = 0; i < $screenName.length; i++) {
          $screenName[i].parentNode.removeChild($screenName[i]);
          $tweetDate[i].parentNode.removeChild($tweetDate[i]);
          $tweetText[i].parentNode.removeChild($tweetText[i]);
          $hashtag[i].parentNode.removeChild($hashtag[i]);
        }
    }

	var init = function() {

		$("#submit-button").on("click", function (e) {
		    e.preventDefault();
		    deleteTimelineResults();
			$.ajax("twitter-proxy.php?op=user_timeline&screen_name=" + $('.timeline-search-field').val())
			.done(processTimelineResults)
		});

		$("#submit-hashtag-button").on("click", function (e) {
		    e.preventDefault();
		    deleteHashtagResults();
			$.ajax("twitter-proxy.php?op=search_tweets&q=" + $('.hashtag-search-field').val())
			.done(processHashtagResults)
		});

		$("#submit-custom-search-button").on("click", function (e) {
		    e.preventDefault();
		    deleteHashtagResults();
			$.ajax("twitter-proxy.php?op=search_tweets&q=" + $('.custom-search-field').val()+"&count=" + $('.count-search-field').val()+"&result_type=" + $('.result-type-field').val())
			.done(processCustomResults)
		});
	};

	shared.init = init;
	return shared;
}());

TwitterApi.init();