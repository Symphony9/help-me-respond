let CONFIG = {};
let USER_DEFINED_MESSAGES = {};
let I18N = null;

try {
	CONFIG = require("../../config/default");
} catch (e) {
	CONFIG = require('./_default');
}

try {
	USER_DEFINED_MESSAGES = require('../../config/messages');
} catch (e) {
	USER_DEFINED_MESSAGES = require('./_messages');
}

if (CONFIG && CONFIG.lang && CONFIG.langFile) {
	I18N = require('i18n-nodejs')(CONFIG.lang, CONFIG.langFile);
}

const TOOLS = require('./tools');
const MESSAGES = require('./messages');

function checkMessage(msg, code) {
	if (!msg) {

		switch (code) {
		case 400:
			msg = MESSAGES.BAD_REQUEST;
			break;
		case 401:
			msg = MESSAGES.UNAUTHORIZED;
			break;
		case 403:
			msg = MESSAGES.FORBIDDEN;
			break;
		case 404:
			msg = MESSAGES.NOT_FOUND;
			break;
		}
	}
	return msg;
}

function http400(res, msg, headers) {
	msg = checkMessage(msg, 400);
	return rCode(400, res, msg, headers);
}

function http404(res, msg, headers) {
	msg = checkMessage(msg, 404);
	return rCode(404, res, msg, headers);
}

function http403(res, msg, headers) {
	msg = checkMessage(msg, 403);
	return rCode(403, res, msg, headers);
}

function http401(res, msg, headers) {
	msg = checkMessage(msg, 401);
	return rCode(401, res, msg, headers);
}

function httpSuccess(res, msg, headers) {
	return rCode(200, res, msg, headers);
}

function http200(res, msg, headers) {
	return rCode(200, res, msg, headers);
}

function http201(res, msg, headers) {
	return rCode(201, res, msg, headers);
}

function http204(res, msg, headers) {
	return rCode(204, res, msg, headers);
}

function rCode(code, res, msg, headers) {
	let args = null
	let stack = null;

	// if there is no code in the message, its probably error
	code = code ? code : 400;
	msg = msg ? msg : '';
	res.status(code);

	setHeaders(headers, res);
	//// RETRIEVE THE MESSAGE FROM ERR OBJECT
	if (code >= 400 && msg instanceof Error) {
		stack = msg.stack.split('\n');
		stack.splice(0, 1)
		msg = msg.message.toString();
	}

	// DECODE JSON STRING -> placeholders for localizaiton only
	if (TOOLS.isJsonString(msg)) {
		let jsonObj = JSON.parse(msg)
		if (jsonObj.msg) {
			msg = jsonObj.msg
		}
		if (jsonObj.args) {
			args = jsonObj.args
		}
	}

	// USER friendly message
	if (checkFriendly(msg)) {
		msg = {
			friendlyMessage: getMessage(msg, args)
		}
	} else if (msg && msg instanceof Object) {
		// DATA message
		if (CONFIG && !CONFIG.prefixNone) {
			msg = {
				data: msg
			}
		}
	} else {
		msg = {
			message: getMessage(msg, args),
			stack: stack
		}
	}

	if (code >= 400) {
		msg = {
			error: msg,
		}
	}
	if (msg.message == '') {
		return res.send();
	} else {
		return (CONFIG && CONFIG.disableJsonHeader) ? res.send(msg) : res.json(msg);
	}
}

/**
 * Does on of
 * 1. uses localization lib to translate the messages
 * 2. finds the message in user defined messages file
 * 3. returns messages as it is
 */
function getMessage(msg, args) {
	let result = null;
	if (I18N) {
		result = I18N.__(msg, args);
	}
	// we found translation for this msg in locales file
	if (result !== msg) {
		return result;
	}
	if (USER_DEFINED_MESSAGES[msg]) {
		return USER_DEFINED_MESSAGES[msg];
	}
	return msg;
}

function checkFriendly(msg) {
	if (CONFIG && CONFIG.friendlyMessages) {
		return CONFIG.friendlyMessages.indexOf(msg) !== -1
	}
	return false;
}

function setHeaders(headers, res) {
	headers = headers ? headers : {};
	if (CONFIG && !CONFIG.disableJsonHeader) {
		headers['content-type'] = 'application/json';
	}
	res.header(headers);
}

module.exports = {
	http400,
	http404,
	http403,
	http401,
	http200,
	http201,
	http204,
	httpSuccess,
	rCode
}
