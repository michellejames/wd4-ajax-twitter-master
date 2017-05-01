
var TwitterApi = (function(options) {
	var shared = {};
	var options = options || {};

	function processTimelineResults(results){

		var $apiResults = JSON.parse(results);
		console.log($apiResults);

		for (var i = 0; i < $apiResults.length; i++) {
			var timelineQuery = document.querySelector(".timeline-query");

			var screenName = document.createElement("div");
			$(screenName).html("@"+$apiResults[i].user.screen_name).addClass("screen-name");
			
			var tweetText = document.createElement("div");
			$(tweetText).html($apiResults[i].text).addClass("tweet");

			timelineQuery.appendChild(screenName);
			timelineQuery.appendChild(tweetText);
		}
	}

	function processHashtagResults(results) {

		var $apiResults = JSON.parse(results);
		console.log($apiResults.search_metadata.query);
		console.log($apiResults.statuses[0].user.screen_name);
		console.log($apiResults.statuses[0].user.text);

		for (var i = 0; i < $apiResults.length; i++) {

			var hashtagQuery = document.querySelector(".hashtag-query");

			var searchQuery = document.createElement("div");
			$(searchQuery).html("Query: "+$apiResults[i].search_metadata.query).addClass("hashtag");

			var screenName = document.createElement("div");
			$(screenName).html("@"+$apiResults.statuses[i].user.screen_name).addClass("screen-name");

			var hashtagTweet = document.createElement("div");
			$(hashtagTweet).html($apiResults[i].text);

			hashtagQuery.appendChild(screenName);
			hashtagQuery.appendChild(hashtagTweet);
			hashtagQuery.appendChild(searchQuery);
		}
	}

	var deleteResults = function () {

		var $timelineQuery = $(".timeline-query");
        var $screenName = $(".screen-name");
        var $tweetText = $(".tweet");

        for (var i = 0; i < $screenName.length; i++) {
          $screenName[i].parentNode.removeChild($screenName[i]);
          $tweetText[i].parentNode.removeChild($tweetText[i]);
        }
    }

	var init = function() {

		$("#submit-button").on("click", function (e) {
		    e.preventDefault();
		    deleteResults();
			$.ajax("twitter-proxy.php?op=user_timeline&screen_name=" + $('.timeline-search-field').val())
			.done(processTimelineResults)
		});

		$("#submit-hashtag-button").on("click", function (e) {
		    e.preventDefault();
		    deleteResults();
			$.ajax("twitter-proxy.php?op=search_tweets&q=" + $('.hashtag-search-field').val())
			.done(processHashtagResults)
		});
	};

	shared.init = init;
	return shared;
}());

TwitterApi.init();