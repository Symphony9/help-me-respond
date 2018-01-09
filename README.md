## Help me respond

This is a simple response helper which should make you life a bit easier. It supports localization and friendly messages for users.
Help-me-respond pre-configures HTTP responses for you by setting the status code, processing the message and setting headers. You only need to call one of the API functions and pass the message in a form of a string or an object to it.

## UPDATES

08.01.2018

The library became lighter! :) I removed config library dependency in order to minimize dependencies, however you can still use it since the config folder structure I am following here is the same as for the [node-config](https://github.com/lorenwest/node-config);

The library is easier to configure. No need to configure anything :) Just start using it!

Localization became optional.

**BREAKING CHANGES**:

Removed *code* key from the error response message object. If u were using this, please use the code in the Express HTTP Response object.

Removed `http502`.


## Prerequisites for usage
Your project is a nodejs server based on Express or something similar. Help-me-respond uses the res object from Express, which represents an HTTP response.

## Setup

### Install with

```
npm i help-me-respond --save
```

*OPTIONAL*: Create *config/messages.json* file. We don't want our messages to be hardcoded in the code, so we will keep them in a separate file.

```
{
	"MESSAGE_NAME1": "Very long and important message text.",
    "MESSAGE_NAME2": "Very long and important message text2."  
}
```

## Configuration

All the configurations are put in **config/** folder in the root of your project.

### User friendly messages

Some messages returned from the server are too technical for the user. So we would like to differentiate between those messages and user friendly messages. Simply add the following to your **default.json** configuration file. Now you can add message names in the friendlyMessages array. See example below.

**config/messages.json**

    {
      "messageOne": "This is the first message",
      "messageTwo": "This is the second message"
    }

**config/default.json**

    {
    	"friendlyMessages": ["messageOne", "messageTwo"]
    }

Once the message name is in the above array, the response will have a key **friendlyMessage** which makes it easy for front-end to differentiate between messages.



### Localization

You will need to add the following to your **config/default.json** file. This is a basic setup for the i18n-nodejs - https://github.com/eslam-mahmoud/i18n-nodejs


    {
    	"lang": "en",
    	"langFile": "../../config/locales.json"
    }

*langFile* path is used in the library therefore, the path is relative to the *index.js* file from *help-me-respond* folder

* Create the specified above locales folder and locales file and add some messages there.

```
{
	"SHARING_ERROR": {
		"en": "You cannot share the link with yourself."
	},
	"NOT_OWNER": {
		"en": "You are not the owner."
	}
}
```

### Pass arguments to your messages

This works only if you are using localization.

**config/locales.json**

    {
      "welcome": "Welcome dear {{name}}",
    }

**somewhere in the code**

    http200(res, JSON.stringify({
      msg: 'welcome',
      args: {
        name: 'Mike'
      }
    }));

### Turn off data prefix
When you server returns any data, a prefix **data** is added to response.

You can turn it off by setting **prefixNone** to **true** in your config file. For more info about config see [Config setup](#config-setup) above.


### Turn off default 'application/json' header

Remove the default *application/json* header by setting **disableJsonHeader** to **true** in your config file. For more info about config see [Config setup](#config-setup) above.

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

#### http200(res, msg, headers)
returns HTTP response with 201 success code


#### http201(res, msg, headers)
returns HTTP response with 201 success code


#### http204(res, msg, headers)
returns HTTP response with 204 code


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
  "error": {
    "friendlyMessage": "I am a friendly error message"
  }
}
```

```
{
  "code": 400,
  "error": {
    "message": "I am a very technical error message that users do not want to see",
    "stack": [
      'at /Users/XX/Projects/help-me-respond/test/responseErrorTest.js:28:9',
      'at DUMMY_ERROR_OBJECT (/Users/Dasha/Projects/help-me-respond/test/responseErrorTest.js:27:9)',
      'at Context.<anonymous> (/Users/Dasha/Projects/help-me-respond/test/responseErrorTest.js:72:3)',
      'at callFn (/usr/local/Cellar/node/0.12.7/libexec/npm/lib/node_modules/mocha/lib/runnable.js:334:21)'
    ]    
  }
}
```

### Data response


```
{
  "data": {
    "item1": "name",
    "item2": "name"
  }
}
```
