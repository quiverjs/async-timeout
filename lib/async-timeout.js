
var error = require('quiver-error').error

var timeoutCallback = function(timeout, callback) {
  if(callback.timeoutCallback) return callback

  var timeoutError = false
  var callbackCalled = false

  var wrappedCallback = function() {
    if(timeoutError) return

    callbackCalled = true
    callback.apply(null, arguments)
    callback = null
  }

  wrappedCallback.timeoutCallback = true

  setTimeout(function() {
    if(callbackCalled) return

    timeoutError = true
    callback(error(500, 'async timeout'))
  }, timeout)

  return wrappedCallback
}

var timeoutFunction = function(timeout, func) {
  var wrappedFunction = function() {
    var args = [].slice.call(arguments)
    var callback = args.pop()

    var wrappedCallback = timeoutCallback(timeout, callback)
    args.push(wrappedCallback)

    func.apply(null, args)
  }

  return wrappedFunction
}

module.exports = {
  timeoutCallback: timeoutCallback,
  timeoutFunction: timeoutFunction
}