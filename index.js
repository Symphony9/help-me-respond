var config = require("config")
var tools = require('./tools')
var i18n = require('i18n-nodejs')(config.lang, config.langFile);
var messages = require('./messages')

function http400(res, msg, headers) {
	if (!msg || msg == undefined) {
		msg = messages.BAD_REQUEST;
	}
	return rCode(400, res, msg, headers);
}

function http404(res, msg, headers) {
	if (!msg || msg == undefined) {
		msg = messages.NOT_FOUND;
	}
	return rCode(404, res, msg, headers);
}

function http403(res, msg, headers) {
	if (!msg || msg == undefined) {
		msg = messages.FORBIDDEN;
	}
	return rCode(403, res, msg, headers);
}

function http401(res, msg, headers) {
	if (!msg || msg == undefined) {
		msg = messages.UNAUTHENTICATED;
	}
	return rCode(401, res, msg, headers);
}

function http502(res, resp, body) {
	var code = 502;
	var headers = '';
	if (resp !== undefined && resp !== null) {
		code = resp.statusCode;
		headers = resp.headers;
	}
	return rCode(
		502,
		res,
		{ statusCode: code, message: body},
		headers
	);
}

function httpSuccess(res, msg, headers) {
	return rCode(200, res, msg, headers);
}

function http201(res, msg, headers) {
	return rCode(201, res, msg, headers);
}

function rCode(code, res, msg, headers) {
	var args = null

	res = res.status(code);
	if (headers && headers !== undefined) {
		headers['content-type'] = 'application/json';
		res = res.header(headers);
	} else {
		var headers = {'content-type': 'application/json'};
		res = res.header(headers);
	}

	if (code >= 400 && msg instanceof Error) {
		msg = msg.message.toString()
	}

	if(code == 502 && msg.message && msg.statusCode && msg.message instanceof Error) {
		msg.message = msg.message.message.toString()
	}

	if(tools.isJsonString(msg)) {
		var jsonObj = JSON.parse(msg)
		if(jsonObj.msg) {
			msg = jsonObj.msg
		}
		if(jsonObj.args) {
			args = jsonObj.args
		}
	}

	// friendly messages for users
	if(checkFriendly(msg)) {
		msg = {friendlyMessage : i18n.__(msg, args)}
	} else if(msg && msg instanceof Object){
		msg = {data: msg}
	} else if(code == 502) {
		if(checkFriendly(msg.message)){
			msg.friendlyMessage = i18n.__(msg.message, args)
			delete msg.message
		} else {
			msg.message = i18n.__(msg.message, args)
		}
	} else {
		msg = {message: i18n.__(msg, args)}
	}

	if(code >= 400) {
		if(!msg) {
			msg = ''
		}
		msg = {code: code, error: msg}
	}

	return res.json(msg);
}

function checkFriendly(msg) {
	if(config && config.friendlyMessages){
		return config.friendlyMessages.indexOf(msg) !== -1
	}
	return false
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
