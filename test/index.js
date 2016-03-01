/* eslint-env mocha */

var http = require('../')
var nock = require('nock')
var expect = require('expect.js')

describe('built-in methods', function () {
  it('should exists', function () {
    var methods = ['get', 'post', 'patch', 'put', 'delete']
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
        // .matchHeader(' content-length', '13')
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
      // .matchHeader(' content-length', '13')
      .post('/test')
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
      // .matchHeader(' content-length', '6')
      .post('/test')
      .query({q: 'test'})
      .reply(201, 'ok')
    var options = {
      protocol: 'https:',
      host: 'example.com',
      path: '/test',
      query: {
        'q': 'test'
      }
    }
    return http.post(options, 'test=1').then(function (result) {
      expect(result.response.statusCode).to.equal(201)
      expect(result.data).to.equal('ok')
    })
  })
})

describe('JSON parsing', function () {
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
      expect(err.message).to.equal('Unexpected token i')
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
