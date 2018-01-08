const CONFIG = require("config")
const TOOLS = require('./tools')
const I18N = require('i18n-nodejs')(CONFIG.lang, CONFIG.langFile);
const MESSAGES = require('./messages')

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
}

function http400(res, msg, headers) {
	checkMessage(msg, code);
	return rCode(400, res, msg, headers);
}

function http404(res, msg, headers) {
	checkMessage(msg, code);
	return rCode(404, res, msg, headers);
}

function http403(res, msg, headers) {
	checkMessage(msg, code);
	return rCode(403, res, msg, headers);
}

function http401(res, msg, headers) {
	checkMessage(msg, code);
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

function http502(res, resp, body) {
	let code = 502;
	let headers = '';
	if (resp) {
		code = resp.statusCode;
		headers = resp.headers;
	}
	return rCode(
		502,
		res, {
			statusCode: code,
			message: body
		},
		headers
	);
}

function rCode(code, res, msg, headers) {
	let args = null
	let stack = null;

	// if there is no code in the message, its probably error
	code = code ? code : 400;
	// empty message is ok
	msg = msg ? msg : '';

	res = res.status(code);
	// if user set some headers
	if (headers && headers !== undefined) {
		if (!CONFIG.disableJsonHeader) {
			headers['content-type'] = 'application/json';
		}
		res = res.header(headers);
	} else {
		if (!CONFIG.disableJsonHeader) {
			let headers = {}
			headers['content-type'] = 'application/json';
			res = res.header(headers);
		}
	}

	if (code >= 400 && msg instanceof Error) {
		stack = msg.stack.split('\n');
		stack.splice(0, 1);
		msg = msg.message.toString();
	}

	if (code == 502 && msg.message && msg.statusCode && msg.message instanceof Error) {
		msg.message = msg.message.message.toString()
	}

	if (TOOLS.isJsonString(msg)) {
		let jsonObj = JSON.parse(msg)
		if (jsonObj.msg) {
			msg = jsonObj.msg
		}
		if (jsonObj.args) {
			args = jsonObj.args
		}
	}

	// friendly messages for users
	if (checkFriendly(msg)) {
		msg = {
			friendlyMessage: I18N.__(msg, args)
		}
	} else if (msg && msg instanceof Object) {
		if (CONFIG && !CONFIG.prefixNone) {
			msg = {
				data: msg
			}
		}
	} else if (code == 502) {
		if (checkFriendly(msg.message)) {
			msg.friendlyMessage = I18N.__(msg.message, args)
			delete msg.message
		} else {
			msg.message = I18N.__(msg.message, args)
		}
	} else {
		msg = {
			message: I18N.__(msg, args),
			stack: stack
		}
	}

	if (code >= 400) {
		if (!msg) {
			msg = {};
		}
		msg = {
			code: code,
			error: msg
		}
	}

	if (msg.message == '') {
		return res.send();
	} else {
		return CONFIG.disableJsonHeader ? res.send(msg) : res.json(msg);
	}
}

function checkFriendly(msg) {
	if (CONFIG && CONFIG.friendlyMessages) {
		return CONFIG.friendlyMessages.indexOf(msg) !== -1
	}
	return false;
}

module.exports = {
	http400,
	http404,
	http403,
	http401,
	http502,
	httpSuccess,
	rCode
}
