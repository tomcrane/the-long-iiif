(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Using ES6 module pattern
var Example = exports.Example = function () {

  // Constructor
  function Example(name) {
    _classCallCheck(this, Example);

    this.setName(name);

    // Input box
    this.inputbox = document.querySelector('.c-example__input');

    // Output
    this.outputbox = document.querySelector('.c-example__output');

    // Greet
    this.buttonHello = document.querySelector('.c-example__hello');

    // Bye
    this.buttonGoodbye = document.querySelector('.c-example__goodbye');
  }

  // Methods


  _createClass(Example, [{
    key: 'run',
    value: function run() {
      var _this = this;

      // Add events
      if (this.inputbox !== null) {
        this.inputbox.addEventListener('change', function (e) {
          _this.setName(e.target.value);
        });
      }

      if (this.buttonHello !== null) {
        this.buttonHello.addEventListener('click', function () {
          _this.showOutput(_this.sayHello());
        });
      }

      if (this.buttonGoodbye !== null) {
        this.buttonGoodbye.addEventListener('click', function () {
          _this.showOutput(_this.sayGoodbye());
        });
      }
    }
  }, {
    key: 'setName',
    value: function setName(name) {
      this.name = name;
    }
  }, {
    key: 'showOutput',
    value: function showOutput(message) {
      this.outputbox.innerHTML = message;
    }
  }, {
    key: 'sayHello',
    value: function sayHello() {
      return 'Hello ' + this.name;
    }
  }, {
    key: 'sayGoodbye',
    value: function sayGoodbye() {
      return 'Goodbye ' + this.name;
    }
  }]);

  return Example;
}();

},{}],2:[function(require,module,exports){
'use strict';

var _example = require('./components/example.js');

var myExample = new _example.Example('World');
myExample.run();

},{"./components/example.js":1}]},{},[2]);
