var url = require('url')
var http = require('http')
var https = require('https')
var querystring = require('querystring')

var HTTP = {}
var METHODS = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']

METHODS.forEach(function (method) {
  // https://nodejs.org/api/http.html#http_http_request_options_callback
  HTTP[method.toLowerCase()] = function (options, data) {
    return new Promise(function (resolve, reject) {
      if (data) {
        var isObject = typeof data === 'object'
        var headers = options.headers || (options.headers = {})
        if (!headers['content-type']) {
          headers['content-type'] = isObject ? 'application/json' : 'application/x-www-form-urlencoded'
        }
        if (isObject) {
          data = JSON.stringify(data)
        }
        headers['content-length'] = data.length
      }
      if (typeof options === 'string') {
        options = url.parse(options)
      } else if (options.query) {
        options.path += '?' + querystring.stringify(options.query)
      }
      options.method = method
      var module = options.protocol.replace(':', '') === 'https' ? https : http
      var req = module.request(options, function (response) {
        var data = ''
        response.setEncoding('utf8')
        response.on('data', function (chunk) {
          data += chunk
        })
        response.on('end', function () {
          resolve({
            data: data,
            response: response
          })
        })
      }).on('error', function (err) {
        reject(err)
      })
      if (data) {
        req.write(data)
      }
      req.end()
    })
  }
})

HTTP.json = function (options) {
  return this.get(options).then(function (result) {
    try {
      return JSON.parse(result.data)
    } catch (e) {
      return Promise.reject(e)
    }
  })
}

module.exports = HTTP
