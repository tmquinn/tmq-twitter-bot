var Twit = require('twit');
var RSVP = require('rsvp');

var TwitterBot = function (config) {
	"use strict";

	this.twit = new Twit(config);
};

var get = function (path, params, context) {
	"use strict";

	if (arguments.length === 2) {
		context = params;
		params = {};
	}

	return new RSVP.Promise(function (resolve, reject) {
		context.twit.get(path, params, function (err, response) {
			if (err) {
				reject(err);
			} else {
				resolve(response);
			}
		});
	});
};

var post = function (path, params, context) {
	"use strict";

	if (arguments.length === 2) {
		context = params;
		params = {};
	}

	return new RSVP.Promise(function (resolve, reject) {
		context.twit.post(path, params, function (err, response) {
			if (err) {
				reject(err);
			} else {
				resolve(response);
			}
		});
	});
};

TwitterBot.prototype = {

	rateLimitStatus: function () {
		"use strict";

		return get('application/rate_limit_status', this);
	},

	getSlugs: function () {
		"use strict";

		return get('users/suggestions', this);
	},

	suggestUsers: function (slug) {
		"use strict";

		return get('users/suggestions/' + slug, { slug: slug }, this);
	},

	getFriends: function () {
		"use strict";

		return get('friends/ids', this);
	},

	getFollowers: function () {
		"use strict";

		return get('followers/ids', this);
	},

	follow: function (idStr) {
		"use strict";

		return post('friendships/create', { user_id: idStr }, this);

	},

	retweet: function (idStr) {
		"use strict";

		return post('statuses/retweet/' + idStr, { id: idStr }, this);
	}
};

module.exports = TwitterBot;
