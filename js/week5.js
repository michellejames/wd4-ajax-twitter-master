
var RegexModule = (function() {
	var shared = {};

	function urlHighlight (text) {
		var urlRegex = /((http|ftp|https)?:\/\/\S+)/g;
		//console.log(urlRegex); //regex call
		var urlRegexCall = text.match(urlRegex); //calling regex on imported data
		//console.log(urlRegexCall); //result of regex call
		var defaultURL = text; //tweet itself, default value in case we don't have a link
		//console.log(defaultURL);
		if (urlRegexCall) {
			for (var i = 0; i < urlRegexCall.length; i++) {
			 defaultURL = text.replace(urlRegex, "<a href='"+ urlRegexCall[i] + "' target='_blank' style='color:white;'>" + urlRegexCall[i] + "</a>");
			}
		}
		return defaultURL;
	}

	function hashtagHighlight (text) {
		var hashtagRegex = /(\S*#\[[^\]]+\])|(\S*#\w+)/gi;
		var hashtagRegexCall = text.match(hashtagRegex);
		var defaultHashtag = text;
		if (hashtagRegexCall) {
			for (var i = 0; i < hashtagRegexCall.length; i++) {
			 defaultHashtag = text.replace(hashtagRegex, "<a href='https://twitter.com/search?src=typd&q"+ hashtagRegexCall[i] + "' target='_blank' style='color:white;'>" + hashtagRegexCall[i] + "</a>");
			}
		}
		return defaultHashtag;
	}

	function usernameHighlight (text) {
		var usernameRegex = /(\S*@\[[^\]]+\])|(\S*@\w+)/gi;
		var usernameRegexCall = text.match(usernameRegex);
		var defaultUsername = text;
		if (usernameRegexCall) {
			for (var i = 0; i < usernameRegexCall.length; i++) {
			 defaultUsername = text.replace(usernameRegex, "<a href='https://twitter.com/"+ usernameRegexCall[i] + "' target='_blank' style='color:white;'>" + usernameRegexCall[i] + "</a>");
			}
		}
		return defaultUsername;

	}
	function highlighTweets (text) {
		var urlHighlight = RegexModule.urlHighlight(text);
		var hashtagHighlight = RegexModule.hashtagHighlight(urlHighlight);
		var usernameHighlight = RegexModule.usernameHighlight(hashtagHighlight);

		return usernameHighlight;
	}

	shared = {
		urlHighlight: urlHighlight,
		hashtagHighlight: hashtagHighlight,
		usernameHighlight: usernameHighlight,
		highlighTweets: highlighTweets,

	}
	return shared;
}());

var GoogleModule = (function() {
	var shared = {};
	var map;

	function initMap() {
		var ccLatlng = {
			lat: 33.813415,
			lng: -84.361841,
		}  
	  	map = new google.maps.Map(document.getElementById('map'), {
	    	center: ccLatlng,
	    	zoom: 8
	  	});

	  createMarker("test",ccLatlng.lat, ccLatlng.lng);
    }

    function createMarker (tweet, lat, lng) {

    	var infowindow = new google.maps.InfoWindow ({
          content: tweet,
        });

    	var marker = new google.maps.Marker ({
          position: {lat:lat, lng:lng},
          map: map
        });

        marker.addListener ( "click", function () {
          infowindow.open ( map, marker );
        });
    }

   	shared = {
   		initMap: initMap,
	}
	return shared;

}());


var TwitterApi = (function(options) {
	var shared = {};

	function processTimelineResults(results){

		var $apiResults = JSON.parse(results);
		console.log($apiResults);

		for (var i = 0; i < $apiResults.length; i++) {
			var timelineQuery = document.querySelector(".timeline-query");

			var screenName = document.createElement("div");
			$(screenName).html("<a href='" + "@" +$apiResults[i].user.screen_name).addClass("screen-name");

			var tweetDate = document.createElement("div");
			$(tweetDate).html($apiResults[i].created_at).addClass("date");
			
			var tweetText = document.createElement("div");
			$(tweetText).html(RegexModule.highlighTweets($apiResults[i].text)).addClass("tweet");
			var markerText = RegexModule.highlighTweets($apiResults[i].text);

			if($apiResults[i].geo) {
				GoogleModule.createMarker(markerText, $apiResults[i].geo.coordinates[0], $apiResults[i].geo.coordinates[1]);
			} else {
				console.log("No geo coordinates");
			}

			timelineQuery.appendChild(screenName);
			timelineQuery.appendChild(tweetDate);
			timelineQuery.appendChild(tweetText);
		}
	}

	function processHashtagResults(results) {

		var $apiResults = JSON.parse(results);
		console.log($apiResults);
		console.log($apiResults.search_metadata.query);

		for (var i = 0; i < $apiResults.statuses.length; i++) {

			var hashtagQuery = document.querySelector(".hashtag-query");

			var searchQuery = document.createElement("div");
			$(searchQuery).html("Query: " + "<span style='color:red;'>" + $apiResults.search_metadata.query + "</span>").addClass("hashtag");

			var screenName = document.createElement("div");
			$(screenName).html("<a href='https://twitter.com/"+ $apiResults.statuses[i].user.screen_name + "' target='_blank' style='color:#55ACEE;'>" + "@" +$apiResults.statuses[i].user.screen_name + "</a>").addClass("screen-name");
			
			var tweetDate = document.createElement("div");
			$(tweetDate).html($apiResults.statuses[i].created_at).addClass("date");

			var hashtagTweet = document.createElement("div");
			$(hashtagTweet).html(RegexModule.highlighTweets($apiResults.statuses[i].text)).addClass("tweet");
			var markerText = RegexModule.highlighTweets($apiResults.statuses[i].text);

			if($apiResults.statuses[i].geo) {
				GoogleModule.createMarker(markerText, $apiResults.statuses[i].geo.coordinates[0], $apiResults.statuses[i].geo.coordinates[1]);
			} else {
				console.log("No geo coordinates");
			}


			hashtagQuery.appendChild(searchQuery);
			hashtagQuery.appendChild(screenName);
			hashtagQuery.appendChild(tweetDate);
			hashtagQuery.appendChild(hashtagTweet);
		}
	}

	function processCustomResults (results) {
		var $apiResults = JSON.parse(results);

		for (var i = 0; i < $apiResults.statuses.length; i++) {

			var customQuery = document.querySelector(".custom-query");

			var searchQuery = document.createElement("div");
			$(searchQuery).html("Query: " + $apiResults.search_metadata.query).addClass("hashtag");

			var screenName = document.createElement("div");
			$(screenName).html("<a href='https://twitter.com/"+ $apiResults.statuses[i].user.screen_name + "' target='_blank' style='color:#55ACEE;'>" + "@" +$apiResults.statuses[i].user.screen_name + "</a>").addClass("screen-name");
			
			var tweetDate = document.createElement("div");
			$(tweetDate).html($apiResults.statuses[i].created_at).addClass("date");

			var hashtagTweet = document.createElement("div");
			$(hashtagTweet).html(RegexModule.highlighTweets($apiResults.statuses[i].text)).addClass("tweet");
			var markerText = RegexModule.highlighTweets($apiResults.statuses[i].text);

			if($apiResults.statuses[i].geo) {
				GoogleModule.createMarker(markerText, $apiResults.statuses[i].geo.coordinates[0], $apiResults.statuses[i].geo.coordinates[1]);
			} else {
				console.log("No geo coordinates");
			}

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