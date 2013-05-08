
var should = require('should')
var asyncTimeout = require('../lib/async-timeout')

var timeout = 500

var testFunction = function(arg, callback) {
  arg.should.equal('arg')

  process.nextTick(function() {
    callback(null, 'success')
  })
}

var testTimeoutFunction = function(arg, callback) {
  arg.should.equal('arg')

  setTimeout(function() {
    callback(null, 'success')
  }, 1000)
}

describe('async timeout test', function() {
  it('callback on time should work', function(callback) {
    testFunction('arg', asyncTimeout.timeoutCallback(timeout, 
      function(err, result) {
        should.not.exist(err)
        result.should.equal('success')
        callback()
      }))
  })

  it('callback exceed time limit should fail', function(callback) {
    testTimeoutFunction('arg', asyncTimeout.timeoutCallback(timeout, 
      function(err, result) {
        should.exist(err)
        should.not.exist(result)
        callback()
      }))
  })

  it('wrapped function on time should work', function(callback) {
    var wrappedFunction = asyncTimeout.timeoutFunction(timeout, testFunction)
    wrappedFunction('arg', function(err, result) {
      should.not.exist(err)
      result.should.equal('success')
      callback()
    })
  })

  it('wrapped function exceed time should fail', function(callback) {
    var wrappedFunction = asyncTimeout.timeoutFunction(timeout, testTimeoutFunction)
    wrappedFunction('arg', function(err, result) {
      should.exist(err)
      should.not.exist(result)
      callback()
    })
  })
})