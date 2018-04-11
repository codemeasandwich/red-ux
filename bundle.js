'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, '__esModule', { value: true });

var reselect = require('reselect');

//=====================================================
//===================================== create selector
//=====================================================

function genCreateSelector(args, work) {

  if (Array.isArray(args) && args.length === work.length && work.length > 1) {
    var argsX = args.map(function (x, i) {
      return function (y) {
        return y[i];
      };
    });
    return reselect.createSelector.apply(reselect, _toConsumableArray(argsX).concat([work]));
  } /* else if("function" === typeof args){
     return createSelector(args,work)
    }*/
  return reselect.createSelector(function (x) {
    return x;
  }, work);
}

//=====================================================
//===================================+== process Nasted
//=====================================================

function nasted(state_selector, workers, run) {

  var level = {};
  if ("object" === (typeof workers === 'undefined' ? 'undefined' : _typeof(workers))) {

    for (var propName in workers) {
      level[propName] = nasted(state_selector[propName], workers[propName], run);
    }
    return level;
  } //else if("function" === typeof workers){

  if (run) {
    return workers(state_selector);
  }
  //  console.log(state_selector,workers)
  return genCreateSelector(state_selector, workers);
  //  }

  //  throw new Error("unknow type:"+JSON.stringify(workers))
}

//=====================================================
//======================================= from_function
//=====================================================

function from_function(selectors, workers) {

  var selectorMapped = {};

  //+++++++++++++++++++ map state to props from function
  //++++++++++++++++++++++++++++++++++++++++++++++++++++

  return function map_state_to_props_from_function(state, ownProps) {

    var map_state = selectors(state, ownProps);
    if (workers) {
      var _loop = function _loop(propName) {
        if (!selectorMapped[propName]) {
          selectorMapped[propName] = nasted(map_state[propName], workers[propName]);

          workers[propName] = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            if (args.length > 1) return selectorMapped[propName].apply(selectorMapped, _toConsumableArray(args.map(function (x) {
              return args;
            })));else return selectorMapped[propName](args[0]);
          }; // END transform for wraping worker
        } // END if ! selectorMapped[propName]

        map_state[propName] = nasted(map_state[propName], selectorMapped[propName], true);
      };

      for (var propName in workers) {
        _loop(propName);
      } // END for
    } // END if workers
    return map_state;
  }; // END map_state_to_props_from_function
} // END from_function

//=====================================================
//=================================== generat selectors
//=====================================================

function genSelectState(selectors, workers) {

  if ("function" === typeof selectors) {
    return from_function(selectors, workers);
  } else {
    //  throw new Error("'selectors' must be a function")
    return from_function(function (state) {
      return Object.keys(selectors).reduce(function (output, propName) {
        return Object.assign(output, _defineProperty({}, propName, Array.isArray(selectors[propName]) ? selectors[propName].map(function (fn) {
          return fn(state);
        }) : selectors[propName](state)));
      }, {});
    }, workers);
    //return from_object(selectors,workers)
  }
}

function shouldUpdate(current, next) {

  var currentKeys = Object.keys(current),
      nextKeys = Object.keys(next);

  if (currentKeys.length !== nextKeys.length) {
    return true;
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = currentKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (current[key] !== next[key]) {
        return true;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return false;
}

//=====================================================
//============================================== red-ux
//=====================================================

var index = {};

exports.default = index;
exports.genSelectState = genSelectState;
exports.shouldUpdate = shouldUpdate;
