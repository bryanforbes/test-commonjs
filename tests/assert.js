/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true newcap: true undef: true es5: true node: true devel: true
         forin: true */
/*global define: true */

(typeof define === "undefined" ? function ($) { $(require, exports, module) } : define)(function (require, exports, module, undefined) {

'use strict';

var run = require('../test').run
var Reporter = require('./utils/assert-report').Assert

exports['test existence of all assert methods on assert'] = function (assert) {
  var functionType, methods;
  functionType = 'function'
  methods = ['ok', 'equal', 'notEqual', 'deepEqual', 'notDeepEqual', 'throws']
  run({
    Assert: Reporter,
    mute: true,
    'test fixture': function ($) {
      methods.forEach(function (name) {
        assert.equal(typeof $[name], functionType,
                     '`' + name + '` must be method of `assert`')
      })
    }
  })
}

exports['test correctness of `assert.ok`'] = function (assert) {
  var valid, invalid, report
  valid = [1, -9, true, ',.', {}, function () {}, ['1'], Infinity]
  invalid = [null, undefined, false, '', 0, NaN]
  report = null

  run({
    Assert: Reporter,
    mute: true,
    'test fixture': function ($) {
      report = $.report
      valid.forEach(function (value, index) {
        $.ok(value, value + ' is valid')
        assert.equal(report.passes.length, index + 1,
                     'The `' + value + '` must be truthy')
      })

      invalid.forEach(function (value, index) {
        $.ok(value, value + ' is invalid')
        assert.equal(report.fails.length, index + 1,
                     'The `' + value + '` must be falsy')
      })
    }
  }, function() {
    assert.equal(report.passes.length, valid.length,
                   'Amount of passed test must match amount of valid inputs')
      assert.equal(report.fails.length, invalid.length,
                   'Amount of failed test must match amount of invalid inputs')
      assert.equal(report.errors.length, 0, 'Must be no errors')
  })
}

exports['test correctness of `assert.equal`'] = function (assert) {
  var valid, invalid, report

  valid = [
    [1, 1],
    [450, 450],
    ['string', '' + 's' + 'tring'],
    [undefined,
    {}.oops],
    [null, null],
    [String('test'), 'test'],
    [String('test'), String('test')],
    [null, undefined],
    [1, true],
    [2 / 0, Infinity],
    [JSON.stringify({
      bla: 3
    }), JSON.stringify({
      bla: 3
    })]
  ]
  invalid = [
    [0, 4],
    [0, null],
    [undefined, 0],
    [{}, {}],
    [NaN, NaN], // wtfjs
    [JSON.parse('{ "bla": 3 }'), JSON.parse('{ "bla": 3 }')]
  ]
  report = null

  run({
    Assert: Reporter,
    mute: true,
    'test fixture': function ($) {
      report = $.report
      valid.forEach(function (value, index) {
        var message = '`' + value[0] + '` is equal to `' + value[1] + '`'
        $.equal(value[0], value[1], message)
        assert.equal(report.passes.length, index + 1, message)
      })

      invalid.forEach(function (value, index) {
        var message = '`' + value[0] + '` is not equal to `' + value[1] + '`'
        $.equal(value[0], value[1], message)
        assert.equal(report.fails.length, index + 1, message)
      })
    }
  }, function() {
     assert.equal(report.passes.length, valid.length,
                   'Amount of passed test must match amount of valid inputs')
      assert.equal(report.fails.length, invalid.length,
                   'Amount of failed test must match amount of invalid inputs')
      assert.equal(report.errors.length, 0, 'Must be no errors')
  })
}

exports['test correctness of `assert.deepEqual`'] = function (assert) {
  var valid, invalid, report
  valid = [
    [ [], [] ],
    [ {}, {} ],
  ]
  invalid = [
    [ [], undefined ],
    [ [], [1] ]
  ]
  report = null

  run({
    Assert: Reporter,
    mute: true,
    'test fixture': function ($) {
      report = $.report
      valid.forEach(function (value, index) {
        var message = '`' + value[0] + '` is deepEqual of `' + value[1] + '`'
        $.deepEqual(value[0], value[1], message)
        assert.equal(report.passes.length, index + 1, message)
      })

      invalid.forEach(function (value, index) {
        var message = '`' + value[0] + '` is not deepEqual of `' + value[1] + '`'
        $.deepEqual(value[0], value[1], message)
        assert.equal(report.fails.length, index + 1, message)
      })
    }
  }, function() {
      assert.equal(report.passes.length, valid.length,
                   'Amount of passed test must match amount of valid inputs')
      assert.equal(report.fails.length, invalid.length,
                   'Amount of failed test must match amount of invalid inputs')
      assert.equal(report.errors.length, 0, 'Must be no errors')
  })
}


if (module == require.main) run(exports)

})