var Twit = require('twit');
var RSVP = require('rsvp');

var TwitterBot = function (config) {
	"use strict";

	this.twit = new Twit(config);
};

TwitterBot.prototype = {

	rateLimitStatus: function () {
		"use strict";

		return new RSVP.Promise(function (resolve, reject) {
			this.twit.get('application/rate_limit_status', {}, function (err, response) {
				if (err) {
					reject(err);
				} else {
					resolve(response);
				}
			});
		}.bind(this));
	},

	getSlugs: function () {
		"use strict";

		return new RSVP.Promise(function (resolve, reject) {
			this.twit.get('users/suggestions', {}, function (err, response) {
				if (err) {
					reject(err);
				} else {
					resolve(response);
				}
			});
		}.bind(this));
	},

	suggestUsers: function (slug) {
		"use strict";

		return new RSVP.Promise(function (resolve, reject) {
			this.twit.get('users/suggestions/' + slug,
				{ slug: slug },
				function (err, response) {
					if (err) {
						reject(err);
					} else {
						resolve(response);
					}
				});
		}.bind(this));
	},

	getFriends: function (callback) {
		"use strict";

		this.twit.get('friends/ids', {}, callback || logResponse);
	},

	follow: function (idStr) {
		"use strict";

		return new RSVP.Promise(function (resolve, reject) {
			this.twit.post('friendships/create',
				{ user_id: idStr },
				function (err, response) {
					if (err) {
						reject(err);
					} else {
						resolve(response);
					}
				}
			);
		}.bind(this));

	},

	retweet: function (idStr, callback) {
		"use strict";

		this.twit.post('statuses/retweet/' + idStr, { id: idStr }, callback || logResponse);
	},

	retweetMostRecentPhoto: function () {
		"use strict";

		this.twit.get('statuses/home_timeline', { count: 5 }, function (err, response) {
			var i, j,
				photoTweet;

			for (i = 0; i < response.length; i++) {
				var media = response[i].entities.media;

				for (j = 0; j < media.length; j += 1) {
					if (media[j].type === 'photo') {
						photoTweet = response[i].id_str;
						break;
					}
				}

				if (photoTweet) {
					break;
				}
			}

			if (photoTweet) {
				console.log('Found Photo Tweet: ' + photoTweet);
				twit.post('statuses/retweet/' + photoTweet, { id: photoTweet }, logResponse);
			} else {
				console.log('None Found');
			}
		});
	},

	addNewUsers: function (howMany, searchTerm) {
		"use strict";

		//Do user search
		this.twit.get('users/search', { q: searchTerm }, function (err, response) {

			var newUserCount = 0;
			var newUsers = [];

			response.forEach(function (user) {
				if (!user.following && (newUserCount < howMany)) {
					// Add user as follow
					this.twit.post('friendships/create', { user_id: user.id }, logResponse);

					newUsers.push(user.name);
					newUserCount += 1;
				}
			});

			console.log('Added the following users: ' + newUsers);
		});
	}
};

module.exports = TwitterBot;
