wd4-ajax-twitter
================

Twitter API for WebDev4: AJAX
-----------------------------


A simple API for interacting with the Twitter API.  The goal is to teach the fundamental interaction patterns with the common web APIs, as well as sound Javascript/jQuery programming concepts.

***NOTE**: this code is meant for instructional purposes only, to highlight key interaction concepts when working with AJAX and web APIs.  It has not be secured for any kind of production use, and is thus inherently vulnerable to all manner of common web attacks.  Please take all the standard precautions as you would with any real application.*

## Interface

Call the desired method using the query parameter **op**, as in:

	?op=user_timeline&username=screen_name&count=10

All other query arguments will be passed through to the Twitter API.

## Parameters (op=?)

#### search($options)

API: <https://dev.twitter.com/rest/reference/get/search/tweets>

Expected $options arguments:

* q *(required)*
* count
* result_type

#### user_timeline($options)

API: <https://dev.twitter.com/rest/reference/get/statuses/user_timeline>

Expected $options arguments:

* screen_name *(required)*

#### user_search($options)

API: <https://dev.twitter.com/rest/reference/get/users/search>

Expected $options arguments:

* q *(required)*

