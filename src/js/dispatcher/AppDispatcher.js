"use strict";

var Promise = require('es6-promise');
var assign = require('object-assign');

var _callbacks = [];
var _promises = [];

var Dispatcher = function () {};

Dispatcher.prototype = assign({}, Dispatcher.prototype, {

  /**
  *
  *
  */
  register: function ( cb ) {
    _callbacks.push(cb);
    return _callbacks.length - 1; // index
  },

  dispatch: function ( payload ) {
    var resolves = [],
        rejects = [];

    _promises = _callbacks.map( function ( _, i ) {
      return new Promise( function ( resolve, reject ) {
        resolves[i] = resolve;
        rejects[i] = reject;
      });
    });

    _callbacks.forEach(function ( cb, i) {
      Promise.resolve( cb(payload) ).then( function () {
        resolves[i](payload);
      }, function () {
        rejects[i](new Error('Dispatcher callback unsuccessful'));
      });
    });

    _promises = [];
  }
});

module.exports = Dispatcher;
