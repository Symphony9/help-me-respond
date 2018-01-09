var assert = require('assert');
const HELP_ME_RESPOND = require('../index.js');
const ExpressResponse = require('../ExpressResponse');
const MESSAGES = require('../messages');
const FS = require('fs');

// simulating Express Response object
const RES = new ExpressResponse();
const DEFAULT_HEADERS = {
	'content-type': 'application/json'
}

const DUMMY_PROMISE_TEXT = 'REJECTED PROMISE';
const DUMMY_PROMISE = () => {
	return new Promise(function (resolve, reject) {
		reject(DUMMY_PROMISE_TEXT);
	});
}

const DUMMY_ERROR_TEXT = 'DUMMY ERROR';
const DUMMY_ERROR = () => {
	return new Promise(function (resolve, reject) {
		throw DUMMY_ERROR_TEXT;
	});
}

const DUMMY_ERROR_OBJECT_TEXT = 'DUMMY ERROR OBJECT';
const DUMMY_ERROR_OBJECT = () => {
	return new Promise(function (resolve, reject) {
		throw new Error(DUMMY_ERROR_OBJECT_TEXT);
	});
}

describe('Correct error response codes and messages', function () {
	it('400', function () {
		HELP_ME_RESPOND.http400(RES);
		assert.equal(RES.code, 400);
		assert.deepEqual(RES.headers, DEFAULT_HEADERS);

		let err = JSON.parse(RES.msg);
		assert.equal(err.error.message, MESSAGES.BAD_REQUEST);
	});

	it('400 - promise rejection', function () {
		DUMMY_PROMISE()
			.catch(e => {
				HELP_ME_RESPOND.http400(RES);
				assert.equal(e, DUMMY_PROMISE_TEXT);
				assert.equal(RES.code, 400);
				assert.deepEqual(RES.headers, DEFAULT_HEADERS);
				assert.equal(RES.stack, null);

				let err = JSON.parse(RES.msg);
				assert.equal(err.error.message, MESSAGES.BAD_REQUEST);
			})
	});

	it('400 - throwing error', function () {
		DUMMY_ERROR()
			.catch(e => {
				HELP_ME_RESPOND.http400(RES);
				assert.equal(e, DUMMY_PROMISE_TEXT);
				assert.equal(RES.code, 400, e);
				assert.deepEqual(RES.headers, DEFAULT_HEADERS);
				assert.equal(RES.stack, null);

				let err = JSON.parse(RES.msg);
				assert.equal(err.error.message, MESSAGES.BAD_REQUEST);
			})
	});


	it('400 - throwing Error object', function () {
		DUMMY_ERROR_OBJECT()
			.catch(e => {
				HELP_ME_RESPOND.http400(RES, e);
				assert.equal(RES.code, 400);
				assert.deepEqual(RES.headers, DEFAULT_HEADERS);
				assert.equal(RES.stack, null);

				let err = JSON.parse(RES.msg);
				assert.equal(err.error.message, MESSAGES.BAD_REQUEST);
				assert.notEqual(err.error.stack, null);
				assert.equal(Array.isArray(err.error.stack), true);
			})
	});

	it('400 - friendly messages', function () {

		FS.writeFileSync(__dirname + '/../' + '_default.json', JSON.stringify({
			friendlyMessages: ["TEST_ERR"]
		}), 'utf8');

		FS.writeFileSync(__dirname + '/../' + '_messages.json', JSON.stringify({
			"TEST_ERR": "error one"
		}), 'utf8');
		const messages = require('../_messages.json');
		HELP_ME_RESPOND.http400(RES, 'TEST_ERR');
		assert.equal(RES.code, 400);
		assert.deepEqual(RES.headers, DEFAULT_HEADERS);

		let m = JSON.parse(RES.msg);
		assert.equal(m.stack, undefined);
	});

	it('401', function () {
		HELP_ME_RESPOND.http401(RES);
		assert.equal(RES.code, 401);
		assert.deepEqual(RES.headers, DEFAULT_HEADERS);

		let err = JSON.parse(RES.msg);
		assert.equal(err.error.message, MESSAGES.UNAUTHORIZED);
	});

	it('403', function () {
		HELP_ME_RESPOND.http403(RES);
		assert.equal(RES.code, 403);
		assert.deepEqual(RES.headers, DEFAULT_HEADERS);

		let err = JSON.parse(RES.msg);
		assert.equal(err.error.message, MESSAGES.FORBIDDEN);
	});

	it('404', function () {
		HELP_ME_RESPOND.http404(RES);
		assert.equal(RES.code, 404);
		assert.deepEqual(RES.headers, DEFAULT_HEADERS);

		let err = JSON.parse(RES.msg);
		assert.equal(err.error.message, MESSAGES.NOT_FOUND);
	});
});
