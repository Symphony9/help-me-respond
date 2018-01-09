var assert = require('assert');
const HELP_ME_RESPOND = require('../index.js');
const ExpressResponse = require('../ExpressResponse');
// simulating Express Response object
const RES = new ExpressResponse();
const DEFAULT_HEADERS = {
	'content-type': 'application/json'
}
const SUCCESS_MESSAGE = 'My custom success message';
const FS = require('fs');

describe('Correct successful response codes and messages', function () {
	it('200', function () {
		HELP_ME_RESPOND.http200(RES);
		assert.equal(RES.code, 200);
		assert.deepEqual(RES.headers, DEFAULT_HEADERS);
		assert.equal(RES.msg, null);
	});

	it('200', function () {
		HELP_ME_RESPOND.http200(RES, SUCCESS_MESSAGE);
		assert.equal(RES.code, 200);
		assert.deepEqual(RES.headers, DEFAULT_HEADERS);

		let m = JSON.parse(RES.msg);
		assert.equal(m.message, SUCCESS_MESSAGE);
		assert.equal(m.stack, undefined);
	});

	it('200 - friendly messages', function () {
		const messages = require('../_messages.json');
		HELP_ME_RESPOND.http200(RES, 'TEST');
		assert.equal(RES.code, 200);
		assert.deepEqual(RES.headers, DEFAULT_HEADERS);

		let m = JSON.parse(RES.msg);
		assert.notEqual(m.friendlyMessage, null);
		assert.equal(m.stack, undefined);
	});

	it('200 - message params', function () {
		const messages = require('../_messages.json');
		HELP_ME_RESPOND.http200(RES, JSON.stringify({
			msg: 'welcome',
			args: {
				name: 'Mike'
			}
		}));
		assert.equal(RES.code, 200);
		assert.deepEqual(RES.headers, DEFAULT_HEADERS);

		let m = JSON.parse(RES.msg);
		assert.equal(m.message, 'Welcome Mike');
		assert.equal(m.stack, undefined);
	});


	it('201', function () {
		HELP_ME_RESPOND.http201(RES);
		assert.equal(RES.code, 201);
		assert.deepEqual(RES.headers, DEFAULT_HEADERS);
	});

	it('204', function () {
		HELP_ME_RESPOND.http204(RES);
		assert.equal(RES.code, 204);
		assert.deepEqual(RES.headers, DEFAULT_HEADERS);
	});
});
