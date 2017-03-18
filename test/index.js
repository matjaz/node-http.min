/* eslint-env mocha */

var http = require('../')
var nock = require('nock')
var expect = require('expect.js')

describe('default export', function () {
  it('should equal to get', function () {
    expect(http).to.equal(http.get)
  })
})

describe('built-in methods', function () {
  it('should exists', function () {
    var methods = ['head', 'options', 'get', 'put', 'patch', 'post', 'delete']
    methods.forEach(function (method) {
      expect(http[method]).to.be.a('function')
    })
  })
})

describe('simple requests', function () {
  it('GET should return response', function () {
    nock('http://example.com')
      .get('/test')
      .reply(200, 'ok')
    return http.get('http://example.com/test').then(function (result) {
      expect(result.response.statusCode).to.equal(200)
      expect(result.data).to.equal('ok')
    })
  })

  describe('POST should send', function () {
    it('JSON data', function () {
      nock('http://example.com')
        // .matchHeader('content-type', 'application/json')
        // .matchHeader('content-length', '13')
        .post('/test', {
          test: 'ok'
        })
        .reply(201, ':)')
      return http.post('http://example.com/test', {test: 'ok'}).then(function (result) {
        expect(result.response.statusCode).to.equal(201)
        expect(result.data).to.equal(':)')
      })
    })

    it('urlencoded data', function () {
      nock('http://example.com')
        // .matchHeader('content-type', 'application/x-www-form-urlencoded')
        // .matchHeader('content-length', '13')
        .post('/test', 'test=ok')
        .reply(201, ':)')
      return http.post('http://example.com/test', 'test=ok').then(function (result) {
        expect(result.response.statusCode).to.equal(201)
        expect(result.data).to.equal(':)')
      })
    })
  })
})

describe('Advanced requests', function () {
  it('should add headers', function () {
    nock('https://example.com')
      .matchHeader('x-test', 'yes')
      .matchHeader('content-type', 'application/octet-stream')
      // .matchHeader('content-length', '13')
      .post('/test', 'test=1')
      .reply(201, 'ok')
    var options = {
      protocol: 'https:',
      host: 'example.com',
      path: '/test',
      headers: {
        'content-type': 'application/octet-stream',
        'X-Test': 'yes'
      }
    }
    return http.post(options, 'test=1').then(function (result) {
      expect(result.response.statusCode).to.equal(201)
      expect(result.data).to.equal('ok')
    })
  })

  it('should add query', function () {
    nock('https://example.com')
      // .matchHeader('content-length', '6')
      .post('/test', 'test=1')
      .query({q: 'test'})
      .reply(201, 'ok')
    var options = {
      protocol: 'https:',
      host: 'example.com',
      path: '/test',
      query: {
        q: 'test'
      }
    }
    return http.post(options, 'test=1').then(function (result) {
      expect(result.response.statusCode).to.equal(201)
      expect(result.data).to.equal('ok')
    })
  })

  it('should not add query if empty object', function () {
    nock('https://example.com')
      .post('/', 'test=1')
      .reply(201, 'ok')
    var options = {
      protocol: 'https:',
      host: 'example.com',
      path: '/',
      query: {}
    }
    return http.post(options, 'test=1').then(function (result) {
      expect(result.response.statusCode).to.equal(201)
      expect(result.data).to.equal('ok')
    })
  })

  it('should handle uri option', function () {
    nock('https://example.com')
      .post('/test', 'test=2')
      .query({q: 'test'})
      .reply(201, 'ok')
    var options = {
      uri: 'https://example.com/test',
      query: {
        q: 'test'
      }
    }
    return http.post(options, 'test=2').then(function (result) {
      expect(result.response.statusCode).to.equal(201)
      expect(result.data).to.equal('ok')
    })
  })

  it('should handle form option', function () {
    nock('https://example.com')
      .post('/test', 'test=ok')
      .reply(201, 'okk')
    var options = {
      uri: 'https://example.com/test',
      form: {
        test: 'ok'
      }
    }
    return http.post(options).then(function (result) {
      expect(result.response.statusCode).to.equal(201)
      expect(result.data).to.equal('okk')
    })
  })

  it('should handle form & parse JSON', function () {
    nock('https://example.com')
      .post('/test', 'data=test')
      .reply(200, '{"test":"ok"}')
    var options = {
      uri: 'https://example.com/test',
      form: {
        data: 'test'
      },
      json: true
    }
    return http.post(options).then(function (result) {
      expect(result.response.statusCode).to.equal(200)
      expect(result.data).to.eql({
        test: 'ok'
      })
    })
  })
})

describe('JSON', function () {
  it('should handle json option', function () {
    nock('https://example.com')
      .matchHeader('accept', 'application/json')
      .post('/test', {test: 'ok'})
      .reply(200, '{"test":"ok"}')
    var options = {
      uri: 'https://example.com/test',
      json: true
    }
    return http.post(options, {test: 'ok'}).then(function (result) {
      expect(result.response.statusCode).to.equal(200)
      expect(result.data).to.eql({
        test: 'ok'
      })
    })
  })

  it('should handle json object option', function () {
    nock('https://example.com')
      .matchHeader('accept', 'application/json')
      .post('/test', {data: true})
      .reply(200, '{"test":"ok"}')
    var options = {
      uri: 'https://example.com/test',
      json: {
        data: true
      }
    }
    return http.post(options).then(function (result) {
      expect(result.response.statusCode).to.equal(200)
      expect(result.data).to.eql({
        test: 'ok'
      })
    })
  })

  it('should parse response', function () {
    nock('http://example.com')
      .get('/json')
      .reply(200, '{"test":"ok"}')
    return http.json('http://example.com/json').then(function (data) {
      expect(data).to.eql({
        test: 'ok'
      })
    })
  })

  it('should return error on invalid response', function () {
    nock('http://example.com')
      .get('/json')
      .reply(200, 'invalid')
    return http.json('http://example.com/json').catch(function (err) {
      expect(err.name).to.equal('SyntaxError')
      expect(err.message).to.contain('Unexpected token i')
    })
  })
})

describe('errors', function () {
  it('should be handled', function () {
    nock('http://example.com')
     .get('/test')
     .replyWithError('nooooo')
    return http.json('http://example.com/test').catch(function (err) {
      expect(err.name).to.equal('Error')
      expect(err.message).to.equal('nooooo')
    })
  })
})

describe('request', function () {
  it('should reject on timeout', function () {
    nock('http://example.com')
      .get('/test')
      .socketDelay(2000) // 2 seconds
      .reply(200, 'ok')
    return http.get({
      uri: 'http://example.com/test',
      timeout: 1500
    })
    .then(function (res) {
      expect().fail('should reject promise')
    })
    .catch(function (err) {
      expect(err).to.be.an(Error)
      expect(err.message).to.equal('timeout')
    })
  })

  it('should be passed to options.request', function () {
    var request
    nock('http://example.com')
      .get('/test')
      .reply(200, 'ok')

    return http.get({
      uri: 'http://example.com/test',
      request: function (req) {
        request = req
      }
    })
    .then(function (res) {
      expect(request).to.be.a(require('http').ClientRequest)
    })
  })
})
