# Minimal HTTP library
Minimal simple API for HTTP with promises.  
Supports common methods GET, POST, PUT, PATCH, DELETE and JSON parsing.  
Under 100 SLOC.  

## Install

    npm install --save http.min

## Examples

### GET
```javascript
var http = require('http.min')
http.get('https://httpbin.org/get').then(function (result) {
  console.log('Code: ' + result.response.statusCode)
  console.log('Response: ' + result.data)
})
```

### POST
```javascript
var http = require('http.min')
http.post('https://httpbin.org/post', {data: 'hello'}).then(function (result) {
  console.log('Code: ' + result.response.statusCode)
  console.log('Response: ' + result.data)
})
```

Form urlencoded. Second `data` parameter is a string instead of an object.

```javascript
var http = require('http.min')
http.post('https://httpbin.org/post', 'data=hello').then(function (result) {
  console.log('Code: ' + result.response.statusCode)
  console.log('Response: ' + result.data)
})
```

### JSON
```javascript
var http = require('http.min')
http.json('https://httpbin.org/get').then(function (data) {
  console.log('Response:', data.url)
})
```

### Advanced
It accepts [http.request options][node-http-options]
```javascript
var http = require('http.min')
var options = {
  protocol: 'https:',
  hostname: 'httpbin.org',
  path: '/get',
  headers: {
    'User-Agent': 'Node.js http.min'
  }
}
http.json(options).then(function (data) {
  console.log('Response:', data)
})
```

## License
ISC


[node-http-options]: https://nodejs.org/api/http.html#http_http_request_options_callback
