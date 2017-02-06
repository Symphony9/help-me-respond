## Help me respond

This is a simple response helper which should make you life a bit easier. It supports localization and friendly messages for users.

## Prerequisites for usage
Your project is a nodejs server based on Express or something similar. Help-me-respond uses the res object from Express, which represents the HTTP response that an Express app sends when it gets an HTTP request.

## Setup

* Install with

```
npm i help-me-respond --save
```

* Setup config

Create a config folder and put **default.json** in it. (more cool config setup at https://github.com/lorenwest/node-config).

You will need to add the following to your **default.json** file. File naming is up to you :) This is a basic setup for the i18n-nodejs - https://github.com/eslam-mahmoud/i18n-nodejs


    {
    	"lang": "en",
       	"langFile": "../../locales/locales.json"
    }

* Create the specified above locales folder and locales file and add some messages there.

```
{
	"NO_SHARING_WITH_YOURSELF": {
		"en": "You cannot share the link with yourslef"
	},
	"NOT_OWNER": {
		"en": "You are not the owner"
	}
}
```

* Setup friendly messages.

Some messages returned from the server are too technical for the user. So we would like to differentiate between those messages and user friendly messages. Simply add the following to your **default.json** configuration file. Now you can add message names in the friendlyMessages array.

    {
    	"friendlyMessages": [
    	]
    }


Once the message name is in the above array, the response will have a key **friendlyMessage** which makes it easy for front-end to differentiate between messages.

## API

**res** - Express res object

**msg** - string message, Error object, any other object

**headers** - array with http headers. If none provided the only header set by the library will be *Content-type*: *application/json*



#### http400(res, msg, headers)
returns HTTP response with 400 error code
If no message is specified will return message - BAD REQUEST


#### http404(res, msg, headers)
returns HTTP response with 404 error code
If no message is specified will return message - NOT FOUND


#### http403(res, msg, headers)
returns HTTP response with 403 error code
If no message is specified will return message - FORBIDDEN


#### http401(res, msg, headers)
returns HTTP response with 403 error code
If no message is specified will return message - UNAUTHENTICATED


#### http502(res, response, headers)
response - an Express response object
returns HTTP response with 502 error code

This can be used when you are quering third party API. E.g. You will receive an error reponse for you request. You can call this function with the original response object. This way you will differentiate between you own server errors and third party API problems


#### httpSuccess(res, msg, headers)
returns HTTP response with 200 success code


#### http201(res, msg, headers)
returns HTTP response with 201 success code


#### rCode(code, res, msg, headers)
general function to return any HTTP code you want


## Response examples

### Success messages
```
{
   "friendlyMessage": "I am a friendly successfull message"
}
```

```
{
  "message": "I am a very technical success message that users do not want to see"
}
```

### Error messages
```
{
  "code": 400,
  "error": {
    "friendlyMessage": "I am a friendly error message"
  }
}
```

```
{
  "code": 400,
  "error": {
    "message": "I am a very technical error message that users do not want to see"
  }
}
```
