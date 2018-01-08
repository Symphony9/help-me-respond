/**
 * Mocking Express Response Object
 * official docs at http://expressjs.com/en/api.html#res
 */

class ExpressResponse {
	/**
	 * Sets the HTTP status for the response.
	 */
	status(code) {
		this.code = code;
	}

	/**
	 * Sets the response’s HTTP header
	 */
	header(headers) {
		this.headers = headers;
	}

	/**
	 * Sends a JSON response. This method sends a response (with the correct content-type) that is the parameter converted to a JSON string using JSON.stringify().
	 */
	json() {
		this.msg = JSON.stringify(msg);
		this.headers['Content-type'] = 'application/json';
	}

	/**
	 * Sends the HTTP response.
	 */
	send() {
		console.log('Response sent');
	}

}
module.exports = ExpressResponse;
